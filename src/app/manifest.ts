import type { MetadataRoute } from "next";

/** Lets drivers add Motor Ambos to their home screen and open it full screen, like an app. */
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Motor Ambos",
        short_name: "Motor Ambos",
        description: "Your car's papers, records and roadside help in one place.",
        start_url: "/app",
        scope: "/",
        display: "standalone",
        background_color: "#F7F7F7",
        theme_color: "#F7F7F7",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
    };
}
