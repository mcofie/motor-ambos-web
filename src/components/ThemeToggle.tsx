"use client";

import * as React from "react";
import {Button} from "@/components/ui/button";
import {Moon, Sun} from "lucide-react";

type Theme = "light" | "dark";

function applyTheme(t: Theme) {
    const root = document.documentElement;
    if (t === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
}

export function ThemeToggle() {
    const [mounted, setMounted] = React.useState(false);
    const [theme, setTheme] = React.useState<Theme>("light");

    // Hydration-safe initial theme
    React.useEffect(() => {
        setMounted(true);
        const saved = (localStorage.getItem("theme") as Theme | null) ?? null;
        const prefersDark =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;

        const initial: Theme = saved ?? (prefersDark ? "dark" : "light");
        setTheme(initial);
        applyTheme(initial);
    }, []);

    const toggle = () => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        setTheme(next);
        localStorage.setItem("theme", next);
        applyTheme(next);
    };

    // Avoid mismatched icons before mount
    const isDark = mounted ? theme === "dark" : false;

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggle}
            className="rounded-full"
        >
            {isDark ? <Sun className="h-5 w-5"/> : <Moon className="h-5 w-5"/>}
        </Button>
    );
}