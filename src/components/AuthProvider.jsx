"use client";
import { useEffect } from "react";

export default function AuthProvider({ children }) {
    useEffect(() => {
        const refresh = async () => {
            await fetch("/api/refresh", {
                method: "POST",
                credentials: "include", // this ensures cookies are sent
            });
        };

        // Initial refresh on mount
        refresh();

        const interval = setInterval(refresh, 1 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return children;
}
