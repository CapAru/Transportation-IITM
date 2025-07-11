"use client";
import { RiLogoutCircleLine, RiMenuLine, RiCloseLine } from "react-icons/ri";
import RequestView from "@/components/RequestView";
import UserView from "@/components/UserView";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PastView from "@/components/PastView";
import ExtensionView from "@/components/ExtensionView";

export default function Admin() {
    const [view, setView] = useState("requests");
    const [hasMounted, setHasMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const router = useRouter();

    // Toast notification function
    const showToast = (message, type = "error") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type: "" });
        }, 3000);
    };

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
            setIsMobileMenuOpen(false);
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

            router.push("/");
        } catch (error) {
            console.error("Error during admin sign out:", error);
            showToast(
                "An error occurred while signing out. Please try again.",
                "error"
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !userData || !userData.user) {
        return null;
    }

    return (
        <div className="flex flex-col md:flex-row items-center min-h-screen w-full">
            {/* Toast Notification */}
            {toast.show && (
                <div
                    className={`fixed top-4 left-1/2 z-50 rounded-lg shadow-lg text-white font-medium overflow-hidden ${
                        toast.type === "error" ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{
                        transform: "translateX(-50%)",
                        animation: "slideInFromTop 0.5s ease-out",
                    }}
                >
                    <div className="px-6 py-3">{toast.message}</div>
                    {/* Loading bar */}
                    <div
                        className={`w-full h-1 ${
                            toast.type === "error"
                                ? "bg-red-600"
                                : "bg-green-600"
                        } bg-opacity-20`}
                    >
                        <div
                            className={`h-full ${
                                toast.type === "error"
                                    ? "bg-red-400"
                                    : "bg-green-400"
                            } bg-opacity-80`}
                            style={{
                                width: "100%",
                                animation: "shrinkProgress 3s linear",
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Mobile Header with Hamburger */}
            <div className="md:hidden fixed top-0 left-0 right-0 w-full bg-white p-4 flex justify-between items-center shadow-md z-50">
                <h1 className="text-xl font-bold text-blue-900">
                    {view === "requests"
                        ? "View Requests"
                        : view === "users"
                        ? "View Users"
                        : "Past Users"}
                </h1>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-blue-900 text-2xl p-2"
                >
                    {isMobileMenuOpen ? <RiCloseLine /> : <RiMenuLine />}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed top-16 left-0 right-0 bg-white shadow-lg z-40 border-t">
                    <div className="flex flex-col p-2">
                        <button
                            onClick={handleAdminSignOut}
                            className="bg-transparent text-red-700 text-left text-lg py-3 px-4 hover:bg-red-50 transition-colors flex items-center border-b border-gray-200"
                        >
                            <RiLogoutCircleLine className="inline-block mr-2 text-xl" />
                            <span>Sign Out</span>
                        </button>
                        <button
                            className={`${
                                view === "requests"
                                    ? "bg-blue-900 text-white"
                                    : "bg-transparent text-blue-900"
                            } text-left text-lg py-3 px-4 hover:bg-blue-900 hover:text-white transition-colors border-b border-gray-200`}
                            onClick={handleView("requests")}
                        >
                            View Requests
                        </button>
                        <button
                            className={`${
                                view === "users"
                                    ? "bg-blue-900 text-white"
                                    : "bg-transparent text-blue-900"
                            } text-left text-lg py-3 px-4 hover:bg-blue-900 hover:text-white transition-colors border-b border-gray-200`}
                            onClick={handleView("users")}
                        >
                            View Users
                        </button>
                        <button
                            className={`${
                                view === "past"
                                    ? "bg-blue-900 text-white"
                                    : "bg-transparent text-blue-900"
                            } text-left text-lg py-3 px-4 hover:bg-blue-900 hover:text-white transition-colors`}
                            onClick={handleView("past")}
                        >
                            Past Users
                        </button>
                        <button
                            className={`${
                                view === "extension"
                                    ? "bg-blue-900 text-white"
                                    : "bg-transparent text-blue-900"
                            } text-left text-lg py-3 px-4 hover:bg-blue-900 hover:text-white transition-colors`}
                            onClick={handleView("extension")}
                        >
                            Extension Requests
                        </button>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col items-start bg-white w-1/2 lg:w-1/3 h-screen pr-2 font-bold">
                <button
                    onClick={handleAdminSignOut}
                    className="bg-transparent text-red-700 text-left text-2xl py-4 px-8 rounded-r-full w-full cursor-pointer hover:bg-red-700 hover:text-white transition-colors flex items-center"
                >
                    <RiLogoutCircleLine className="inline-block mr-2 text-3xl" />
                    <p>Sign Out</p>
                </button>
                <button
                    className={`${
                        view === "requests"
                            ? "bg-blue-900 text-white"
                            : "bg-transparent"
                    } text-blue-900 text-left text-2xl py-4 px-8 rounded-r-full w-full cursor-pointer hover:bg-blue-900 hover:text-white transition-colors mt-2`}
                    onClick={handleView("requests")}
                >
                    View Requests
                </button>
                <button
                    className={`${
                        view === "users"
                            ? "bg-blue-900 text-white"
                            : "bg-transparent"
                    } text-blue-900 text-left text-2xl py-4 px-8 rounded-r-full w-full cursor-pointer hover:bg-blue-900 hover:text-white transition-colors mt-2`}
                    onClick={handleView("users")}
                >
                    View Users
                </button>
                <button
                    className={`${
                        view === "past"
                            ? "bg-blue-900 text-white"
                            : "bg-transparent"
                    } text-blue-900 text-left text-2xl py-4 px-8 rounded-r-full w-full cursor-pointer hover:bg-blue-900 hover:text-white transition-colors mt-2`}
                    onClick={handleView("past")}
                >
                    Past Users
                </button>
                <button
                    className={`${
                        view === "extension"
                            ? "bg-blue-900 text-white"
                            : "bg-transparent"
                    } text-blue-900 text-left text-2xl py-4 px-8 rounded-r-full w-full cursor-pointer hover:bg-blue-900 hover:text-white transition-colors mt-2`}
                    onClick={handleView("extension")}
                >
                    Extension Requests
                </button>
            </div>

            {/* Main Content */}
            <div className="bg-white w-full md:h-screen px-2 md:px-1 pt-20 md:pt-2 overflow-y-auto">
                {view === "requests" ? (
                    <RequestView />
                ) : view === "users" ? (
                    <UserView />
                ) : view === "past" ? (
                    <PastView />
                ) : (
                    <ExtensionView />
                )}
            </div>
        </div>
    );
}
