"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Check, Loader2, Search, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { cls } from "../ui/AdminUI";
import { useConfirm } from "../ui/useConfirm";
import { libraryColours } from "@/lib/carImageLibrary";

type LibraryImage = { id: string; make: string; model: string; colour: string; year_from: number | null; year_to: number | null; image_url: string; created_at: string };
type Missing = { make: string; model: string; colour: string; count: number; yearFrom: number | null; yearTo: number | null };

const field = "h-11 w-full rounded-[12px] border border-[#E3E3E3] bg-white px-3.5 text-[14px] text-[#171717] outline-none placeholder:text-[#AAA] focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/15";
const nice = (value: string) => value === value.toUpperCase() || value === value.toLowerCase() ? value.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase()) : value;
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
    const [target, setTarget] = useState<Missing | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const { ask, dialog } = useConfirm();

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

    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads server data once the page mounts
    useEffect(() => { void load(); }, [load]);
    useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

    function chooseFile(next: File | null) {
        setFile(next);
        setPreview(next ? URL.createObjectURL(next) : null);
    }

    function clearForm() {
        setTarget(null);
        setMake(""); setModel(""); setColour(""); setYearFrom(""); setYearTo("");
        chooseFile(null);
    }

    function prefill(entry: Missing) {
        setTarget(entry);
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
        if (yearFrom && yearTo && Number(yearFrom) > Number(yearTo)) return toast.error("The first year must come before the last year");
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
            clearForm();
            await load();
        } catch (reason) {
            toast.error(reason instanceof Error ? reason.message : "Could not upload");
        } finally {
            setUploading(false);
        }
    }

    async function remove(image: LibraryImage) {
        if (!await ask({ title: `Delete the ${image.make} ${image.model} photo?`, body: `Cars in ${image.colour.toLowerCase()} will show the drawing instead.`, confirm: "Delete", danger: true })) return;
        setDeletingId(image.id);
        const response = await fetch(`/api/admin-car-images?id=${image.id}`, { method: "DELETE" }).catch(() => null);
        setDeletingId(null);
        if (response?.ok) { toast.success("Photo deleted"); await load(); } else toast.error("Could not delete the photo");
    }

    const makes = useMemo(() => [...new Set([...images.map((image) => image.make), ...missing.map((entry) => nice(entry.make))])].sort(), [images, missing]);
    const filtered = images.filter((image) => `${image.make} ${image.model} ${image.colour}`.toLowerCase().includes(query.trim().toLowerCase()));
    const uncovered = missing.reduce((total, entry) => total + entry.count, 0);

    return <div className="flex flex-col gap-5 pb-8">
        <p className="max-w-3xl text-[14px] leading-relaxed text-[#666]">Smart Card pages show a studio photo of the driver’s car when one here matches its make, model and colour. Otherwise they show a drawing. Work through <strong className="font-medium text-[#171717]">Still needed</strong>, most common cars first.</p>

        {error && <div role="alert" className="rounded-[16px] bg-[#FFF0EF] px-5 py-4 text-[14px] text-[#AA3333]">{error}</div>}

        <div className="grid items-start gap-5 xl:grid-cols-[1fr_440px]">
            <section className="overflow-hidden rounded-[20px] border border-[#EAEAEA] bg-white">
                <div className="flex items-end justify-between gap-3 border-b border-[#F0F0F0] px-5 py-4">
                    <div><h2 className="text-[18px] tracking-[-0.02em]">Still needed <span className="text-[14px] text-[#888]">{missing.length}</span></h2><p className="text-[13px] text-[#777]">{uncovered ? `${uncovered} ${uncovered === 1 ? "car shows" : "cars show"} a drawing right now.` : "Cars on Motor Ambos with no matching photo."}</p></div>
                </div>
                {loading ? <div className="flex items-center gap-2 px-5 py-6 text-[14px] text-[#888]"><Loader2 className="h-4 w-4 animate-spin" />Loading…</div>
                    : missing.length ? <ul className="max-h-[520px] divide-y divide-[#F0F0F0] overflow-y-auto">{missing.map((entry) => {
                        const active = target === entry;
                        return <li key={`${entry.make}-${entry.model}-${entry.colour}`}>
                            <button type="button" onClick={() => prefill(entry)} className={cls("flex w-full items-center gap-3 px-5 py-3 text-left transition-colors", active ? "bg-[#F3F3FF]" : "hover:bg-[#FAFAFA]")}>
                                <span className="flex h-9 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#F2F2F2] text-[13px] text-[#555]">{entry.count}</span>
                                <span className="min-w-0 flex-1"><span className="block truncate text-[14px]">{nice(entry.make)} {nice(entry.model)}</span><span className="block truncate text-[13px] text-[#888]">{nice(entry.colour)} · {years(entry.yearFrom, entry.yearTo)}</span></span>
                                <span className={cls("shrink-0 text-[13px]", active ? "text-[#1111F6]" : "text-[#888]")}>{active ? "Adding" : "Add photo"}</span>
                            </button>
                        </li>;
                    })}</ul>
                    : <p className="flex items-center gap-2 px-5 py-6 text-[14px] text-[#197252]"><Check className="h-4 w-4" />Every car on Motor Ambos has a photo.</p>}
            </section>

            <form ref={formRef} onSubmit={upload} className="scroll-mt-6 rounded-[20px] border border-[#EAEAEA] bg-white p-5 xl:sticky xl:top-0">
                <div className="flex items-start justify-between gap-3">
                    <div><h2 className="text-[18px] tracking-[-0.02em]">Add a photo</h2><p className="mt-0.5 text-[13px] text-[#777]">{target ? `For ${target.count} ${target.count === 1 ? "car" : "cars"} that need it.` : "Pick a car from Still needed, or fill in the details."}</p></div>
                    {(target || make || file) && <button type="button" onClick={clearForm} className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-2.5 text-[13px] text-[#777] hover:bg-[#F2F2F2]"><X className="h-3.5 w-3.5" />Clear</button>}
                </div>
                <label className={cls("relative mt-4 flex aspect-[16/10] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[16px] border-2 border-dashed text-center transition-colors", preview ? "border-transparent bg-[#F7F7F7]" : "border-[#E3E3E3] bg-[#FAFAFA] hover:border-[#B8B8FF]")}
                    onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files?.[0] || null); }}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- local preview of the chosen file */}
                    {preview ? <img src={preview} alt="Preview" className="h-full w-full object-contain p-3" /> : <><Upload className="h-6 w-6 text-[#888]" /><span className="mt-2 text-[14px]">Drop a photo or click to choose</span><span className="mt-1 px-6 text-[12px] text-[#888]">Front three-quarter studio shot, white or transparent background, 1200px wide or more. PNG, WebP or JPEG up to 5 MB.</span></>}
                    <input type="file" accept="image/png,image/webp,image/jpeg" className="sr-only" onChange={(event) => chooseFile(event.target.files?.[0] || null)} />
                </label>
                <div className="mt-4 grid grid-cols-2 gap-3">
                    <label className="text-[13px] text-[#555]">Make<input className={cls(field, "mt-1.5")} list="car-image-makes" value={make} onChange={(event) => setMake(event.target.value)} placeholder="Toyota" required /></label>
                    <datalist id="car-image-makes">{makes.map((item) => <option key={item} value={item} />)}</datalist>
                    <label className="text-[13px] text-[#555]">Model<input className={cls(field, "mt-1.5")} value={model} onChange={(event) => setModel(event.target.value)} placeholder="Corolla" required /></label>
                    <label className="col-span-2 text-[13px] text-[#555]">Colour<select className={cls(field, "mt-1.5")} value={colour} onChange={(event) => setColour(event.target.value)} required><option value="">Choose a colour</option>{libraryColours.map((item) => <option key={item} value={item}>{item}</option>)}{colour && !libraryColours.includes(colour as (typeof libraryColours)[number]) && <option value={colour}>{colour}</option>}</select></label>
                    <label className="text-[13px] text-[#555]">From year<input className={cls(field, "mt-1.5")} inputMode="numeric" value={yearFrom} onChange={(event) => setYearFrom(event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="Any" /></label>
                    <label className="text-[13px] text-[#555]">To year<input className={cls(field, "mt-1.5")} inputMode="numeric" value={yearTo} onChange={(event) => setYearTo(event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="Any" /></label>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-[#888]">Set years only when the model’s shape changed, such as a 2014–2019 Corolla. Leave them blank to match every year.</p>
                <button type="submit" disabled={uploading || !file} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#1111F6] text-[14px] text-white transition-colors hover:bg-[#0606D8] disabled:opacity-50">{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}{file ? "Add to library" : "Choose a photo first"}</button>
            </form>
        </div>

        <section className="overflow-hidden rounded-[20px] border border-[#EAEAEA] bg-white">
            <div className="flex flex-col gap-3 border-b border-[#F0F0F0] px-5 py-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-[18px] tracking-[-0.02em]">Library <span className="text-[14px] text-[#888]">{images.length}</span></h2>
                <label className="relative w-full md:max-w-xs"><span className="sr-only">Search photos</span><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" /><input className={cls(field, "pl-10")} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search make, model or colour" /></label>
            </div>
            {filtered.length ? <ul className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-5 lg:grid-cols-3 2xl:grid-cols-4">{filtered.map((image) => <li key={image.id} className="overflow-hidden rounded-[16px] border border-[#EAEAEA]">
                {/* eslint-disable-next-line @next/next/no-img-element -- public library photo */}
                <div className="flex aspect-[4/3] items-center justify-center bg-[#F7F7F7] p-3"><img src={image.image_url} alt={`${image.make} ${image.model} in ${image.colour}`} className="h-full w-full object-contain" loading="lazy" /></div>
                <div className="flex items-start justify-between gap-2 p-3">
                    <div className="min-w-0"><p className="truncate text-[14px]">{image.make} {image.model}</p><p className="truncate text-[12px] text-[#888]">{image.colour} · {years(image.year_from, image.year_to)}</p></div>
                    <button type="button" onClick={() => void remove(image)} disabled={deletingId === image.id} aria-label={`Delete ${image.make} ${image.model} ${image.colour}`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#888] hover:bg-[#FFF0EF] hover:text-[#AA3333] disabled:opacity-50">{deletingId === image.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</button>
                </div>
            </li>)}</ul> : <p className="px-5 py-10 text-center text-[14px] text-[#888]">{loading ? "Loading…" : images.length ? "No photos match your search." : "No photos yet. Start with the first car in Still needed."}</p>}
        </section>
        {dialog}
    </div>;
}
