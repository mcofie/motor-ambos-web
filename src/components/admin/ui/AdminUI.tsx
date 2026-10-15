import React from "react";
import { RequestStatus } from "../types";

export const cls = (...arr: Array<string | false | null | undefined>) => arr.filter(Boolean).join(" ");

export type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface TextFieldProps {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    onBlur?: () => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    icon?: IconType;
}

export function TextField({
    label,
    value,
    onChange,
    onBlur,
    type = "text",
    placeholder,
    required,
    className,
    icon: Icon,
}: TextFieldProps) {
    return (
        <div className={cls("space-y-1.5", className)}>
            <label className="flex items-center gap-2 text-[13px] text-[#666]">
                {Icon && <Icon className="w-3 h-3" />}
                {label} {required && <span className="text-destructive">*</span>}
            </label>
            <input
                className="flex h-11 w-full rounded-[10px] border border-[#DEDEDE] bg-white px-3.5 py-2 text-[15px] text-[#171717] placeholder:text-[#AAA] outline-none transition-colors focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/10"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                type={type}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
}

export const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cls(
            "group flex items-center justify-between gap-3 rounded-lg border p-3 shadow-sm transition-all duration-200",
            checked ? "border-primary/50 bg-primary/5" : "border-input bg-background hover:border-accent"
        )}
    >
        <span className={cls("text-sm font-medium", checked ? "text-primary" : "text-muted-foreground")}>{label}</span>
        <span
            className={cls(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                checked ? "bg-primary" : "bg-muted"
            )}
        >
            <span
                aria-hidden="true"
                className={cls(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
                    checked ? "translate-x-4" : "translate-x-0"
                )}
            />
        </span>
    </button>
);

export function StatusBadge({ status }: { status: string }) {
    const s = (status || "pending") as RequestStatus;
    const styles: Record<RequestStatus, string> = {
        pending: "bg-[#FFF4DF] text-[#915C12]",
        accepted: "bg-[#EEEEFF] text-[#1111F6]",
        in_progress: "bg-[#EEEEFF] text-[#1111F6]",
        completed: "bg-[#EAF7F0] text-[#197252]",
        cancelled: "bg-[#FFF0EF] text-[#AA3333]",
    };
    const label = s.replace("_", " ");
    return <span className={cls("inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[12px]", styles[s] || styles.pending)}>{label.charAt(0).toUpperCase() + label.slice(1)}</span>;
}

/** Papers status from an expiry date, matching the driver app. */
export function paperStatus(expiresOn: string | null | undefined) {
    const date = expiresOn?.slice(0, 10);
    if (!date) return { label: "Not set", tone: "bg-[#F2F2F2] text-[#666]" };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.ceil((new Date(`${date}T12:00:00`).getTime() - today.getTime()) / 86_400_000);
    if (Number.isNaN(days)) return { label: "Not set", tone: "bg-[#F2F2F2] text-[#666]" };
    if (days < 0) return { label: "Expired", tone: "bg-[#FFF0EF] text-[#AA3333]" };
    if (days <= 30) return { label: "Due soon", tone: "bg-[#FFF4DF] text-[#915C12]" };
    return { label: "Valid", tone: "bg-[#EAF7F0] text-[#197252]" };
}

/** A number with a label, in the same style as the driver app's tiles. The colour prop is kept for older callers. */
export function StatCard({
    title,
    value,
    icon: Icon,
}: {
    title: string;
    value: string | number;
    icon: IconType;
    color?: string;
}) {
    return (
        <div className="flex items-start justify-between gap-3 rounded-[16px] border border-[#EAEAEA] bg-white p-5">
            <div className="min-w-0">
                <p className="text-[28px] leading-none tracking-[-0.04em] text-[#171717]">{value}</p>
                <p className="mt-2 text-[13px] text-[#777]">{title}</p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#F3F3FF] text-[#1111F6]"><Icon className="h-5 w-5" /></span>
        </div>
    );
}
