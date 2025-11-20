// src/components/AdminDashboard.tsx
"use client";

import React from "react";
import {
    getUser,
    logout,
    listProviders,
    insertProvider,
    updateProvider,
    deleteProvider,
    listRequests,
    listServices,
    setProviderServices,
    getProviderServiceIds,
    updateRequestStatus,
    listProviderRates,
    upsertProviderRates,
} from "@/lib/supaFetch";

import {
    Wrench,
    LifeBuoy,
    UserCog,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    Phone,
    MapPin,
    AlertCircle,
    RefreshCw,
    LogOut,
} from "lucide-react";

/* ---------------- Types ---------------- */

type UUID = string;

export interface ProviderRow {
    id: UUID;
    display_name: string;
    phone_business: string | null;
    about: string | null;
    address_line: string | null;
    is_active: boolean;
    coverage_radius_km: number | null;
    callout_fee: number | null;
    lng?: number | null;
    lat?: number | null;
    created_at?: string;
    updated_at?: string;
    is_verified?: boolean | null;
}

export type ProviderInsert = {
    display_name: string;
    phone_business?: string | null;
    about?: string | null;
    address_line?: string | null;
    is_active: boolean;
    coverage_radius_km: number;
    callout_fee: number;
    lng?: number | null;
    lat?: number | null;
    created_at?: string;
    is_verified?: boolean;
};

export interface ServiceRow {
    id: UUID;
    name: string;
    code?: string | null;
}

export interface RequestRow {
    id: UUID;
    created_at: string;
    service_id: UUID | null;
    status: string | null;
    driver_name: string | null;
    driver_phone?: string | null;
    provider_id: UUID | null;
    details?: string | null;
    address_line?: string | null;
    location?: unknown;
}

type RequestStatus =
    | "pending"
    | "accepted"
    | "in_progress"
    | "completed"
    | "cancelled";

interface ProviderRateRow {
    service_id: UUID;
    base_price: number | null;
    price_unit: string | null;
}

/* --------------- UI helpers --------------- */

const cls = (...arr: Array<string | false | null | undefined>) =>
    arr.filter(Boolean).join(" ");

interface TextFieldProps {
    label: string;
    value: string | number;
    onChange: (v: string) => void;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    required?: boolean;
    autoComplete?: string;
}

function TextField({
                       label,
                       value,
                       onChange,
                       type = "text",
                       placeholder,
                       required,
                       autoComplete,
                   }: TextFieldProps) {
    return (
        <label className="block text-xs sm:text-sm">
            <span className="font-medium text-slate-100/90">{label}</span>
            <input
                className="mt-1 w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
                value={value ?? ""}
                onChange={(e) => onChange((e.target as HTMLInputElement).value)}
                type={type}
                placeholder={placeholder}
                required={required}
                autoComplete={autoComplete}
            />
        </label>
    );
}

const NumberField: React.FC<
    Omit<TextFieldProps, "type" | "onChange" | "value"> & {
    value: number | string;
    onChange: (v: string) => void;
}
> = (p) => <TextField {...p} type="number" />;

const Toggle = ({
                    label,
                    checked,
                    onChange,
                }: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="inline-flex items-center gap-2 select-none text-xs sm:text-sm"
    >
    <span
        className={cls(
            "relative inline-flex h-5 w-9 items-center rounded-full border transition",
            checked
                ? "border-emerald-500 bg-emerald-500/15"
                : "border-slate-600 bg-slate-800",
        )}
    >
      <span
          className={cls(
              "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition",
              checked ? "translate-x-4" : "translate-x-1",
          )}
      />
    </span>
        <span className="text-slate-100/90">{label}</span>
    </button>
);

function Section({
                     title,
                     subtitle,
                     actions,
                     children,
                 }: React.PropsWithChildren<{
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}>) {
    return (
        <section className="rounded-2xl bg-slate-900/80 p-4 shadow-lg shadow-black/30 ring-1 ring-slate-800/80 backdrop-blur sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 className="text-base font-semibold text-slate-50 sm:text-lg">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">{actions}</div>
            </div>
            {children}
        </section>
    );
}

