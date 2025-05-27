"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PasswordReset() {
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen py-1 overflow-x-hidden">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        );
    }

    if (error || !userData || !userData.user) {
        return null
    }
    async function handlePasswordReset(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newPassword = formData.get("newPassword");
        const confirmPassword = formData.get("confirmPassword");

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Simulate password reset API call
        console.log(newPassword);

        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newPassword }),
            });

            if (res.ok) {
                alert("Password reset successfully!");
                window.location.href = "/login"; // Redirect to login page after successful reset
            } else {
                const errorData = await res.json();
                alert(`Error resetting password: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Password reset error:", error);
            alert(
                `An error occurred: ${
                    error.message || "Failed to reset password"
                }`
            );
        }
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Password Reset
                </h1>
                <p className="text-center text-gray-600 mb-4">
                    Please enter your new password below.
                </p>
                {/* Password reset form will go here */}
                <form
                    className="flex flex-col items-center w-full"
                    onSubmit={handlePasswordReset}
                >
                    <div className="flex flex-col items-start w-full my-2">
                        <label htmlFor="newPassword" className="mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            placeholder="Enter your new password"
                            className="border-blue-600 border-2 rounded-lg py-2 px-4 text-md w-full bg-gray-100 placeholder-gray-500 text-black"
                            required
                        />
                    </div>
                    <div className="flex flex-col items-start w-full my-2">
                        <label htmlFor="confirmPassword" className="mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm your new password"
                            className="border-blue-600 border-2 rounded-lg py-2 px-4 text-md w-full bg-gray-100 placeholder-gray-500 text-black"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="hover:bg-blue-400 text-white py-2 px-4 rounded-lg mt-6 w-full cursor-pointer bg-blue-500 transition-colors"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
}
