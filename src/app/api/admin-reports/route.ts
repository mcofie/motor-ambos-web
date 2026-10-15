import { NextResponse } from "next/server";
import { formatPhone } from "@/lib/phone";
import { createClient } from "@supabase/supabase-js";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { staffApiError } from "@/lib/serverAuth";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error("Missing Supabase Service Key or URL");
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
    db: { schema: 'motorambos' }
});

/** Whether a paper is in date, from its expiry date, matching the driver app's 30-day warning. */
function paperState(expires?: string | null) {
    if (!expires) return "NOT SET";
    const days = Math.ceil((new Date(`${expires.slice(0, 10)}T12:00:00`).getTime() - Date.now()) / 86_400_000);
    if (Number.isNaN(days)) return "NOT SET";
    if (days < 0) return "EXPIRED";
    return days <= 30 ? `DUE ${expires.slice(0, 10)}` : "VALID";
}

export async function POST(req: Request) {
    const accessError = await staffApiError();
    if (accessError) return accessError;
    try {
        const body = await req.json();
        const { org_id, startDate, endDate, includeServices, includeCompliance, includeFleetStats } = body;

        if (!org_id) return NextResponse.json({ error: "org_id is required" }, { status: 400 });

        // 1. Get Organization Details
        const { data: org, error: orgError } = await supabaseAdmin
            .from("members")
            .select("*")
            .eq("id", org_id)
            .single();

        if (orgError) throw orgError;
        const { data: contact } = org.contact_member_id
            ? await supabaseAdmin.from("members").select("full_name,email,phone").eq("id", org.contact_member_id).maybeSingle()
            : { data: null };

        // 2. Get All Vehicles in Fleet
        const { data: vehicles, error: vError } = await supabaseAdmin
            .from("vehicles")
            .select("*")
            .eq("user_id", org_id);

        if (vError) throw vError;

        if (!vehicles || vehicles.length === 0) {
            return NextResponse.json({ error: "No vehicles found for this organization." }, { status: 404 });
        }

        const vehicleIds = vehicles.map(v => v.id);

        // 3. Get Service Histories
        let services: { service_date?: string; description?: string; provider_name?: string; cost?: number; mileage?: number; vehicle_id?: string }[] = [];
        if (includeServices) {
            const { data: sData, error: sError } = await supabaseAdmin
                .from("service_history")
                .select("*")
                .in("vehicle_id", vehicleIds)
                .gte("service_date", startDate)
                .lte("service_date", endDate)
                .order("service_date", { ascending: false });
            if (!sError) services = sData || [];
        }

        // --- PDF GENERATION ---
        const doc = new jsPDF() as jsPDF & { lastAutoTable: { finalY: number } };
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        doc.setFillColor(16, 185, 129); // Emerald 500
        doc.rect(0, 0, pageWidth, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("FLEET AUDIT REPORT", 105, 20, { align: "center" });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`, 105, 30, { align: "center" });

        // Org Info
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(org.business_name || org.full_name, 14, 55);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Contact: ${contact?.full_name || org.full_name || 'N/A'}`, 14, 62);
        doc.text(`Phone: ${formatPhone(contact?.phone || org.phone) || 'N/A'}`, 14, 67);
        doc.text(`Business email: ${org.email || 'N/A'}`, 14, 72);
        doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 14, 72, { align: "right" });

        let currentY = 85;

        // Fleet Stats Section
        if (includeFleetStats) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Fleet Summary", 14, currentY);
            currentY += 5;
            doc.setDrawColor(200, 200, 200);
            doc.line(14, currentY, pageWidth - 14, currentY);
            currentY += 10;

            const totalVehicles = vehicles.length;
            const fullyCompliant = vehicles.filter(v => paperState(v.insurance_end_date) !== "EXPIRED" && paperState(v.insurance_end_date) !== "NOT SET" && paperState(v.roadworthy_expiry) !== "EXPIRED" && paperState(v.roadworthy_expiry) !== "NOT SET").length;

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text([
                `Total Vehicles: ${totalVehicles}`,
                `Papers in date: ${totalVehicles > 0 ? Math.round((fullyCompliant / totalVehicles) * 100) : 0}%`,
                `Total Service Records in Period: ${services.length}`
            ], 14, currentY);

            currentY += 25;
        }

        // Compliance Table
        if (includeCompliance) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Vehicle Compliance Status", 14, currentY);

            const complianceRows = vehicles.map(v => [
                v.plate || 'N/A',
                `${v.make || ''} ${v.model || ''}`,
                paperState(v.insurance_end_date),
                paperState(v.roadworthy_expiry),
                v.nfc_serial_number ? 'LINKED' : 'NONE'
            ]);

            autoTable(doc, {
                startY: currentY + 5,
                head: [['Plate', 'Vehicle', 'Insurance', 'Roadworthy', 'Smart Card']],
                body: complianceRows,
                headStyles: { fillColor: [17, 17, 246] },
                alternateRowStyles: { fillColor: [240, 240, 240] },
                margin: { left: 14, right: 14 }
            });

            currentY = doc.lastAutoTable.finalY + 20;
        }

        // Service Logs Table
        if (includeServices && services.length > 0) {
            if (currentY > 230) { doc.addPage(); currentY = 20; }

            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Activity & Service Logs", 14, currentY);

            const serviceRows = services.map(s => {
                const vehicle = vehicles.find(v => v.id === s.vehicle_id);
                return [
                    s.service_date ? new Date(s.service_date).toLocaleDateString("en-GB") : 'N/A',
                    vehicle?.plate || 'N/A',
                    s.description || '',
                    s.provider_name || 'N/A',
                    `GHS ${s.cost?.toLocaleString() || '0'}`
                ];
            });

            autoTable(doc, {
                startY: currentY + 5,
                head: [['Date', 'Vehicle', 'Description', 'Provider', 'Cost']],
                body: serviceRows,
                headStyles: { fillColor: [17, 17, 246] },
                margin: { left: 14, right: 14 }
            });

            currentY = doc.lastAutoTable.finalY + 20;
        }

        // Footer on all pages
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text("CONFIDENTIAL - MOTORAMBOS FLEET MANAGEMENT SYSTEM", 105, 285, { align: "center" });
            doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, 285, { align: "right" });
        }

        const pdfArrayBuffer = doc.output('arraybuffer');

        return new Response(pdfArrayBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="Fleet_Report_${org.business_name || 'Organization'}.pdf"`
            }
        });

    } catch (e) {
        console.error("Report API Error:", e);
        return NextResponse.json({ error: e instanceof Error ? e.message : "Something went wrong" }, { status: 500 });
    }
}
