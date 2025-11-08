"use client";
import React, {useEffect, useState} from "react";
import { supabaseBrowser as supabase } from "@/lib/supabaseBrowser"; // <- fix

const cls = (...arr: (string | false | null | undefined)[]) =>
    arr.filter(Boolean).join(" ");

/* --------------------------------
   Common UI helpers
--------------------------------- */
function TextField(props: {
    label: string;
    value: any;
    onChange: (v: any) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    autoComplete?: string;
}) {
    const {
        label,
        value,
        onChange,
        type = "text",
        placeholder,
        required,
        autoComplete,
    } = props;

    const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange((e.target as HTMLInputElement).value);

    return (
        <label className="block text-sm">
            <span className="text-gray-700">{label}</span>
            <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                value={value ?? ""}       // normalize undefined/null so input stays controlled
                onChange={handle}
                onInput={handle}          // capture autofill/IME so state updates and button enables
                type={type}
                placeholder={placeholder}
                required={required}
                autoComplete={autoComplete}
            />
        </label>
    );
}

const NumberField = (p: any) => <TextField {...p} type="number"/>;

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
            <div className="i-lucide-inbox h-6 w-6"/>
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

/* ===============================
   Providers Panel (CRUD + lat/lng)
   Uses your real columns (from earlier message):
   - id, display_name, about, phone_business, is_active, coverage_radius_km,
     callout_fee, rating, jobs_count, location (geography), address_line,
     created_at, updated_at
=============================== */
function ProvidersPanel() {
    const emptyForm = {
        id: null as string | null,
        display_name: "",
        phone_business: "",
        about: "",
        address_line: "",
        is_active: true,
        coverage_radius_km: 10,
        callout_fee: 0,
        lat: "" as any,
        lng: "" as any,
    };

    const [form, setForm] = useState({...emptyForm});
    const [list, setList] = useState<any[]>([]);
    const [loadingList, setLoadingList] = useState(false);
    const [saving, setSaving] = useState(false);
    const [q, setQ] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [okMsg, setOkMsg] = useState<string | null>(null);

    // IMPORTANT: don’t mix .schema("motorambos").from("providers") with from("motorambos.providers")
    // Pick one. We'll use the dot-notation consistently here:
    const load = React.useCallback(async () => {
        setLoadingList(true);
        setError(null);

        try {
            let query = supabase
                .schema('motorambos')
                .from("providers")
                .select("*")
                .order("created_at", {ascending: false});

            if (q) query = query.ilike("display_name", `%${q}%`);

            const {data, error} = await query;
            if (error) throw error;

            // setLoadingList(false);

            setList(data || []);
            // no console.error on success
        } catch (err: any) {
            console.error("[providers.load] error:", err);
            setError(err.message || String(err));
        } finally {
            setLoadingList(false);
        }
    }, [q]);

    // mounted guard to survive Strict Mode double-invoke
    const mounted = React.useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        // initial fetch
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // debounce on q change
        const t = setTimeout(() => {
            if (mounted.current) load();
        }, 300);
        return () => clearTimeout(t);
    }, [q, load]);

    const upsert = async () => {
        setSaving(true);
        setError(null);
        setOkMsg(null);
        try {
            const p = {...form} as any;
            if (!p.display_name?.trim()) throw new Error("Provider name is required");

            console.log("[providers.upsert] payload:", p);

            if (p.id) {
                const {error} = await supabase
                    .schema('motorambos')
                    .from("providers")
                    .update({
                        display_name: p.display_name,
                        phone_business: p.phone_business || null,
                        about: p.about || null,
                        address_line: p.address_line || null,
                        is_active: !!p.is_active,
                        coverage_radius_km: p.coverage_radius_km
                            ? Number(p.coverage_radius_km)
                            : null,
                        callout_fee: p.callout_fee ? Number(p.callout_fee) : 0,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", p.id);
                if (error) throw error;
                setOkMsg("Provider updated.");
            } else {
                const {error} = await supabase
                    .schema('motorambos')
                    .from("providers")
                    .insert([
                        {
                            display_name: p.display_name,
                            phone_business: p.phone_business || null,
                            about: p.about || null,
                            address_line: p.address_line || null,
                            is_active: !!p.is_active,
                            coverage_radius_km: p.coverage_radius_km
                                ? Number(p.coverage_radius_km)
                                : 10,
                            callout_fee: p.callout_fee ? Number(p.callout_fee) : 0,
                        },
                    ]);
                if (error) throw error;
                setOkMsg("Provider created.");
            }

            setForm({...emptyForm});
            // fire and forget refresh (don’t block UI)
            load();
        } catch (err: any) {
            console.error("[providers.upsert] error:", err);
            setError(err.message || String(err));
        } finally {
            if (mounted.current) setSaving(false);
        }
    };

    const edit = (row: any) =>
        setForm({
            id: row.id,
            display_name: row.display_name || "",
            phone_business: row.phone_business || "",
            about: row.about || "",
            address_line: row.address_line || "",
            is_active: !!row.is_active,
            coverage_radius_km: row.coverage_radius_km ?? 10,
            callout_fee: Number(row.callout_fee ?? 0),
            lat: "",
            lng: "",
        });

    const del = async (row: any) => {
        if (!confirm(`Delete provider “${row.display_name || row.id}”?`)) return;
        setSaving(true);
        setError(null);
        setOkMsg(null);
        try {
            const {error} = await supabase
                .schema('motorambos')
                .from("providers")
                .delete()
                .eq("id", row.id);
            if (error) throw error;
            setOkMsg("Provider deleted.");
            load();
        } catch (err: any) {
            console.error("[providers.delete] error:", err);
            setError(err.message || String(err));
        } finally {
            if (mounted.current) setSaving(false);
        }
    };

    const canSave =
        !saving &&
        typeof form.display_name === "string" &&
        form.display_name.trim().length > 0;

    return (
        <div className="space-y-4">
            <Section
                title={form.id ? "Edit provider" : "Add provider"}
                actions={
                    form.id && (
                        <button
                            onClick={() => setForm({...emptyForm})}
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
                        onChange={(v) => setForm((s) => ({...s, display_name: v}))}
                        required
                        autoComplete="organization"
                    />
                    <TextField
                        label="Business phone"
                        value={form.phone_business}
                        onChange={(v) => setForm((s) => ({...s, phone_business: v}))}
                        autoComplete="tel"
                    />
                    <TextField
                        label="Address line"
                        value={form.address_line}
                        onChange={(v) => setForm((s) => ({...s, address_line: v}))}
                        placeholder="Optional street address"
                        autoComplete="street-address"
                    />
                    <NumberField
                        label="Coverage radius (km)"
                        value={form.coverage_radius_km}
                        onChange={(v: any) =>
                            setForm((s) => ({...s, coverage_radius_km: v}))
                        }
                    />
                    <NumberField
                        label="Callout fee (min)"
                        value={form.callout_fee}
                        onChange={(v: any) => setForm((s) => ({...s, callout_fee: v}))}
                    />
                    <div className="md:col-span-2 flex items-center justify-between">
                        <Toggle
                            label="Active"
                            checked={form.is_active}
                            onChange={(v) => setForm((s) => ({...s, is_active: v}))}
                        />
                        <div className="text-xs text-gray-500">
                            {saving ? "saving…" : loadingList ? "loading…" : "idle"}
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

                    {/* Optional lat/lng capture for future geography RPC */}
                    <NumberField
                        label="Latitude"
                        value={form.lat}
                        onChange={(v: any) => setForm((s) => ({...s, lat: v}))}
                        placeholder="e.g. 5.6148"
                    />
                    <NumberField
                        label="Longitude"
                        value={form.lng}
                        onChange={(v: any) => setForm((s) => ({...s, lng: v}))}
                        placeholder="e.g. -0.2059"
                    />

                    <div className="md:col-span-2 flex items-center justify-end gap-3">
                        {!canSave && (
                            <span className="text-xs text-gray-500">
                {saving
                    ? "Saving…"
                    : !form.display_name?.trim()
                        ? "Enter a provider name to enable"
                        : "Ready"}
              </span>
                        )}
                        <button
                            type="button"
                            onClick={upsert}
                            disabled={!canSave}
                            className="rounded-xl bg-black px-4 py-2 text-white hover:bg-black/90 disabled:opacity-50"
                        >
                            {form.id ? "Save changes" : "Add provider"}
                        </button>
                    </div>
                </div>

                {okMsg && <p className="mt-2 text-sm text-emerald-600">{okMsg}</p>}
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
                {loadingList && (
                    <p className="py-8 text-center text-sm text-gray-500">Loading…</p>
                )}
                {!loadingList && list.length === 0 && (
                    <Empty title="No providers yet" subtitle="Add your first provider above."/>
                )}
                {!loadingList && list.length > 0 && (
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
                                    <td className="px-3 py-2 font-medium">
                                        {row.display_name}
                                    </td>
                                    <td className="px-3 py-2">{row.phone_business || "—"}</td>
                                    <td className="px-3 py-2">{row.is_active ? "Yes" : "No"}</td>
                                    <td className="px-3 py-2">{row.coverage_radius_km ?? "—"}</td>
                                    <td className="px-3 py-2">{row.callout_fee ?? "—"}</td>
                                    <td className="px-3 py-2">{row.address_line || "—"}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => edit(row)}
                                                className="rounded-xl border px-2 py-1 hover:bg-gray-50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => del(row)}
                                                disabled={saving}
                                                className="rounded-xl border px-2 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
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

/* ===============================
   Requests Panel (viewer)
=============================== */
function RequestsPanel() {
    const [list, setList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [q, setQ] = useState("");
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            let query = supabase
                .schema("motorambos")
                .from("requests")
                .select(
                    "id, created_at, service, status, driver_name, provider_id, location"
                )
                .order("created_at", {ascending: false})
                .limit(200);

            if (status) query = query.eq("status", status);

            const {data, error} = await query;
            if (error) throw error;

            let rows = data || [];
            if (q) {
                const qq = q.toLowerCase();
                rows = rows.filter((r: any) =>
                    [r.service, r.status, r.driver_name, r.id].some((v: any) =>
                        String(v || "").toLowerCase().includes(qq)
                    )
                );
            }
            setList(rows);
        } catch (err: any) {
            console.error("[requests.load] error:", err);
            setError(err.message || String(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        const t = setTimeout(load, 250);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    return (
        <div className="space-y-4">
            <Section
                title="Requests"
                actions={
                    <div className="flex items-center gap-2">
                        <select
                            className="rounded-xl border px-3 py-1.5 text-sm"
                            value={status}
                            onChange={(e) => setStatus((e.target as HTMLSelectElement).value)}
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
                                (e as React.KeyboardEvent<HTMLInputElement>).key === "Enter" &&
                                load()
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
                {!loading && list.length === 0 && <Empty title="No requests found"/>}
                {!loading && list.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                            <tr className="text-left text-gray-600">
                                <th className="px-3 py-2">When</th>
                                <th className="px-3 py-2">Service</th>
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
                                    <td className="px-3 py-2 font-medium">{r.service || "—"}</td>
                                    <td className="px-3 py-2">
                      <span
                          className={cls(
                              "rounded-full px-2 py-0.5 text-xs",
                              r.status === "open" && "bg-yellow-100 text-yellow-800",
                              r.status === "assigned" && "bg-blue-100 text-blue-800",
                              r.status === "completed" && "bg-green-100 text-green-800",
                              r.status === "cancelled" && "bg-red-100 text-red-800",
                              !["open", "assigned", "completed", "cancelled"].includes(
                                  r.status
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
                                                : JSON.stringify(r.location)
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

/* ===============================
   Account Panel
=============================== */
function AccountPanel() {
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        (async () => {
            const {data} = await supabase.auth.getUser();
            setUser(data.user);
        })();
    }, []);
    const signOut = async () => {
        await supabase.auth.signOut();
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

/* ===============================
   Admin Dashboard (tabs)
=============================== */
export default function AdminDashboard() {
    const [tab, setTab] = useState("Providers");

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
                <Tabs tabs={["Providers", "Requests", "Account"]} active={tab} onChange={setTab}/>
                {tab === "Providers" && <ProvidersPanel/>}
                {tab === "Requests" && <RequestsPanel/>}
                {tab === "Account" && <AccountPanel/>}
            </div>
        </div>
    );
}