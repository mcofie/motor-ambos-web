import React from "react";
import { RequestStatus } from "../types";

export const cls = (...arr: Array<string | false | null | undefined>) => arr.filter(Boolean).join(" ");

export type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface TextFieldProps {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
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
    type = "text",
    placeholder,
    required,
    className,
    icon: Icon,
}: TextFieldProps) {
    return (
        <div className={cls("space-y-1.5", className)}>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                {Icon && <Icon className="w-3 h-3" />}
                {label} {required && <span className="text-destructive">*</span>}
            </label>
            <input
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-foreground"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
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
        pending: "bg-amber-100/50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
        accepted: "bg-blue-100/50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
        in_progress: "bg-primary/10 text-primary border-primary/20",
        completed: "bg-emerald-100/50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
        cancelled: "bg-destructive/10 text-destructive border-destructive/20",
    };

    return (
        <span
            className={cls(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
                styles[s] || styles.pending
            )}
        >
            {s.replace("_", " ")}
        </span>
    );
}

export function StatCard({
    title,
    value,
    icon: Icon,
    color,
}: {
    title: string;
    value: string | number;
    icon: IconType;
    color: string;
}) {
    return (
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
            <div className={cls("p-3 rounded-lg text-white shadow-sm", color)}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
                <p className="text-xl font-bold text-foreground">{value}</p>
            </div>
        </div>
    );
}
