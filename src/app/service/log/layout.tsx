import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mechanic Portal",
    description: "Vehicle maintenance logging for Motor Ambos partner mechanics.",
    robots: { index: false, follow: false },
};

export default function ServiceLogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
