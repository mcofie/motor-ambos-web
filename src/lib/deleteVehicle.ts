import { getServiceClient } from "@/lib/serverAuth";

type Service = ReturnType<typeof getServiceClient>;
export type DeleteVehicleResult = { ok: true; plate: string | null; name: string | null } | { ok: false; status: number; error: string };

/**
 * Deletes a car and everything logged against it: fill-ups and charges, services, problems, papers
 * and their files, and its photo. Its Smart Card is freed to link elsewhere and its driver is taken
 * off it. Callers check the person may do this first.
 */
export async function deleteVehicle(service: Service, vehicleId: string): Promise<DeleteVehicleResult> {
    let { data: vehicle } = await service.from("vehicles").select("plate,make,model,nfc_serial_number,photo_path").eq("id", vehicleId).maybeSingle();
    if (!vehicle) ({ data: vehicle } = await service.from("vehicles").select("plate,make,model,nfc_serial_number").eq("id", vehicleId).maybeSingle() as { data: typeof vehicle });
    const { data: documents } = await service.from("portal_vehicle_documents").select("storage_path").eq("vehicle_id", vehicleId);

    // Rows that point at the car without cascading. Each step is idempotent, so a retry is safe.
    const steps = await Promise.all([
        service.from("fuel_logs").delete().eq("vehicle_id", vehicleId),
        service.from("service_history").delete().eq("vehicle_id", vehicleId),
        service.from("organization_members").update({ vehicle_id: null }).eq("vehicle_id", vehicleId),
    ]);
    const failed = steps.find((step) => step.error);
    if (failed?.error) {
        console.error("Vehicle delete: clearing linked rows failed", vehicleId, failed.error);
        return { ok: false, status: 500, error: "Could not delete this vehicle" };
    }

    const { error } = await service.from("vehicles").delete().eq("id", vehicleId);
    if (error) {
        console.error("Vehicle delete failed", vehicleId, error);
        return error.code === "23503"
            ? { ok: false, status: 409, error: "This vehicle is still linked to other records. Contact support@motorambos.com to remove it." }
            : { ok: false, status: 500, error: "Could not delete this vehicle" };
    }

    // The car is gone: free its card and remove its files. Failures here only leave orphans.
    if (vehicle?.nfc_serial_number) await service.from("nfc_cards").update({ status: "MANUFACTURED" }).eq("serial_number", vehicle.nfc_serial_number);
    const paths = [...(documents || []).map((document) => document.storage_path), (vehicle as { photo_path?: string | null } | null)?.photo_path].filter((path): path is string => Boolean(path));
    if (paths.length) await service.storage.from("vehicle-documents").remove(paths);
    return { ok: true, plate: vehicle?.plate || null, name: [vehicle?.make, vehicle?.model].filter(Boolean).join(" ") || null };
}
