"use client";
import { RiLogoutCircleLine } from "react-icons/ri";
import RequestView from "@/components/RequestView";
import UserView from "@/components/UserView";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Admin() {
    // Start with a default value for server-side rendering
    const [view, setView] = useState("requests");
    // Add a state to track if the component has mounted
    const [hasMounted, setHasMounted] = useState(false);

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Add missing loading state
    const [error, setError] = useState(null);
    const router = useRouter();

    // Add a useEffect for handling redirects
    useEffect(() => {
        if (error || (!loading && (!userData || !userData.user))) {
            router.push("/access-denied");
        }
    }, [error, userData, loading, router]);

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
    }, [router]);

    // Handle initial load from localStorage after mounting
    useEffect(() => {
        const savedView = localStorage.getItem("adminView");
        if (savedView) {
            setView(savedView);
        }
        setHasMounted(true);
    }, []);

    // Update localStorage whenever view changes (but only after mounting)
    useEffect(() => {
        if (hasMounted) {
            localStorage.setItem("adminView", view);
        }
    }, [view, hasMounted]);

    const handleView = (viewType) => {
        return () => {
            setView(viewType);
        };
    };

    const handleAdminSignOut = async () => {
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

            // Redirect to the login page after successful logout
            router.push("/login");
        } catch (error) {
            console.error("Error during admin sign out:", error);
            alert("An error occurred while signing out. Please try again.");
        }
    }

    // If still loading or no data, show a loading indicator
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
                <p className="ml-2">Loading...</p>
            </div>
        );
    }

    // Don't render the main content if there's an error or no user data
    if (error || !userData || !userData.user) {
        return null; // This will render nothing while the redirect happens
    }

    return (
        <div className="flex flex-col md:flex-row items-center min-h-screen bg-gray-100 w-full">
            <div className="flex flex-row md:flex-col items-center md:items-start bg-white w-full md:w-1/2 lg:w-1/3 md:h-screen p-2 md:pr-2 md:pl-0 font-bold overflow-x-auto md:overflow-x-visible">
                <button onClick={handleAdminSignOut} className="bg-transparent text-red-700 text-left text-lg md:text-2xl py-2 md:py-4 px-3 md:px-8 rounded-full md:rounded-none md:rounded-r-full min-w-max md:w-full cursor-pointer hover:bg-red-700 hover:text-white transition-colors flex items-center">
                    <RiLogoutCircleLine className="inline-block mr-1 md:mr-2 text-2xl md:text-3xl" />
                    <p className="whitespace-nowrap">Sign Out</p>
                </button>
                <button
                    className={`${
                        view === "requests"
                            ? "bg-blue-900 text-white"
                            : "bg-transparent"
                    } text-blue-900 text-left text-lg md:text-2xl py-2 md:py-4 px-3 md:px-8 rounded-full md:rounded-none md:rounded-r-full min-w-max md:w-full cursor-pointer hover:bg-blue-900 hover:text-white transition-colors mx-2 md:mx-0 md:mt-2`}
                    onClick={handleView("requests")}
                >
                    <span className="whitespace-nowrap">View Requests</span>
                </button>
                <button
                    className={`${
                        view === "users"
                            ? "bg-blue-900 text-white"
                            : "bg-transparent"
                    } text-blue-900 text-left text-lg md:text-2xl py-2 md:py-4 px-3 md:px-8 rounded-full md:rounded-none md:rounded-r-full min-w-max md:w-full cursor-pointer hover:bg-blue-900 hover:text-white transition-colors mx-2 md:mx-0 md:mt-2`}
                    onClick={handleView("users")}
                >
                    <span className="whitespace-nowrap">View Users</span>
                </button>
            </div>
            <div className="bg-white w-full md:h-screen px-2 md:px-1 overflow-y-auto">
                {view === "requests" ? <RequestView /> : <UserView />}
            </div>
        </div>
    );
}
