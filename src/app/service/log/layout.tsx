import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mechanic Portal | MotorAmbos",
    description: "Verified vehicle maintenance logging for MotorAmbos partner mechanics.",
};

export default function ServiceLogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
