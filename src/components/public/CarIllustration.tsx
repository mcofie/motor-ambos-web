import { useId } from "react";

export type BodyType = "sedan" | "hatchback" | "suv" | "pickup" | "van";

// Model names are matched loosely, so "LAND CRUISER PRADO" and "rav 4" still find their shape.
const bodyPatterns: [BodyType, RegExp][] = [
    ["van", /hiace|h-?100|sprinter|vito|transit|urvan|caravan|quantum|staria|starex|county|coaster|\bbus\b|\bvan\b/],
    ["pickup", /hilux|navara|ranger|l200|d-?max|tacoma|tundra|frontier|amarok|bt-?50|hardbody|pick-?up|triton|kb\b/],
    ["suv", /rav ?4|land ?cruiser|prado|fortuner|highlander|tucson|santa ?fe|sportage|sorento|x-?trail|pathfinder|cr-?v|hr-?v|vitara|gl[a-z]\b|\bx[1-7]\b|explorer|escape|everest|kona|creta|seltos|rush|4runner|venza|cx-?[3-9]|qashqai|juke|duster|terios|pajero|patrol|range ?rover|discovery|tiguan|touareg|q[3-8]\b|rx\b|lx\b|gx\b/],
    ["hatchback", /yaris|vitz|\bfit\b|jazz|i10|i20|picanto|morning|\brio ?5\b|march|micra|swift|alto|polo|golf|getz|baleno|celerio|spark|aqua|\bnote\b|ignis|wagon ?r|ist|passo|demio|mazda ?2|fiesta|clio|sandero/],
];

export function bodyTypeFor(make: string | null, model: string | null): BodyType {
    const name = `${make || ""} ${model || ""}`.toLowerCase();
    return bodyPatterns.find(([, pattern]) => pattern.test(name))?.[0] || "sedan";
}

const colourNames: Record<string, string> = {
    white: "#F2F1EE", pearl: "#ECE9E2", black: "#24262C", silver: "#C3C8CF", grey: "#7F858F", gray: "#7F858F",
    blue: "#2E54D1", navy: "#1F2C5C", red: "#C5302D", maroon: "#6F1F2A", wine: "#6F1F2A", green: "#2E7A4E",
    gold: "#C6A04A", champagne: "#D8C49A", brown: "#71513A", beige: "#D6C4A1", cream: "#E9DFC6", yellow: "#E7C135",
    orange: "#E3772D", purple: "#5B3A8C",
};

export function colourFor(name: string | null) {
    const key = (name || "").toLowerCase();
    const match = Object.keys(colourNames).find((colour) => key.includes(colour));
    return match ? colourNames[match] : "#9AA0AA";
}

function mix(hex: string, target: number, amount: number) {
    const value = parseInt(hex.slice(1), 16);
    const channel = (shift: number) => Math.round(((value >> shift) & 255) * (1 - amount) + target * amount);
    return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
}

type Shape = { body: string; glass: string; pillars: number[]; doors: number[]; wheels: [number, number]; arch: number; lights: { head: [number, number]; tail: [number, number] }; extra?: React.ReactNode };

// Side views facing right, drawn on a 400 x 170 canvas with the ground at y = 140.
const shapes: Record<BodyType, Shape> = {
    sedan: {
        body: "M24 126C24 111 33 103 52 100L118 93C136 72 158 60 188 58L244 58C267 58 284 70 302 89L352 97C369 100 376 109 376 121L376 131C376 136 372 139 367 139L328 139A32 32 0 0 0 264 139L132 139A32 32 0 0 0 68 139L33 139C28 139 24 135 24 130Z",
        glass: "M130 93C146 75 164 66 190 65L240 65C258 65 272 74 287 90Z",
        pillars: [206], doors: [206, 280], wheels: [100, 296], arch: 32, lights: { head: [360, 103], tail: [24, 103] },
    },
    hatchback: {
        body: "M46 124C46 104 49 92 58 86L68 80C80 64 96 56 122 55L222 55C246 55 264 68 282 88L338 97C355 100 362 109 362 121L362 131C362 136 358 139 353 139L322 139A32 32 0 0 0 258 139L132 139A32 32 0 0 0 68 139L54 139C49 139 46 135 46 130Z",
        glass: "M72 86C84 69 99 62 124 62L220 62C240 62 255 72 270 88L72 88Z",
        pillars: [166], doors: [166, 252], wheels: [100, 290], arch: 32, lights: { head: [346, 103], tail: [46, 96] },
    },
    suv: {
        body: "M28 122C28 102 34 92 48 90L68 88C72 66 82 50 112 48L246 48C268 48 284 60 300 80L350 90C368 94 376 104 376 118L376 132C376 137 372 140 367 140L336 140A34 34 0 0 0 268 140L136 140A34 34 0 0 0 68 140L37 140C32 140 28 136 28 131Z",
        glass: "M76 86C80 68 90 56 114 55L244 55C262 55 276 64 290 81L290 86Z",
        pillars: [158, 226], doors: [158, 226, 290], wheels: [102, 302], arch: 34, lights: { head: [360, 98], tail: [28, 96] },
        extra: <path d="M112 44H240" stroke="#3A3F48" strokeWidth="3" strokeLinecap="round" />,
    },
    pickup: {
        body: "M24 120L24 96C24 92 27 90 31 90L186 90L192 60C194 52 200 48 210 48L262 48C278 48 290 58 302 76L354 88C370 92 376 102 376 116L376 132C376 137 372 140 367 140L336 140A32 32 0 0 0 272 140L132 140A32 32 0 0 0 68 140L32 140C27 140 24 136 24 131Z",
        glass: "M200 84L204 60C205 56 208 55 212 55L258 55C272 55 282 64 292 80L292 84Z",
        pillars: [246], doors: [186, 246, 300], wheels: [100, 304], arch: 32, lights: { head: [360, 96], tail: [24, 96] },
    },
    van: {
        body: "M26 128L26 50C26 41 33 36 42 36L290 36C308 36 320 46 330 62L360 98C370 108 376 115 376 125L376 132C376 137 372 140 367 140L332 140A32 32 0 0 0 268 140L132 140A32 32 0 0 0 68 140L35 140C30 140 26 136 26 131Z",
        glass: "M38 46L290 46C302 46 310 52 318 63L340 90L38 90Z",
        pillars: [98, 158, 222, 286], doors: [158, 222, 300], wheels: [100, 300], arch: 32, lights: { head: [362, 104], tail: [26, 100] },
    },
};

