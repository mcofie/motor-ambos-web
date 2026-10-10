const roads = [
    "M-25 80 C85 95 135 45 245 85 S440 95 605 65",
    "M-20 188 C80 180 128 215 230 194 S425 143 610 185",
    "M-20 330 C90 300 140 360 250 332 S445 305 610 345",
    "M78-20 C99 90 125 138 107 220 S137 345 148 450",
    "M252-20 C218 72 240 145 280 220 S305 345 275 450",
    "M450-20 C470 85 420 160 448 240 S515 350 485 450",
];

const routes = [
    { path: "M285 225 C220 185 165 165 105 155", duration: "6s", delay: "-2s" },
    { path: "M285 225 C350 155 400 145 477 135", duration: "7s", delay: "-4s" },
    { path: "M285 225 C350 225 410 278 485 315", duration: "6.5s", delay: "-1s" },
    { path: "M285 225 C230 255 195 300 120 325", duration: "7.5s", delay: "-5s" },
    { path: "M285 225 C290 275 300 310 308 370", duration: "6.8s", delay: "-3s" },
];

const mechanics = [
    { x: 105, y: 155 },
    { x: 477, y: 135 },
    { x: 485, y: 315 },
    { x: 120, y: 325 },
    { x: 308, y: 370 },
];

export default function MechanicNetworkMap() {
    return (
        <figure className="network-map relative mx-auto w-full max-w-[580px]">
            <svg viewBox="0 0 580 420" className="block h-auto w-full" aria-hidden="true">
                <defs>
                    <pattern id="network-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#E8ECF7" strokeWidth="1" /></pattern>
                    <radialGradient id="network-focus"><stop stopColor="#E4E7FF" /><stop offset="1" stopColor="#F8FAFF" stopOpacity="0" /></radialGradient>
                    <radialGradient id="network-edge-fade"><stop offset="55%" stopColor="#FFF" /><stop offset="100%" stopColor="#000" /></radialGradient>
                    <mask id="network-background-mask"><rect width="580" height="420" fill="url(#network-edge-fade)" /></mask>
                </defs>
                <g mask="url(#network-background-mask)">
                    <rect width="580" height="420" fill="url(#network-grid)" />
                    <circle cx="285" cy="225" r="195" fill="url(#network-focus)" />
                    {roads.map((road) => <g key={road}><path d={road} fill="none" stroke="#E3E8F1" strokeWidth="13" strokeLinecap="round" /><path d={road} fill="none" stroke="#FFF" strokeWidth="9" strokeLinecap="round" /></g>)}
                </g>

                {routes.map((route) => <g key={route.path}>
                    <path d={route.path} fill="none" stroke="#D0D4FF" strokeWidth="2.5" strokeLinecap="round" />
                    <path d={route.path} className="network-map-route" fill="none" stroke="#6262FF" strokeWidth="2.5" strokeLinecap="round" />
                    <circle className="network-map-packet" r="4.5" fill="#1111F6"><animateMotion path={route.path} dur={route.duration} begin={route.delay} repeatCount="indefinite" /></circle>
                </g>)}

                {mechanics.map((mechanic, index) => <g key={`${mechanic.x}-${mechanic.y}`}>
                    <circle className="network-map-pulse" cx={mechanic.x} cy={mechanic.y} r="28" fill="#7B7BFF" opacity="0.22" style={{ animationDelay: `${index * -0.7}s` }} />
                    <circle cx={mechanic.x} cy={mechanic.y} r="18" fill="#FFF" stroke="#1111F6" strokeWidth="2" />
                    <path d={`M${mechanic.x - 6} ${mechanic.y + 1}h12m-9-4h6m-5 7h8`} fill="none" stroke="#1111F6" strokeWidth="2" strokeLinecap="round" />
                </g>)}

                <circle className="network-map-driver-pulse" cx="285" cy="225" r="36" fill="#1111F6" opacity="0.15" />
                <circle cx="285" cy="225" r="23" fill="#1111F6" />
                <path d="M273 231h24l-2-8a3 3 0 0 0-3-2h-14a3 3 0 0 0-3 2l-2 8Zm-1 0h26v5h-26v-5Zm4 5v2m18-2v2" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <text x="285" y="266" fill="#171717" fontSize="12" textAnchor="middle">Driver request</text>
            </svg>

            <figcaption className="mt-1 text-center text-[12px] text-[#888]">
                Illustrative network view · not live provider locations
            </figcaption>
        </figure>
    );
}
