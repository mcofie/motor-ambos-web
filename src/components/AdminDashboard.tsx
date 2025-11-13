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
} from "@/lib/supaFetch";

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
    // Optional coordinates (either real columns or derived from GeoJSON)
    lng?: number | null;
    lat?: number | null;
    created_at?: string;
    updated_at?: string;
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
};

export interface ServiceRow {
    id: UUID;
    name: string;
    code?: string | null;
}

export interface RequestRow {
    id: UUID;
    created_at: string;
    service_id: UUID | null; // (note: listRequests doesn't actually select this; optional)
    status: string | null;
    driver_name: string | null;
    driver_phone?: string | null; // 👈 add
    provider_id: UUID | null;
    details?: string | null;      // 👈 add
    address_line?: string | null; // 👈 add
    location?: unknown;
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
            <span className="font-medium text-slate-700">{label}</span>
            <input
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
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
> = (p) => <TextField {...p} type="number"/>;

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
        className="inline-flex items-center gap-2 text-xs sm:text-sm select-none"
    >
    <span
        className={cls(
            "relative inline-flex h-5 w-9 items-center rounded-full border transition",
            checked
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-slate-300 bg-slate-100"
        )}
    >
      <span
          className={cls(
              "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition",
              checked ? "translate-x-4" : "translate-x-1"
          )}
      />
    </span>
        <span className="text-slate-700">{label}</span>
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
        <section className="rounded-2xl bg-white/90 p-4 sm:p-5 shadow-sm ring-1 ring-slate-200/80">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
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
        <div className="flex flex-col items-center justify-center gap-1 py-10 text-center text-slate-500">
            <div className="i-lucide-inbox h-7 w-7 opacity-70"/>
            <p className="mt-1 text-sm font-medium">{title}</p>
            {subtitle && <p className="text-xs sm:text-sm">{subtitle}</p>}
        </div>
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
        <div
            className="mb-5 inline-flex w-full items-center justify-start rounded-2xl bg-white/80 p-1 shadow-sm ring-1 ring-slate-200/80">
            {tabs.map((t) => {
                const isActive = active === t;
                return (
                    <button
                        key={t}
                        onClick={() => onChange(t)}
                        className={cls(
                            "flex-1 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition",
                            isActive
                                ? "bg-slate-900 text-white shadow-sm"
                                : "text-slate-700 hover:bg-slate-50"
                        )}
                    >
                        {t}
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
    };

    const [form, setForm] = React.useState<ProviderFormState>({...empty});
    const [list, setList] = React.useState<ProviderRow[]>([]);
    const [q, setQ] = React.useState<string>("");
    const [saving, setSaving] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);
    const [ok, setOk] = React.useState<string | null>(null);

    const [services, setServices] = React.useState<ServiceRow[]>([]);
    const [selectedServiceIds, setSelectedServiceIds] = React.useState<UUID[]>([]);
    const toggleService = (id: UUID) =>
        setSelectedServiceIds((s) =>
            s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
        );

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
                // eslint-disable-next-line no-console
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

            setForm({...empty});
            setSelectedServiceIds([]);
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
        });

