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
    provider_id: UUID | null;
    // Could be string (WKT) or GeoJSON object depending on your SELECT
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
        <label className="block text-sm">
            <span className="text-gray-700">{label}</span>
            <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
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
    <label className="flex items-center gap-2 text-sm select-none">
        <input
            type="checkbox"
            checked={!!checked}
            onChange={(e) => onChange((e.target as HTMLInputElement).checked)}
        />
        <span>{label}</span>
    </label>
);

function Section({
                     title,
                     actions,
                     children,
                 }: React.PropsWithChildren<{ title: string; actions?: React.ReactNode }>) {
    return (
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{title}</h2>
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
        <div className="flex flex-col items-center justify-center gap-1 py-10 text-center text-gray-500">
            <div className="i-lucide-inbox h-6 w-6" />
            <p className="font-medium">{title}</p>
            {subtitle && <p className="text-sm">{subtitle}</p>}
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
        <div className="mb-4 flex w-full items-center gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-black/5">
            {tabs.map((t) => (
                <button
                    key={t}
                    onClick={() => onChange(t)}
                    className={cls(
                        "flex-1 rounded-xl px-4 py-2 text-sm",
                        active === t ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"
                    )}
                >
                    {t}
                </button>
            ))}
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

    const [form, setForm] = React.useState<ProviderFormState>({ ...empty });
    const [list, setList] = React.useState<ProviderRow[]>([]);
    const [q, setQ] = React.useState<string>("");
    const [saving, setSaving] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);
    const [ok, setOk] = React.useState<string | null>(null);

    const [services, setServices] = React.useState<ServiceRow[]>([]);
    const [selectedServiceIds, setSelectedServiceIds] = React.useState<UUID[]>(
        []
    );
    const toggleService = (id: UUID) =>
        setSelectedServiceIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

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
                // non-fatal
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

            setForm({ ...empty });
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
        <div className="space-y-4">
            <Section
                title={form.id ? "Edit provider" : "Add provider"}
                actions={
                    form.id && (
                        <button
                            onClick={() => {
                                setForm({ ...empty });
                                setSelectedServiceIds([]);
                            }}
                            className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    )
                }
            >
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <TextField
                        label="Provider name"
                        value={form.display_name}
                        onChange={(v) => setForm((s) => ({ ...s, display_name: v }))}
                        required
                    />
                    <TextField
                        label="Business phone"
                        value={form.phone_business}
                        onChange={(v) => setForm((s) => ({ ...s, phone_business: v }))}
                    />
                    <TextField
                        label="Address line"
                        value={form.address_line}
                        onChange={(v) => setForm((s) => ({ ...s, address_line: v }))}
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

                    {/* Optional coordinates to set geography */}
                    <NumberField
                        label="Longitude"
                        value={form.lng}
                        onChange={(v) => setForm((s) => ({ ...s, lng: v }))}
                    />
                    <NumberField
                        label="Latitude"
                        value={form.lat}
                        onChange={(v) => setForm((s) => ({ ...s, lat: v }))}
                    />

                    <div className="md:col-span-2 flex items-center justify-between">
                        <Toggle
                            label="Active"
                            checked={form.is_active}
                            onChange={(v) => setForm((s) => ({ ...s, is_active: v }))}
                        />
                        <div className="text-xs text-gray-500">
                            {saving ? "saving…" : loading ? "loading…" : "idle"}
                        </div>
                    </div>

                    <label className="md:col-span-2 text-sm">
                        <span className="text-gray-700">About</span>
                        <textarea
                            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                            rows={3}
                            value={form.about ?? ""}
                            onChange={(e) =>
                                setForm((s) => ({
                                    ...s,
                                    about: (e.target as HTMLTextAreaElement).value,
                                }))
                            }
                        />
                    </label>

                    {/* Services multi-select */}
                    <div className="md:col-span-2">
                        <p className="mb-2 text-sm font-medium text-gray-700">
                            Services offered
                        </p>
                        {services.length === 0 ? (
                            <p className="text-xs text-gray-500">No services defined.</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                                {services.map((svc) => (
                                    <label
                                        key={svc.id}
                                        className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedServiceIds.includes(svc.id)}
                                            onChange={() => toggleService(svc.id)}
                                        />
                                        <span className="truncate">{svc.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2 flex items-center justify-end gap-3">
                        <button
                            onClick={save}
                            disabled={saving || !form.display_name.trim()}
                            className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
                        >
                            {form.id ? "Save changes" : "Add provider"}
                        </button>
                    </div>
                </div>

                {ok && <p className="mt-2 text-sm text-emerald-600">{ok}</p>}
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </Section>

            <Section
                title="Providers"
                actions={
                    <input
                        placeholder="Search by name…"
                        className="rounded-xl border px-3 py-1.5 text-sm"
                        value={q}
                        onChange={(e) => setQ((e.target as HTMLInputElement).value)}
                    />
                }
            >
                {loading && (
                    <p className="py-8 text-center text-sm text-gray-500">Loading…</p>
                )}
                {!loading && list.length === 0 && (
                    <Empty title="No providers yet" subtitle="Add your first provider above." />
                )}
                {!loading && list.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                            <tr className="text-left text-gray-600">
                                <th className="px-3 py-2">Name</th>
                                <th className="px-3 py-2">Phone</th>
                                <th className="px-3 py-2">Active</th>
                                <th className="px-3 py-2">Radius (km)</th>
                                <th className="px-3 py-2">Callout fee</th>
                                <th className="px-3 py-2">Address</th>
                                <th className="px-3 py-2 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {list.map((row) => (
                                <tr key={row.id} className="border-t">
                                    <td className="px-3 py-2 font-medium">{row.display_name}</td>
                                    <td className="px-3 py-2">{row.phone_business || "—"}</td>
                                    <td className="px-3 py-2">{row.is_active ? "Yes" : "No"}</td>
                                    <td className="px-3 py-2">{row.coverage_radius_km ?? "—"}</td>
                                    <td className="px-3 py-2">{row.callout_fee ?? "—"}</td>
                                    <td className="px-3 py-2">{row.address_line || "—"}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => startEdit(row)}
                                                className="rounded-xl border px-2 py-1 hover:bg-gray-50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => remove(row)}
                                                className="rounded-xl border px-2 py-1 text-red-600 hover:bg-red-50"
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
    const [status, setStatus] = React.useState<string>("");
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
        <div className="space-y-4">
            <Section
                title="Requests"
                actions={
                    <div className="flex items-center gap-2">
                        <select
                            className="rounded-xl border px-3 py-1.5 text-sm"
                            value={status}
                            onChange={(e) =>
                                setStatus((e.target as HTMLSelectElement).value)
                            }
                        >
                            <option value="">All statuses</option>
                            <option value="open">Open</option>
                            <option value="assigned">Assigned</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <input
                            placeholder="Search…"
                            className="rounded-xl border px-3 py-1.5 text-sm"
                            value={q}
                            onChange={(e) => setQ((e.target as HTMLInputElement).value)}
                            onKeyDown={(e) =>
                                (e as React.KeyboardEvent<HTMLInputElement>).key ===
                                "Enter" && load()
                            }
                        />
                        <button
                            onClick={load}
                            className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
                        >
                            Refresh
                        </button>
                    </div>
                }
            >
                {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
                {loading && (
                    <p className="py-8 text-center text-sm text-gray-500">Loading…</p>
                )}
                {!loading && list.length === 0 && <Empty title="No requests found" />}
                {!loading && list.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                            <tr className="text-left text-gray-600">
                                <th className="px-3 py-2">When</th>
                                <th className="px-3 py-2">Service ID</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Driver</th>
                                <th className="px-3 py-2">Provider</th>
                                <th className="px-3 py-2">Location</th>
                            </tr>
                            </thead>
                            <tbody>
                            {list.map((r) => (
                                <tr key={r.id} className="border-t">
                                    <td className="px-3 py-2 text-gray-600">
                                        {new Date(r.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-3 py-2 font-medium">
                                        {r.service_id || "—"}
                                    </td>
                                    <td className="px-3 py-2">
                      <span
                          className={cls(
                              "rounded-full px-2 py-0.5 text-xs",
                              r.status === "open" && "bg-yellow-100 text-yellow-800",
                              r.status === "assigned" &&
                              "bg-blue-100 text-blue-800",
                              r.status === "completed" &&
                              "bg-green-100 text-green-800",
                              r.status === "cancelled" &&
                              "bg-red-100 text-red-800",
                              !["open", "assigned", "completed", "cancelled"].includes(
                                  r.status ?? ""
                              ) && "bg-gray-100 text-gray-700"
                          )}
                      >
                        {r.status || "—"}
                      </span>
                                    </td>
                                    <td className="px-3 py-2">{r.driver_name || "—"}</td>
                                    <td className="px-3 py-2">{r.provider_id || "—"}</td>
                                    <td
                                        className="px-3 py-2 max-w-[30ch] truncate"
                                        title={
                                            typeof r.location === "string"
                                                ? r.location
                                                : r.location
                                                    ? JSON.stringify(r.location)
                                                    : "—"
                                        }
                                    >
                                        {typeof r.location === "string"
                                            ? r.location
                                            : r.location
                                                ? JSON.stringify(r.location)
                                                : "—"}
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

    const signOut = async () => {
        await logout().catch(() => {});
        window.location.href = "/login";
    };

    return (
        <Section
            title="Account"
            actions={
                <button
                    onClick={signOut}
                    className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                    Sign out
                </button>
            }
        >
            {user ? (
                <div className="text-sm">
                    <p>
                        <span className="text-gray-500">User ID:</span> {user.id}
                    </p>
                    <p>
                        <span className="text-gray-500">Email:</span> {user.email}
                    </p>
                    <p className="mt-2 text-gray-500">
                        Tip: protect this route with admin-only RLS.
                    </p>
                </div>
            ) : (
                <p className="text-sm text-gray-500">Loading user…</p>
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
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl p-4 md:p-6">
                <header className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">MotorAmbos Admin</h1>
                        <p className="text-sm text-gray-600">
                            Manage providers and view requests
                        </p>
                    </div>
                </header>
                <Tabs
                    tabs={["Providers", "Requests", "Account"]}
                    active={tab}
                    onChange={(t) =>
                        setTab(t as "Providers" | "Requests" | "Account")
                    }
                />
                {tab === "Providers" && <ProvidersPanel />}
                {tab === "Requests" && <RequestsPanel />}
                {tab === "Account" && <AccountPanel />}
            </div>
        </div>
    );
}