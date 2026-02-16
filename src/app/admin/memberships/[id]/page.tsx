import { MemberDetailView } from "@/components/admin/views/MemberDetailView";
import { getAdminMemberDetails } from "@/lib/adminServerFetch";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function MemberDetailPage({ params }: PageProps) {
    const { id } = await params;
    const data = await getAdminMemberDetails(id);

    return (
        <MemberDetailView
            memberId={id}
            initialMember={data?.member}
            initialVehicles={data?.vehicles}
        />
    );
}