export default function CarIllustration({ make, model, color, className = "" }: { make: string | null; model: string | null; color: string | null; className?: string }) {
    const id = useId().replace(/[^a-zA-Z0-9]/g, "");
    const type = bodyTypeFor(make, model);
    const shape = shapes[type];
    const paint = colourFor(color);
    const dark = paint === colourNames.black;
    const top = mix(paint, 255, dark ? 0.16 : 0.22);
    const bottom = mix(paint, 0, dark ? 0.1 : 0.2);
    const line = dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.16)";

    return <svg viewBox="0 28 400 146" role="img" aria-label={`Illustration of a ${(color || "").toLowerCase()} ${type}`.replace(/\s+/g, " ")} className={className}>
        <defs>
            <linearGradient id={`paint${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="0.55" stopColor={paint} /><stop offset="1" stopColor={bottom} /></linearGradient>
            <linearGradient id={`glass${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3A4559" /><stop offset="1" stopColor="#1C2230" /></linearGradient>
            <clipPath id={`clip${id}`}><path d={shape.body} /></clipPath>
            <clipPath id={`glassclip${id}`}><path d={shape.glass} /></clipPath>
        </defs>
        <ellipse cx="200" cy="166" rx="172" ry="6" fill="rgba(20,22,40,0.16)" />
        <path d={shape.body} fill={`url(#paint${id})`} stroke={line} strokeWidth="1" />
        <g clipPath={`url(#clip${id})`}>
            <rect x="0" y="112" width="400" height="30" fill={bottom} opacity="0.35" />
            {shape.doors.map((x) => <path key={x} d={`M${x} ${type === "van" ? 92 : 94}V${132}`} stroke={line} strokeWidth="1.4" />)}
        </g>
        {shape.extra}
        <path d={shape.glass} fill={`url(#glass${id})`} />
        <path d={shape.glass} fill="none" stroke={dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"} />
        <g clipPath={`url(#glassclip${id})`}>
            {shape.pillars.map((x) => <rect key={x} x={x - 3} y="30" width="6" height="70" fill={paint} />)}
            <path d={`M${shape.pillars[0] - 34} 40L${shape.pillars[0] - 16} 40L${shape.pillars[0] - 52} 100L${shape.pillars[0] - 70} 100Z`} fill="#FFFFFF" opacity="0.09" />
        </g>
        {shape.doors.slice(0, 2).map((x) => <rect key={x} x={x + 14} y={104} width="16" height="3.5" rx="1.75" fill={line} />)}
        <rect x={shape.lights.head[0]} y={shape.lights.head[1]} width="16" height="8" rx="4" fill="#FFF3C9" />
        <rect x={shape.lights.tail[0]} y={shape.lights.tail[1]} width="9" height="10" rx="3" fill="#D23B3B" />
        {shape.wheels.map((cx) => <g key={cx}>
            <circle cx={cx} cy="139" r={shape.arch - 4} fill="#1B1D22" />
            <circle cx={cx} cy="139" r={shape.arch - 13} fill="#C7CCD3" />
            <circle cx={cx} cy="139" r={shape.arch - 19} fill="#9AA0A9" />
            {[0, 72, 144, 216, 288].map((angle) => <rect key={angle} x={cx - 1.5} y={139 - (shape.arch - 14)} width="3" height={shape.arch - 18} rx="1.5" fill="#E4E7EB" transform={`rotate(${angle} ${cx} 139)`} />)}
            <circle cx={cx} cy="139" r="4" fill="#5E646D" />
        </g>)}
    </svg>;
}
