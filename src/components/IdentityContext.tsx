"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Identity = "standard" | "brutalist" | "blueprint" | "onyx" | "platform";

interface IdentityContextType {
    identity: Identity;
    setIdentity: (identity: Identity) => void;
    toggleIdentity: () => void;
}

const IdentityContext = createContext<IdentityContextType | undefined>(undefined);

export function IdentityProvider({ children }: { children: React.ReactNode }) {
    const [identity, setIdentity] = useState<Identity>("platform");

    // Persist to local storage
    useEffect(() => {
        const saved = localStorage.getItem("visual-identity") as Identity;
        const validIdentities: Identity[] = ["standard", "brutalist", "blueprint", "onyx", "platform"];
        if (saved && validIdentities.includes(saved)) {
            setIdentity(saved);
        }
    }, []);

    const handleSetIdentity = (newIdentity: Identity) => {
        setIdentity(newIdentity);
        localStorage.setItem("visual-identity", newIdentity);
    };

    const toggleIdentity = () => {
        const nextMap: Record<Identity, Identity> = {
            "platform": "standard",
            "standard": "brutalist",
            "brutalist": "blueprint",
            "blueprint": "onyx",
            "onyx": "platform"
        };
        handleSetIdentity(nextMap[identity]);
    };

    return (
        <IdentityContext.Provider value={{ identity, setIdentity: handleSetIdentity, toggleIdentity }}>
            {children}
        </IdentityContext.Provider>
    );
}

export function useIdentity() {
    const context = useContext(IdentityContext);
    if (context === undefined) {
        throw new Error("useIdentity must be used within an IdentityProvider");
    }
    return context;
}
