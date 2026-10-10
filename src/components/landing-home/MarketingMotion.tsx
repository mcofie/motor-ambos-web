"use client";

import { useEffect } from "react";

export default function MarketingMotion() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

        const page = document.querySelector<HTMLElement>("main.marketing-motion");
        if (!page) return;

        const sections = Array.from(page.querySelectorAll<HTMLElement>(":scope > section")).slice(1);
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.remove("motion-waiting");
                observer.unobserve(entry.target);
            }
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });

        for (const section of sections) {
            if (section.getBoundingClientRect().top < window.innerHeight * 0.9) continue;
            section.classList.add("motion-waiting");
            observer.observe(section);
        }

        return () => {
            observer.disconnect();
            sections.forEach((section) => section.classList.remove("motion-waiting"));
        };
    }, []);

    return null;
}