function Empty({
                   title = "Nothing here yet",
                   subtitle,
               }: {
    title?: string;
    subtitle?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-slate-500">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/80 text-slate-400">
                <LifeBuoy className="h-5 w-5" />
            </div>
            <p className="mt-1 text-sm font-medium text-slate-200">{title}</p>
            {subtitle && <p className="text-xs sm:text-sm">{subtitle}</p>}
        </div>
    );
}

function StatusPill({ status }: { status: RequestStatus | string | null }) {
    const s = (status || "pending") as RequestStatus;
    const map: Record<
        RequestStatus,
        { label: string; className: string; icon?: React.ReactNode }
    > = {
        pending: {
            label: "Pending",
            className: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/40",
            icon: <AlertCircle className="h-3.5 w-3.5" />,
        },
        accepted: {
            label: "Accepted",
            className: "bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/40",
            icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        },
        in_progress: {
            label: "In progress",
            className:
                "bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-500/40",
            icon: <LifeBuoy className="h-3.5 w-3.5" />,
        },
        completed: {
            label: "Completed",
            className:
                "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/40",
            icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        },
        cancelled: {
            label: "Cancelled",
            className: "bg-red-500/10 text-red-300 ring-1 ring-red-500/40",
            icon: <XCircle className="h-3.5 w-3.5" />,
        },
    };

    const cfg = map[s] ?? map.pending;

    return (
        <span
            className={cls(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px]",
                cfg.className,
            )}
        >
      {cfg.icon}
            <span>{cfg.label}</span>
    </span>
    );
}

function Tabs({
                  tabs,
                  active,
                  onChange,
              }: {
    tabs: string[];
    active: string;
    onChange: (t: string) => void;
}) {
    return (
        <div className="mb-6 inline-flex w-full items-center justify-start rounded-2xl bg-slate-950/70 p-1 shadow-lg shadow-black/30 ring-1 ring-slate-800/80">
            {tabs.map((t) => {
                const isActive = active === t;
                const Icon =
                    t === "Providers" ? Wrench : t === "Requests" ? LifeBuoy : UserCog;

                return (
                    <button
                        key={t}
                        onClick={() => onChange(t)}
                        className={cls(
                            "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition sm:text-sm",
                            isActive
                                ? "bg-slate-100 text-slate-900 shadow-sm"
                                : "text-slate-200 hover:bg-slate-900/60",
                        )}
                    >
                        <Icon className={cls("h-4 w-4", isActive && "text-slate-900")} />
                        <span>{t}</span>
                    </button>
                );
            })}
        </div>
    );
}

/* ---------------- Providers ---------------- */

type ProviderFormState = {
    id: UUID | null;
    display_name: string;
    phone_business: string;
    about: string;
    address_line: string;
    is_active: boolean;
    coverage_radius_km: number | string;
    callout_fee: number | string;
    lng: number | string;
    lat: number | string;
    is_verified: boolean;
};

