import { useId } from "react";
import Image from "next/image";
import { Nfc } from "lucide-react";

export type Skin = "squiggle" | "liquid" | "black";

/** The card tiers on sale use these designs. */
export const skinForDesign = (design: string): Skin => design === "black" ? "black" : design === "white-marble" ? "liquid" : "squiggle";

const BLUE = "#1111F6";

// Fine speckles in the card's paper colour, laid over the pattern for a printed, grainy finish.
function Grain({ id, dark = false }: { id: string; dark?: boolean }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 340 214" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
            <filter id={id} filterUnits="userSpaceOnUse" x="0" y="0" width="340" height="214">
                <feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="1" seed="4" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values={dark ? "0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  6 0 0 0 -4.6" : "0 0 0 0 0.961  0 0 0 0 0.957  0 0 0 0 0.941  14 0 0 0 -9.3"} />
            </filter>
            <rect width="340" height="214" filter={`url(#${id})`} />
        </svg>
    );
}

const WAVE_TOP = "M-40 30C30 30 60 64 104 54C150 44 150 2 196 18C236 32 196 84 232 104C268 124 300 78 336 106C360 124 350 162 390 178";
const WAVE_BOTTOM = "M-40 190C-4 190 8 134 44 140C80 146 70 202 112 208C152 214 170 170 212 182C246 192 252 232 272 262";
const GOLD = "#C9A55C";

function SquigglePattern({ black = false }: { black?: boolean }) {
    const wave = black ? "#24252B" : BLUE;
    const accent = black ? GOLD : BLUE;
    return (
        <svg aria-hidden="true" viewBox="0 0 340 214" preserveAspectRatio="xMidYMid slice" className="smart-card-pattern absolute -inset-[6%] h-[112%] w-[112%]">
            <g fill="none" strokeLinecap="round">
                <path stroke={wave} strokeWidth="33" d={WAVE_TOP} />
                <path stroke={wave} strokeWidth="33" d={WAVE_BOTTOM} />
                {black && <path stroke={GOLD} strokeWidth="1.4" opacity="0.85" d={WAVE_TOP} />}
                <g stroke={accent}>
                    <path strokeWidth={black ? 3 : 10} d="M128 2C142 6 152 18 154 32" />
                    <path strokeWidth={black ? 3 : 10} d="M284 22C298 26 308 38 310 52" />
                    <path strokeWidth={black ? 3 : 10} d="M10 112C16 100 28 94 40 92" />
                    <circle cx="172" cy="58" r="6" strokeWidth={black ? 1.6 : 3.5} />
                    <circle cx="286" cy="66" r="6" strokeWidth={black ? 1.6 : 3.5} />
                </g>
            </g>
            <circle cx="60" cy="104" r={black ? 3.5 : 7.5} fill={accent} />
        </svg>
    );
}

function LiquidPattern({ id }: { id: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 340 214" preserveAspectRatio="xMidYMid slice" className="smart-card-pattern smart-card-pattern--slow absolute -inset-[6%] h-[112%] w-[112%]">
            <filter id={id} filterUnits="userSpaceOnUse" x="0" y="0" width="340" height="214" colorInterpolationFilters="sRGB">
                <feTurbulence type="fractalNoise" baseFrequency="0.011 0.027" numOctaves="2" seed="11" result="low" />
                <feColorMatrix in="low" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1" result="lowOpaque" />
                <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="2" result="fine" />
                <feColorMatrix in="fine" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1" result="fineOpaque" />
                <feComposite in="lowOpaque" in2="fineOpaque" operator="arithmetic" k2="1" k3="0.09" k4="-0.045" result="mix" />
                <feColorMatrix in="mix" type="matrix" values="0 0 0 0 0.067  0 0 0 0 0.067  0 0 0 0 0.965  70 0 0 0 -35" />
            </filter>
            <rect width="340" height="214" filter={`url(#${id})`} />
        </svg>
    );
}

export function SmartCard({ skin, className = "" }: { skin: Skin; className?: string }) {
    const id = useId().replace(/[^a-zA-Z0-9]/g, "");
    const black = skin === "black";
    return (
        <div className={`smart-card relative aspect-[1.586] w-full overflow-hidden rounded-[6cqw] ${black ? "bg-[#111215] ring-1 ring-white/10" : "bg-[#F5F4F0] ring-1 ring-black/5"} ${className}`}>
            {skin === "liquid" ? <LiquidPattern id={`liquid${id}`} /> : <SquigglePattern black={black} />}
            <Grain id={`grain${id}`} dark={black} />
            <div className="relative flex h-full flex-col justify-between p-[5.5cqw]">
                <span className={`flex items-center gap-[1.8cqw] self-start rounded-full py-[1.6cqw] pl-[2.4cqw] pr-[3.2cqw] text-[3.6cqw] font-medium tracking-[-0.01em] ${black ? "bg-[#1B1C21] text-white ring-1 ring-white/10" : "bg-[#F5F4F0] text-[#171717] shadow-[0_1px_0_rgba(0,0,0,0.04)]"}`}>
                    <span className="relative block h-[4.6cqw] w-[5.5cqw] shrink-0"><Image src="/icon.svg" alt="" fill sizes="32px" className={black ? "brightness-0 invert" : ""} /></span>Motor Ambos
                </span>
                <span className={`smart-card-nfc flex h-[11cqw] w-[11cqw] items-center justify-center self-end rounded-full ${black ? "bg-[#1B1C21] text-[#C9A55C] ring-1 ring-white/10" : "bg-[#F5F4F0] text-[#1111F6]"}`}><Nfc className="h-[5.8cqw] w-[5.8cqw]" strokeWidth={2} /></span>
            </div>
        </div>
    );
}

export default function SmartCardStack() {
    return (
        <div className="smart-card-stack relative mx-auto aspect-[1.42] w-full max-w-[560px]" role="img" aria-label="Two Motor Ambos Smart Cards with blue wave patterns">
            <div aria-hidden="true" className="absolute inset-x-[10%] bottom-[2%] h-[40%] rounded-full bg-[#B9C0F0] opacity-40 blur-[50px]" />
            <div className="smart-card-slot smart-card-slot--back absolute right-0 top-0 w-[76%] [container-type:inline-size]">
                <div className="smart-card-float smart-card-float--back"><SmartCard skin="liquid" /></div>
            </div>
            <div className="smart-card-slot smart-card-slot--front absolute bottom-0 left-0 w-[76%] [container-type:inline-size]">
                <div className="smart-card-float"><SmartCard skin="squiggle" /></div>
            </div>
        </div>
    );
}
