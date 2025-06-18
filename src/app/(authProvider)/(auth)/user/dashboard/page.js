"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const res = await fetch("/api/user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error(`Authentication failed: ${res.status}`);
                }

                const data = await res.json();
                setUserData(data);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, []);

    useEffect(() => {
        if (error || (!loading && (!userData || !userData?.user))) {
            router.push("/access-denied");
        }
    }, [error, userData, loading, router]);

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Logout failed");
            }

            // Redirect to login page after successful logout
            window.location.href = "/login";
        } catch (err) {
            console.error("Error during logout:", err);
            alert("An error occurred while logging out.");
        }
    };
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen py-1 overflow-x-hidden">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
                <p className="mt-4 text-gray-600">Loading your dashboard...</p>
            </div>
        );
    }

    if (error || !userData || !userData.user) {
        return null; // This will render nothing while the redirect happens
    }

    return (
        <div className="flex flex-col items-center w-full py-1 overflow-x-hidden">
            <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
            <p className="text-gray-600">Welcome to your dashboard!</p>
            {/* Additional dashboard content can be added here */}
            <div className="mt-8">
                <p className="text-lg">Name: {userData.user.name}</p>
                <p className="text-lg">Email: {userData.user.email}</p>
                {/* Add more user details as needed */}
            </div>
            <Link
                href="/contents"
                className="mt-6 bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors"
            >
                <div>Explore Contents</div>
            </Link>
            <button
                onClick={handleLogout}
                className="mt-6 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
        </div>
    );
}
