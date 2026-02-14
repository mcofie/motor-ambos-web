"use client";

import { use } from "react";
import { MemberDetailView } from "@/components/admin/views/MemberDetailView";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function MemberDetailPage({ params }: PageProps) {
    const { id } = use(params);
    return <MemberDetailView memberId={id} />;
}
