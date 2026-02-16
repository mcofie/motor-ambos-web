import { MembershipsView } from "@/components/admin/views/MembershipsView";
import { getAdminMembershipPlans, getAdminMembersWithMemberships, getAdminAllVehicles } from "@/lib/adminServerFetch";

export const dynamic = 'force-dynamic'; // Ensure we always fetch fresh data

export default async function MembershipsPage() {
    // Fetch data in parallel for speed
    const [plans, members, allVehicles] = await Promise.all([
        getAdminMembershipPlans(),
        getAdminMembersWithMemberships(),
        getAdminAllVehicles()
    ]);

    return (
        <MembershipsView
            initialPlans={plans}
            initialMembers={members}
            initialAllVehicles={allVehicles}
        />
    );
}