function ProvidersPanel() {
    const empty: ProviderFormState = {
        id: null,
        display_name: "",
        phone_business: "",
        about: "",
        address_line: "",
        is_active: true,
        coverage_radius_km: 10,
        callout_fee: 0,
        lng: "",
        lat: "",
        is_verified: true,
    };

    const [form, setForm] = React.useState<ProviderFormState>({ ...empty });
    const [list, setList] = React.useState<ProviderRow[]>([]);
    const [q, setQ] = React.useState<string>("");
    const [saving, setSaving] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);
    const [ok, setOk] = React.useState<string | null>(null);

    const [services, setServices] = React.useState<ServiceRow[]>([]);
    const [selectedServiceIds, setSelectedServiceIds] = React.useState<UUID[]>(
        [],
    );

    type ServiceRateForm = { base_price: string; price_unit: string };
    const [serviceRates, setServiceRates] = React.useState<
        Record<UUID, ServiceRateForm>
    >({});

    const toggleService = (id: UUID) =>
        setSelectedServiceIds((s) =>
            s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
        );

    const updateServiceRate = (id: UUID, patch: Partial<ServiceRateForm>) =>
        setServiceRates((prev) => {
            const current = prev[id] ?? { base_price: "", price_unit: "" };
            return {
                ...prev,
                [id]: { ...current, ...patch },
            };
        });

    const load = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const rows = await listProviders(q);
            setList(rows as ProviderRow[]);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [q]);

    React.useEffect(() => {
        (async () => {
            try {
                const svcs = await listServices();
                setServices(svcs as ServiceRow[]);
            } catch (e) {
                console.warn("[ProvidersPanel] failed loading services:", e);
            }
            load();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const t = setTimeout(load, 300);
        return () => clearTimeout(t);
    }, [q, load]);

    async function save() {
        setSaving(true);
        setError(null);
        setOk(null);
        try {
            const payload: ProviderInsert = {
                display_name: form.display_name.trim(),
                phone_business: form.phone_business || null,
                about: form.about || null,
                address_line: form.address_line || null,
                is_active: !!form.is_active,
                coverage_radius_km: Number(form.coverage_radius_km) || 10,
                callout_fee: Number(form.callout_fee) || 0,
                is_verified: !!form.is_verified,
            };

            const hasCoords =
                form.lng !== "" &&
                form.lat !== "" &&
                !Number.isNaN(Number(form.lng)) &&
                !Number.isNaN(Number(form.lat));

            if (hasCoords) {
                payload.lng = Number(form.lng);
                payload.lat = Number(form.lat);
            }

            if (!payload.display_name) throw new Error("Provider name is required");

            let providerId: UUID;
            if (form.id) {
                const row = (await updateProvider(form.id, {
                    ...payload,
                    updated_at: new Date().toISOString(),
                })) as ProviderRow | null;
                providerId = row?.id ?? form.id;
                setOk("Provider updated.");
            } else {
                const row = (await insertProvider(payload)) as ProviderRow | null;
                if (!row?.id) throw new Error("Insert succeeded but no row returned");
                providerId = row.id;
                setOk("Provider created.");
            }

            await setProviderServices(providerId, selectedServiceIds);

            if (services.length > 0) {
                const ratePayload = services.map((svc) => {
                    const rate = serviceRates[svc.id];
                    const selected = selectedServiceIds.includes(svc.id);

                    const base_price =
                        rate && rate.base_price.trim() !== ""
                            ? Number(rate.base_price)
                            : 0;

                    const price_unit =
                        rate && rate.price_unit.trim() !== ""
                            ? rate.price_unit.trim()
                            : "job";

                    return {
                        service_id: svc.id,
                        base_price,
                        price_unit,
                        min_callout_fee: null,
                        is_active: selected,
                    };
                });

                await upsertProviderRates(providerId, ratePayload);
            }

            setForm({ ...empty });
            setSelectedServiceIds([]);
            setServiceRates({});
            load();
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            setError(msg);
        } finally {
            setSaving(false);
        }
    }

    async function remove(row: ProviderRow) {
        if (!confirm(`Delete provider “${row.display_name || row.id}”?`)) return;
        setSaving(true);
        setError(null);
        setOk(null);
        try {
            await deleteProvider(row.id);
            setOk("Provider deleted.");
            load();
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            setError(msg);
        } finally {
            setSaving(false);
        }
    }

    async function startEdit(row: ProviderRow) {
        setForm({
            id: row.id,
            display_name: row.display_name || "",
            phone_business: row.phone_business || "",
            about: row.about || "",
            address_line: row.address_line || "",
            is_active: !!row.is_active,
            coverage_radius_km: row.coverage_radius_km ?? 10,
            callout_fee: Number(row.callout_fee ?? 0),
            lng: row.lng ?? "",
            lat: row.lat ?? "",
            is_verified: !!row.is_verified,
        });

        try {
            const ids = await getProviderServiceIds(row.id);
            setSelectedServiceIds(ids as UUID[]);

            const rateRows = (await listProviderRates(
                row.id,
            )) as ProviderRateRow[];
            const rateState: Record<UUID, ServiceRateForm> = {};
            rateRows.forEach((r) => {
                rateState[r.service_id] = {
                    base_price: r.base_price != null ? String(r.base_price) : "",
                    price_unit: r.price_unit ?? "",
                };
            });
            setServiceRates(rateState);
        } catch (e) {
            console.warn(
                "[ProvidersPanel] failed to load provider services/rates:",
                e,
            );
            setSelectedServiceIds([]);
            setServiceRates({});
        }
    }

    return (
        <div className="space-y-6">
            {/* Form + Services */}
            <Section
                title={form.id ? "Edit provider" : "Add provider"}
                subtitle="Set up details, coverage, verification and services for a roadside provider."
                actions={
                    form.id && (
                        <button
                            onClick={() => {
                                setForm({ ...empty });
                                setSelectedServiceIds([]);
                                setServiceRates({});
                            }}
                            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-800 sm:text-sm"
                        >
                            Clear form
                        </button>
                    )
                }
            >
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Left: core provider details */}
                    <div className="space-y-3 lg:col-span-2">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <TextField
                                label="Provider name"
                                value={form.display_name}
                                onChange={(v) => setForm((s) => ({ ...s, display_name: v }))}
                                required
                                placeholder="e.g. Kofi Mobile Auto"
                            />
                            <TextField
                                label="Business phone"
                                value={form.phone_business}
                                onChange={(v) =>
                                    setForm((s) => ({ ...s, phone_business: v }))
                                }
                                placeholder="+233…"
                            />
                            <TextField
                                label="Address line"
                                value={form.address_line}
                                onChange={(v) =>
                                    setForm((s) => ({ ...s, address_line: v }))
                                }
                                placeholder="e.g. Spintex Road, Accra"
                            />
                            <NumberField
                                label="Coverage radius (km)"
                                value={form.coverage_radius_km}
                                onChange={(v) =>
                                    setForm((s) => ({ ...s, coverage_radius_km: v }))
                                }
                            />
                            <NumberField
                                label="Callout fee (min)"
                                value={form.callout_fee}
                                onChange={(v) => setForm((s) => ({ ...s, callout_fee: v }))}
                            />

                            {/* Coordinates */}
                            <NumberField
                                label="Longitude (optional)"
                                value={form.lng}
                                onChange={(v) => setForm((s) => ({ ...s, lng: v }))}
                            />
                            <NumberField
                                label="Latitude (optional)"
                                value={form.lat}
                                onChange={(v) => setForm((s) => ({ ...s, lat: v }))}
                            />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                            <div className="flex flex-wrap gap-3">
                                <Toggle
                                    label="Provider is active"
                                    checked={form.is_active}
                                    onChange={(v) =>
                                        setForm((s) => ({ ...s, is_active: v }))
                                    }
                                />
                                <Toggle
                                    label="Verified provider"
                                    checked={form.is_verified}
                                    onChange={(v) =>
                                        setForm((s) => ({ ...s, is_verified: v }))
                                    }
                                />
                            </div>
                            <div className="text-[11px] text-slate-400">
                                {saving ? "Saving…" : loading ? "Loading…" : "Idle"}
                            </div>
                        </div>

                        <label className="block text-xs sm:text-sm">
                            <span className="font-medium text-slate-100/90">About</span>
                            <textarea
                                className="mt-1 w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
                                rows={3}
                                value={form.about ?? ""}
                                onChange={(e) =>
                                    setForm((s) => ({
                                        ...s,
                                        about: (e.target as HTMLTextAreaElement).value,
                                    }))
                                }
                                placeholder="Short description of the provider, specialties, etc."
                            />
                        </label>
                    </div>

                    {/* Right: services checklist + rates */}
                    <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-2">
                            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-100 sm:text-sm">
                                <Wrench className="h-4 w-4 text-emerald-400" />
                                <span>Services &amp; rates</span>
                            </p>
                            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400">
                {selectedServiceIds.length} selected
              </span>
                        </div>
                        {services.length === 0 ? (
                            <p className="text-xs text-slate-400">
                                No services defined yet. Add services in the database first.
                            </p>
                        ) : (
                            <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
                                {services.map((svc) => {
                                    const selected = selectedServiceIds.includes(svc.id);
                                    const rate = serviceRates[svc.id] ?? {
                                        base_price: "",
                                        price_unit: "",
                                    };

                                    return (
                                        <div
                                            key={svc.id}
                                            className={cls(
                                                "flex items-center justify-between gap-3 rounded-xl border px-3 py-1.5 text-xs sm:text-sm",
                                                selected
                                                    ? "border-emerald-500/40 bg-slate-900/90"
                                                    : "border-slate-800 bg-slate-950/80",
                                            )}
                                        >
                                            <label className="flex min-w-0 items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="h-3.5 w-3.5 rounded border-slate-500 text-emerald-400"
                                                    checked={selected}
                                                    onChange={() => toggleService(svc.id)}
                                                />
                                                <span className="truncate text-slate-100">
                          {svc.name}
                        </span>
                                            </label>

                                            {/* Rate inputs */}
                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    type="number"
                                                    inputMode="decimal"
                                                    placeholder="Rate"
                                                    className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-50 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/30"
                                                    value={rate.base_price}
                                                    onChange={(e) =>
                                                        updateServiceRate(svc.id, {
                                                            base_price: (
                                                                e.target as HTMLInputElement
                                                            ).value,
                                                        })
                                                    }
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="unit"
                                                    className="w-16 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-50 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/30"
                                                    value={rate.price_unit}
                                                    onChange={(e) =>
                                                        updateServiceRate(svc.id, {
                                                            price_unit: (
                                                                e.target as HTMLInputElement
                                                            ).value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-3">
                    {ok && <p className="text-xs text-emerald-400">{ok}</p>}
                    {error && <p className="text-xs text-red-400">{error}</p>}
                    <button
                        onClick={save}
                        disabled={saving || !form.display_name.trim()}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-medium text-emerald-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:opacity-50 sm:text-sm"
                    >
                        {saving ? (
                            <>
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                Saving…
                            </>
                        ) : form.id ? (
                            "Save changes"
                        ) : (
                            "Add provider"
                        )}
                    </button>
                </div>
            </Section>

            {/* Provider list */}
            <Section
                title="Providers"
                subtitle="Search, edit or remove existing providers."
                actions={
                    <input
                        placeholder="Search by name…"
                        className="w-40 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 sm:w-60 sm:text-sm"
                        value={q}
                        onChange={(e) => setQ((e.target as HTMLInputElement).value)}
                    />
                }
            >
                {loading && (
                    <p className="py-8 text-center text-sm text-slate-400">Loading…</p>
                )}
                {!loading && list.length === 0 && (
                    <Empty
                        title="No providers yet"
                        subtitle="Use the form above to add your first provider."
                    />
                )}
                {!loading && list.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-xs sm:text-sm">
                            <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/80 text-left text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                <th className="px-3 py-2">Name</th>
                                <th className="px-3 py-2">Phone</th>
                                <th className="px-3 py-2">Active</th>
                                <th className="px-3 py-2">Verified</th>
                                <th className="px-3 py-2">Radius</th>
                                <th className="px-3 py-2">Callout fee</th>
                                <th className="px-3 py-2">Address</th>
                                <th className="px-3 py-2 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {list.map((row, idx) => (
                                <tr
                                    key={row.id}
                                    className={cls(
                                        "border-b border-slate-800/70",
                                        idx % 2 === 1 && "bg-slate-950/50",
                                    )}
                                >
                                    <td className="px-3 py-2 text-slate-100">
                                        <div className="flex items-center gap-1.5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                                            <div>
                                                <div className="font-medium">
                                                    {row.display_name || "Untitled provider"}
                                                </div>
                                                {row.about && (
                                                    <div className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
                                                        {row.about}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-slate-200">
                                        {row.phone_business ? (
                                            <a
                                                href={`tel:${row.phone_business}`}
                                                className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 hover:underline"
                                            >
                                                <Phone className="h-3.5 w-3.5" />
                                                {row.phone_business}
                                            </a>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                    <td className="px-3 py-2">
                      <span
                          className={cls(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px]",
                              row.is_active
                                  ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/40"
                                  : "bg-slate-700/60 text-slate-300 ring-1 ring-slate-600",
                          )}
                      >
                        <span className="h-2 w-2 rounded-full bg-current opacity-80" />
                          {row.is_active ? "Active" : "Inactive"}
                      </span>
                                    </td>
                                    <td className="px-3 py-2">
                      <span
                          className={cls(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px]",
                              row.is_verified
                                  ? "bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/40"
                                  : "bg-slate-700/60 text-slate-300 ring-1 ring-slate-600",
                          )}
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                          {row.is_verified ? "Verified" : "Unverified"}
                      </span>
                                    </td>
                                    <td className="px-3 py-2 text-slate-200">
                                        {row.coverage_radius_km ?? "—"}{" "}
                                        {row.coverage_radius_km != null && "km"}
                                    </td>
                                    <td className="px-3 py-2 text-slate-200">
                                        {row.callout_fee != null ? `GH₵${row.callout_fee}` : "—"}
                                    </td>
                                    <td className="px-3 py-2 text-slate-200">
                                        {row.address_line || "—"}
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => startEdit(row)}
                                                className="rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-100 hover:bg-slate-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => remove(row)}
                                                className="rounded-xl border border-red-500/40 bg-red-950/60 px-2.5 py-1 text-[11px] text-red-100 hover:bg-red-900/80"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Section>
        </div>
    );
}

/* ---------------- Requests ---------------- */

function RequestsPanel() {
    const [list, setList] = React.useState<RequestRow[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [status, setStatus] = React.useState<string>("pending");
    const [q, setQ] = React.useState<string>("");
    const [error, setError] = React.useState<string | null>(null);
    const [updatingId, setUpdatingId] = React.useState<string | null>(null);

    const load = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const rows = (await listRequests(status || undefined)) as RequestRow[];
            const qq = q.toLowerCase();
            setList(
                qq
                    ? rows.filter((r) =>
                        [r.status, r.driver_name, r.id].some((v) =>
                            String(v || "").toLowerCase().includes(qq),
                        ),
                    )
                    : rows,
            );
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [status, q]);

    React.useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    React.useEffect(() => {
        const t = setTimeout(load, 250);
        return () => clearTimeout(t);
    }, [status, q, load]);

    async function handleStatusChange(id: string, next: RequestStatus) {
        setUpdatingId(id);
        setError(null);
        try {
            await updateRequestStatus(id, next);

            setList((prev) =>
                prev.map((r) =>
                    r.id === id
                        ? {
                            ...r,
                            status: next,
                        }
                        : r,
                ),
            );
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            setError(msg);
        } finally {
            setUpdatingId(null);
        }
    }

    return (
        <div className="space-y-6">
            <Section
                title="Requests"
                subtitle="View incoming roadside requests and manage their lifecycle."
                actions={
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 sm:text-sm"
                            value={status}
                            onChange={(e) =>
                                setStatus((e.target as HTMLSelectElement).value)
                            }
                        >
                            <option value="">All statuses</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="in_progress">In progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <input
                            placeholder="Search…"
                            className="w-32 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 sm:w-48 sm:text-sm"
                            value={q}
                            onChange={(e) => setQ((e.target as HTMLInputElement).value)}
                            onKeyDown={(e) =>
                                (e as React.KeyboardEvent<HTMLInputElement>).key ===
                                "Enter" && load()
                            }
                        />
                        <button
                            onClick={load}
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-800 sm:text-sm"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Refresh
                        </button>
                    </div>
                }
            >
                {error && (
                    <p className="mb-2 text-xs text-red-400 sm:text-sm">{error}</p>
                )}
                {loading && (
                    <p className="py-8 text-center text-sm text-slate-400">Loading…</p>
                )}
                {!loading && list.length === 0 && <Empty title="No requests found" />}
                {!loading && list.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-xs sm:text-sm">
                            <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/80 text-left text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                <th className="px-3 py-2">When</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Driver</th>
                                <th className="px-3 py-2">Phone</th>
                                <th className="px-3 py-2">Provider</th>
                            </tr>
                            </thead>
                            <tbody>
                            {list.map((r) => (
                                <tr key={r.id} className="border-t border-slate-800/70">
                                    <td className="px-3 py-2 text-slate-200">
                                        {new Date(r.created_at).toLocaleString()}
                                    </td>

                                    {/* Status with pill + select */}
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <StatusPill status={r.status as RequestStatus} />
                                            <select
                                                className="rounded-full border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 sm:text-xs"
                                                value={r.status ?? "pending"}
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        r.id,
                                                        e.target.value as RequestStatus,
                                                    )
                                                }
                                                disabled={updatingId === r.id}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="accepted">Accepted</option>
                                                <option value="in_progress">In progress</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </td>

                                    {/* Driver */}
                                    <td className="px-3 py-2 text-slate-200">
                                        {r.driver_name || "—"}
                                    </td>

                                    {/* Phone */}
                                    <td className="px-3 py-2 text-slate-200">
                                        {r.driver_phone ? (
                                            <a
                                                href={`tel:${r.driver_phone}`}
                                                className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 hover:underline"
                                            >
                                                <Phone className="h-3.5 w-3.5" />
                                                {r.driver_phone}
                                            </a>
                                        ) : (
                                            "—"
                                        )}
                                    </td>

                                    {/* Provider */}
                                    <td className="px-3 py-2 text-slate-200">
                                        {r.provider_id ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5 text-[11px] text-slate-300">
                          <MapPin className="h-3.5 w-3.5" />
                                                {r.provider_id}
                        </span>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Section>
        </div>
    );
}

/* ---------------- Account ---------------- */

interface SupaUser {
    id: UUID;
    email: string;
}

function AccountPanel() {
    const [user, setUser] = React.useState<SupaUser | null>(null);

    React.useEffect(() => {
        (async () => {
            const u = (await getUser().catch(() => null)) as
                | { id: UUID; email: string }
                | null;
            setUser(u ?? null);
        })();
    }, []);

    const signOut = () => {
        logout();
        window.location.href = "/login";
    };

    return (
        <Section
            title="Account"
            subtitle="Signed in as a MotorAmbos admin user."
            actions={
                <button
                    onClick={signOut}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-800 sm:text-sm"
                >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                </button>
            }
        >
            {user ? (
                <div className="space-y-2 text-xs text-slate-100 sm:text-sm">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-1.5 text-[11px] text-emerald-300 ring-1 ring-emerald-500/40">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Admin session active</span>
                    </div>
                    <p className="pt-1">
                        <span className="text-slate-400">User ID:</span> {user.id}
                    </p>
                    <p>
                        <span className="text-slate-400">Email:</span> {user.email}
                    </p>
                    <p className="mt-2 text-slate-400">
                        Ensure this dashboard is protected behind admin-only auth &amp; RLS.
                    </p>
                </div>
            ) : (
                <p className="text-sm text-slate-400">Loading user…</p>
            )}
        </Section>
    );
}

/* ---------------- Admin Dashboard ---------------- */

export default function AdminDashboard() {
    const [tab, setTab] = React.useState<"Providers" | "Requests" | "Account">(
        "Providers",
    );

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <div className="mx-auto max-w-6xl px-4 py-6 text-slate-50 sm:px-6 sm:py-8">
                <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-300 ring-1 ring-slate-700/80">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            MotorAmbos Admin Console
                        </div>
                        <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
                            Command centre for roadside assistance
                        </h1>
                        <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                            Manage providers, review incoming requests, and stay in control of
                            your MotorAmbos network.
                        </p>
                    </div>
                </header>

                <Tabs
                    tabs={["Providers", "Requests", "Account"]}
                    active={tab}
                    onChange={(t) => setTab(t as "Providers" | "Requests" | "Account")}
                />

                {tab === "Providers" && <ProvidersPanel />}
                {tab === "Requests" && <RequestsPanel />}
                {tab === "Account" && <AccountPanel />}
            </div>
        </div>
    );
}