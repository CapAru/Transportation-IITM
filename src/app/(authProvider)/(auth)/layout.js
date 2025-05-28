"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function AuthLayout({ children }) {
    const { isLoading, isAuthenticated, error } = useAuth();
    const [userData, setUserData] = useState(null);
    const [userLoading, setUserLoading] = useState(false);

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

    if (isLoading) return <p>Loading authentication...</p>;

    if (error) {
        router.push("/access-denied");
    }

    if (!isAuthenticated) return <p>Please login to continue</p>;

    return (
        <>
            {userLoading ? (
                <p>Loading user data...</p>
            ) : userData ? (
                <>
                    {children}
                </>
            ) : (
                <p>Could not load user data</p>
            )}
        </>
    );
}
