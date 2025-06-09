"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function RootLayout({ children }) {
    const router = useRouter();
    useEffect(() => {
        const user = fetch("/api/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if (!user.isAdmin){
            router.push("/access-denied");
        }
    }, [])
    return (
        <div>
            {children}
        </div>
    );
}