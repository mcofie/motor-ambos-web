"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Car, ImagePlus, Images, Loader2, Search, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { StatCard, cls } from "../ui/AdminUI";
import { libraryColours } from "@/lib/carImageLibrary";

type LibraryImage = { id: string; make: string; model: string; colour: string; year_from: number | null; year_to: number | null; image_url: string; created_at: string };
type Missing = { make: string; model: string; colour: string; count: number; yearFrom: number | null; yearTo: number | null };

const field = "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
const nice = (value: string) => value === value.toUpperCase() ? value.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase()) : value;
const years = (from: number | null, to: number | null) => from && to ? (from === to ? String(from) : `${from}–${to}`) : from ? `${from} on` : to ? `Up to ${to}` : "All years";
const matchColour = (value: string) => libraryColours.find((colour) => value.toLowerCase().replace("gray", "grey").includes(colour.toLowerCase())) || "";

export function CarImagesView() {
    const [images, setImages] = useState<LibraryImage[]>([]);
    const [missing, setMissing] = useState<Missing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [colour, setColour] = useState("");
    const [yearFrom, setYearFrom] = useState("");
    const [yearTo, setYearTo] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/admin-car-images", { cache: "no-store" });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Could not load car images");
            setImages(result.images);
            setMissing(result.missing);
            setError(null);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not load car images");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void load(); }, [load]);
    useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

    function chooseFile(next: File | null) {
        setFile(next);
        setPreview(next ? URL.createObjectURL(next) : null);
    }

    function prefill(entry: Missing) {
        setMake(nice(entry.make));
        setModel(nice(entry.model));
        setColour(matchColour(entry.colour) || nice(entry.colour));
        setYearFrom(entry.yearFrom ? String(entry.yearFrom) : "");
        setYearTo(entry.yearTo ? String(entry.yearTo) : "");
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    async function upload(event: FormEvent) {
        event.preventDefault();
        if (!file) return toast.error("Choose an image first");
        setUploading(true);
        try {
            const form = new FormData();
            form.set("make", make);
            form.set("model", model);
            form.set("colour", colour);
            form.set("yearFrom", yearFrom);
            form.set("yearTo", yearTo);
            form.set("file", file);
            const response = await fetch("/api/admin-car-images", { method: "POST", body: form });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Could not upload");
            toast.success(`${make} ${model} in ${colour.toLowerCase()} added`);
            chooseFile(null);
            setYearFrom(""); setYearTo("");
            await load();
        } catch (reason) {
            toast.error(reason instanceof Error ? reason.message : "Could not upload");
        } finally {
            setUploading(false);
        }
    }

    async function remove(image: LibraryImage) {
        if (!window.confirm(`Delete the ${image.make} ${image.model} (${image.colour}) photo? Cars using it will show the drawing instead.`)) return;
        setDeletingId(image.id);
        const response = await fetch(`/api/admin-car-images?id=${image.id}`, { method: "DELETE" }).catch(() => null);
        setDeletingId(null);
        if (response?.ok) { toast.success("Photo deleted"); await load(); } else toast.error("Could not delete the photo");
    }

    const makes = useMemo(() => [...new Set([...images.map((image) => image.make), ...missing.map((entry) => nice(entry.make))])].sort(), [images, missing]);
    const filtered = images.filter((image) => `${image.make} ${image.model} ${image.colour}`.toLowerCase().includes(query.trim().toLowerCase()));
    const uncovered = missing.reduce((total, entry) => total + entry.count, 0);

    return <div className="flex flex-col gap-6 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard title="Photos in library" value={images.length} icon={Images} color="bg-indigo-500" />
            <StatCard title="Car types still needed" value={missing.length} icon={ImagePlus} color="bg-amber-500" />
            <StatCard title="Cars showing a drawing" value={uncovered} icon={Car} color="bg-rose-500" />
        </div>

        {error && <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-300">{error}</div>}

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <form ref={formRef} onSubmit={upload} className="scroll-mt-6 rounded-xl border border-border bg-card p-5 shadow-sm">
                <h2 className="text-base font-semibold text-foreground">Add a car photo</h2>
                <p className="mt-1 text-sm text-muted-foreground">Use a front three-quarter studio shot on a white or transparent background, at least 1200px wide. One photo per model and colour.</p>
                <div className="mt-5 grid gap-5 md:grid-cols-[1fr_1.1fr]">
                    <label className={cls("relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed text-center transition-colors", preview ? "border-transparent bg-white" : "border-border bg-muted/30 hover:border-primary")}
                        onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files?.[0] || null); }}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- local preview of the chosen file */}
                        {preview ? <img src={preview} alt="Preview" className="h-full w-full object-contain p-3" /> : <><Upload className="h-6 w-6 text-muted-foreground" /><span className="mt-2 text-sm text-foreground">Drop an image or click to choose</span><span className="mt-1 text-xs text-muted-foreground">PNG, WebP or JPEG, up to 5 MB</span></>}
                        <input type="file" accept="image/png,image/webp,image/jpeg" className="sr-only" onChange={(event) => chooseFile(event.target.files?.[0] || null)} />
                    </label>
                    <div className="grid content-start gap-3">
                        <label className="text-xs font-medium text-muted-foreground">Make<input className={cls(field, "mt-1")} list="car-image-makes" value={make} onChange={(event) => setMake(event.target.value)} placeholder="e.g. Toyota" required /></label>
                        <datalist id="car-image-makes">{makes.map((item) => <option key={item} value={item} />)}</datalist>
                        <label className="text-xs font-medium text-muted-foreground">Model<input className={cls(field, "mt-1")} value={model} onChange={(event) => setModel(event.target.value)} placeholder="e.g. Corolla" required /></label>
                        <label className="text-xs font-medium text-muted-foreground">Colour<select className={cls(field, "mt-1")} value={colour} onChange={(event) => setColour(event.target.value)} required><option value="">Choose colour</option>{libraryColours.map((item) => <option key={item} value={item}>{item}</option>)}{colour && !libraryColours.includes(colour as (typeof libraryColours)[number]) && <option value={colour}>{colour}</option>}</select></label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="text-xs font-medium text-muted-foreground">From year<input className={cls(field, "mt-1")} inputMode="numeric" value={yearFrom} onChange={(event) => setYearFrom(event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="Any" /></label>
                            <label className="text-xs font-medium text-muted-foreground">To year<input className={cls(field, "mt-1")} inputMode="numeric" value={yearTo} onChange={(event) => setYearTo(event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="Any" /></label>
                        </div>
                        <p className="text-xs text-muted-foreground">Years are for generations, e.g. a 2014–2019 Corolla looks different from a 2020 one. Leave blank to match every year.</p>
                        <button type="submit" disabled={uploading || !file} className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}Upload photo</button>
                    </div>
                </div>
            </form>

            <section className="rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border p-5"><h2 className="text-base font-semibold text-foreground">Still needed</h2><p className="mt-1 text-sm text-muted-foreground">Cars on Motor Ambos with no matching photo, most common first.</p></div>
                {loading ? <div className="flex items-center gap-2 p-5 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading…</div>
                    : missing.length ? <ul className="max-h-[420px] divide-y divide-border overflow-y-auto">{missing.map((entry) => <li key={`${entry.make}-${entry.model}-${entry.colour}`} className="flex items-center gap-3 px-5 py-3">
                        <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-foreground">{nice(entry.make)} {nice(entry.model)} <span className="font-normal text-muted-foreground">· {nice(entry.colour)}</span></p><p className="text-xs text-muted-foreground">{entry.count} {entry.count === 1 ? "car" : "cars"} · {years(entry.yearFrom, entry.yearTo)}</p></div>
                        <button type="button" onClick={() => prefill(entry)} className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:text-primary">Upload</button>
                    </li>)}</ul>
                    : <p className="p-5 text-sm text-muted-foreground">Every car on the platform has a photo.</p>}
            </section>
        </div>

        <section className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-5 md:flex-row md:items-center md:justify-between">
                <h2 className="text-base font-semibold text-foreground">Library <span className="font-normal text-muted-foreground">{images.length}</span></h2>
                <label className="relative w-full md:max-w-xs"><span className="sr-only">Search photos</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input className={cls(field, "pl-9")} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search make, model or colour" /></label>
            </div>
            {filtered.length ? <ul className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">{filtered.map((image) => <li key={image.id} className="overflow-hidden rounded-xl border border-border bg-background">
                {/* eslint-disable-next-line @next/next/no-img-element -- public library photo */}
                <div className="flex aspect-[4/3] items-center justify-center bg-white p-3"><img src={image.image_url} alt={`${image.make} ${image.model} in ${image.colour}`} className="h-full w-full object-contain" loading="lazy" /></div>
                <div className="flex items-start justify-between gap-2 p-3">
                    <div className="min-w-0"><p className="truncate text-sm font-medium text-foreground">{image.make} {image.model}</p><p className="text-xs text-muted-foreground">{image.colour} · {years(image.year_from, image.year_to)}</p></div>
                    <button type="button" onClick={() => void remove(image)} disabled={deletingId === image.id} aria-label={`Delete ${image.make} ${image.model} ${image.colour}`} className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 disabled:opacity-50">{deletingId === image.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</button>
                </div>
            </li>)}</ul> : <p className="p-5 text-sm text-muted-foreground">{loading ? "Loading…" : images.length ? "No photos match your search." : "No photos yet. Start with the cars in “Still needed”."}</p>}
        </section>
    </div>;
}