        try {
            const ids = await getProviderServiceIds(row.id);
            setSelectedServiceIds(ids as UUID[]);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn("[ProvidersPanel] failed to load provider services:", e);
            setSelectedServiceIds([]);
        }
    }

    return (
        <div className="space-y-5">
            {/* Form + Services */}
            <Section
                title={form.id ? "Edit provider" : "Add provider"}
                subtitle="Set up details, coverage and services for a roadside provider."
                actions={
                    form.id && (
                        <button
                            onClick={() => {
                                setForm({...empty});
                                setSelectedServiceIds([]);
                            }}
                            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs sm:text-sm text-slate-700 hover:bg-slate-50"
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
                                onChange={(v) => setForm((s) => ({...s, display_name: v}))}
                                required
                                placeholder="e.g. Kofi Mobile Auto"
                            />
                            <TextField
                                label="Business phone"
                                value={form.phone_business}
                                onChange={(v) => setForm((s) => ({...s, phone_business: v}))}
                                placeholder="+233…"
                            />
                            <TextField
                                label="Address line"
                                value={form.address_line}
                                onChange={(v) => setForm((s) => ({...s, address_line: v}))}
                                placeholder="e.g. Spintex Road, Accra"
                            />
                            <NumberField
                                label="Coverage radius (km)"
                                value={form.coverage_radius_km}
                                onChange={(v) =>
                                    setForm((s) => ({...s, coverage_radius_km: v}))
                                }
                            />
                            <NumberField
                                label="Callout fee (min)"
                                value={form.callout_fee}
                                onChange={(v) => setForm((s) => ({...s, callout_fee: v}))}
                            />

                            {/* Coordinates */}
                            <NumberField
                                label="Longitude (optional)"
                                value={form.lng}
                                onChange={(v) => setForm((s) => ({...s, lng: v}))}
                            />
                            <NumberField
                                label="Latitude (optional)"
                                value={form.lat}
                                onChange={(v) => setForm((s) => ({...s, lat: v}))}
                            />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <Toggle
                                label="Provider is active"
                                checked={form.is_active}
                                onChange={(v) => setForm((s) => ({...s, is_active: v}))}
                            />
                            <div className="text-[11px] text-slate-500">
                                {saving ? "Saving…" : loading ? "Loading…" : "Idle"}
                            </div>
                        </div>

                        <label className="block text-xs sm:text-sm">
                            <span className="font-medium text-slate-700">About</span>
                            <textarea
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
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

                    {/* Right: services checklist */}
                    <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-xs sm:text-sm font-medium text-slate-800">
                                Services offered
                            </p>
                            <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-[10px] text-slate-500">
                {selectedServiceIds.length} selected
              </span>
                        </div>
                        {services.length === 0 ? (
                            <p className="text-xs text-slate-500">
                                No services defined yet. Add services in the database first.
                            </p>
                        ) : (
                            <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
                                {services.map((svc) => (
                                    <label
                                        key={svc.id}
                                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm hover:border-slate-300"
                                    >
                                        <input
                                            type="checkbox"
                                            className="h-3.5 w-3.5 rounded border-slate-300 text-slate-900"
                                            checked={selectedServiceIds.includes(svc.id)}
                                            onChange={() => toggleService(svc.id)}
                                        />
                                        <span className="truncate">{svc.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-3">
                    {ok && <p className="text-xs text-emerald-600">{ok}</p>}
                    {error && <p className="text-xs text-red-600">{error}</p>}
                    <button
                        onClick={save}
                        disabled={saving || !form.display_name.trim()}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
                    >
                        {form.id ? "Save changes" : "Add provider"}
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
                        className="w-40 sm:w-60 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        value={q}
                        onChange={(e) => setQ((e.target as HTMLInputElement).value)}
                    />
                }
            >
                {loading && (
                    <p className="py-8 text-center text-sm text-slate-500">Loading…</p>
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
                            <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-[11px] font-medium uppercase tracking-wide text-slate-500">
                                <th className="px-3 py-2">Name</th>
                                <th className="px-3 py-2">Phone</th>
                                <th className="px-3 py-2">Active</th>
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
                                        "border-b border-slate-100",
                                        idx % 2 === 1 && "bg-slate-50/40"
                                    )}
                                >
                                    <td className="px-3 py-2 text-slate-900">
                                        <div className="font-medium">{row.display_name}</div>
                                        {row.about && (
                                            <div className="mt-0.5 line-clamp-1 text-[11px] text-slate-500">
                                                {row.about}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 text-slate-700">
                                        {row.phone_business || "—"}
                                    </td>
                                    <td className="px-3 py-2">
                      <span
                          className={cls(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-[11px]",
                              row.is_active
                                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                                  : "bg-slate-50 text-slate-500 ring-1 ring-slate-200"
                          )}
                      >
                        {row.is_active ? "Active" : "Inactive"}
                      </span>
                                    </td>
                                    <td className="px-3 py-2 text-slate-700">
                                        {row.coverage_radius_km ?? "—"}{" "}
                                        {row.coverage_radius_km != null && "km"}
                                    </td>
                                    <td className="px-3 py-2 text-slate-700">
                                        {row.callout_fee != null ? `GH₵${row.callout_fee}` : "—"}
                                    </td>
                                    <td className="px-3 py-2 text-slate-700">
                                        {row.address_line || "—"}
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => startEdit(row)}
                                                className="rounded-xl border border-slate-200 px-2.5 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => remove(row)}
                                                className="rounded-xl border border-red-200 px-2.5 py-1 text-[11px] text-red-600 hover:bg-red-50"
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

/* ---------------- Requests (read-only) ---------------- */

function RequestsPanel() {
    const [list, setList] = React.useState<RequestRow[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [status, setStatus] = React.useState<string>("pending");
    const [q, setQ] = React.useState<string>("");
    const [error, setError] = React.useState<string | null>(null);

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
                            String(v || "").toLowerCase().includes(qq)
                        )
                    )
                    : rows
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

    return (
        <div className="space-y-5">
            <Section
                title="Requests"
                subtitle="View incoming roadside requests and their current status."
                actions={
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
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
                            className="w-32 sm:w-48 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                            value={q}
                            onChange={(e) => setQ((e.target as HTMLInputElement).value)}
                            onKeyDown={(e) =>
                                (e as React.KeyboardEvent<HTMLInputElement>).key === "Enter" &&
                                load()
                            }
                        />
                        <button
                            onClick={load}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm text-slate-700 hover:bg-slate-50"
                        >
                            Refresh
                        </button>
                    </div>
                }
            >
                {error && (
                    <p className="mb-2 text-xs sm:text-sm text-red-600">{error}</p>
                )}
                {loading && (
                    <p className="py-8 text-center text-sm text-slate-500">Loading…</p>
                )}
                {!loading && list.length === 0 && <Empty title="No requests found"/>}
                {!loading && list.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-xs sm:text-sm">
                            <thead>
                            <tr className="text-left text-gray-600">
                                <th className="px-3 py-2">When</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Driver</th>
                                <th className="px-3 py-2">Phone</th>
                                {/*<th className="px-3 py-2">Details</th>*/}
                                <th className="px-3 py-2">Provider</th>
                                {/*<th className="px-3 py-2">Location</th>*/}
                            </tr>
                            </thead>
                            <tbody>
                            {list.map((r) => (
                                <tr key={r.id} className="border-t">
                                    <td className="px-3 py-2 text-gray-600">
                                        {new Date(r.created_at).toLocaleString()}
                                    </td>

                                    {/* Status badge */}
                                    <td className="px-3 py-2">
        <span
            className={cls(
                "rounded-full px-2 py-0.5 text-xs",
                r.status === "pending" && "bg-yellow-100 text-yellow-800",
                r.status === "assigned" && "bg-blue-100 text-blue-800",
                r.status === "completed" && "bg-green-100 text-green-800",
                r.status === "cancelled" && "bg-red-100 text-red-800",
                !["pending", "assigned", "completed", "cancelled"].includes(
                    r.status ?? ""
                ) && "bg-gray-100 text-gray-700"
            )}
        >
          {r.status || "—"}
        </span>
                                    </td>

                                    {/* Driver */}
                                    <td className="px-3 py-2">{r.driver_name || "—"}</td>

                                    {/* Phone */}
                                    <td className="px-3 py-2">
                                        {r.driver_phone ? (
                                            <a
                                                href={`tel:${r.driver_phone}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {r.driver_phone}
                                            </a>
                                        ) : (
                                            "—"
                                        )}
                                    </td>

                                    {/*/!* Details *!/*/}
                                    {/*<td*/}
                                    {/*    className="px-3 py-2 max-w-[28ch] truncate text-gray-700"*/}
                                    {/*    title={r.details || ""}*/}
                                    {/*>*/}
                                    {/*    {r.details || "—"}*/}
                                    {/*</td>*/}

                                    {/* Provider */}
                                    <td className="px-3 py-2">{r.provider_id || "—"}</td>

                                    {/*/!* Location (unchanged) *!/*/}
                                    {/*<td*/}
                                    {/*    className="px-3 py-2 max-w-[30ch] truncate"*/}
                                    {/*    title={*/}
                                    {/*        typeof r.location === "string"*/}
                                    {/*            ? r.location*/}
                                    {/*            : r.location*/}
                                    {/*                ? JSON.stringify(r.location)*/}
                                    {/*                : "—"*/}
                                    {/*    }*/}
                                    {/*>*/}
                                    {/*    {typeof r.location === "string"*/}
                                    {/*        ? r.location*/}
                                    {/*        : r.location*/}
                                    {/*            ? JSON.stringify(r.location)*/}
                                    {/*            : "—"}*/}
                                    {/*</td>*/}
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
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm text-slate-700 hover:bg-slate-50"
                >
                    Sign out
                </button>
            }
        >
            {user ? (
                <div className="space-y-1 text-xs sm:text-sm text-slate-800">
                    <p>
                        <span className="text-slate-500">User ID:</span> {user.id}
                    </p>
                    <p>
                        <span className="text-slate-500">Email:</span> {user.email}
                    </p>
                    <p className="mt-2 text-slate-500">
                        Ensure this dashboard is protected behind admin-only auth &amp; RLS.
                    </p>
                </div>
            ) : (
                <p className="text-sm text-slate-500">Loading user…</p>
            )}
        </Section>
    );
}

/* ---------------- Admin Dashboard ---------------- */

export default function AdminDashboard() {
    const [tab, setTab] = React.useState<"Providers" | "Requests" | "Account">(
        "Providers"
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200/70">
            <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
                <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                            MotorAmbos Admin
                        </h1>
                        <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
                            Manage providers, review roadside requests and your admin account.
                        </p>
                    </div>
                </header>

                <Tabs
                    tabs={["Providers", "Requests", "Account"]}
                    active={tab}
                    onChange={(t) => setTab(t as "Providers" | "Requests" | "Account")}
                />

                {tab === "Providers" && <ProvidersPanel/>}
                {tab === "Requests" && <RequestsPanel/>}
                {tab === "Account" && <AccountPanel/>}
            </div>
        </div>
    );
}