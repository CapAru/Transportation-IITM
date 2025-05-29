"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";

export default function AuthLayout({ children }) {
    const router = useRouter();
    const { isLoading, isAuthenticated, error } = useAuth();
    const [userData, setUserData] = useState(null);
    const [userLoading, setUserLoading] = useState(false);

    // Handle error redirect in useEffect
    useEffect(() => {
        if (error) {
            router.push("/access-denied");
        }
    }, [error, router]);

    useEffect(() => {
        // Only fetch user data after authentication is confirmed
        if (!isLoading && isAuthenticated) {
            setUserLoading(true);
            fetch("/api/user")
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`Failed to fetch user: ${res.status}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    setUserData(data);
                    setUserLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching user data:", err);
                    setUserLoading(false);
                });
        }
    }, [isLoading, isAuthenticated]);

    const pathname = usePathname();

    if (isLoading) return <p>Loading authentication...</p>;

    if (error) {
        return <p>Redirecting...</p>;
    }

    if (!isAuthenticated) return <p>Please login to continue</p>;

    return (
        <>
            {userLoading ? (
                <p>Loading user data...</p>
            ) : userData ? (
                <>
                    {pathname !== "/admin" && <NavBar />}
                    {children}
                </>
            ) : (
                <p>Could not load user data</p>
            )}
        </>
    );
}
