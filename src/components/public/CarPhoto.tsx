"use client";

import { useEffect, useRef, useState } from "react";
import CarIllustration from "@/components/public/CarIllustration";

/** Shows the library photo when one exists, and the drawn car when it does not or fails to load. */
export default function CarPhoto({ src, make, model, color, alt, className = "" }: { src: string | null; make: string | null; model: string | null; color: string | null; alt: string; className?: string }) {
    const [failed, setFailed] = useState(false);
    // null until hydrated, so the server HTML never holds the entrance animation back.
    const [loaded, setLoaded] = useState<boolean | null>(null);
    const image = useRef<HTMLImageElement>(null);

    // A cached photo can finish loading before React attaches onLoad.
    useEffect(() => { setLoaded((current) => current ?? Boolean(image.current?.complete && image.current.naturalWidth)); }, []);

    if (!src || failed) return <CarIllustration make={make} model={model} color={color} className={className} />;
    // eslint-disable-next-line @next/next/no-img-element -- library photo served from public storage
    return <img ref={image} src={src} alt={alt} data-loading={loaded === false ? "" : undefined} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} className={`${className} object-contain`} />;
}
