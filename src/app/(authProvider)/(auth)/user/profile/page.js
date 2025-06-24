"use client";

import { useState, useEffect } from "react";
import { FiMail, FiX } from "react-icons/fi";
import { BiBookBookmark } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { Loader } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

export default function ProfilePage() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [extensionPopup, setExtensionPopup] = useState(false);
    const [extensionData, setExtensionData] = useState({
        extensionDate: "",
        reason: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });    useEffect(() => {
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

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type: "" });
        }, 3000);
    };

    useEffect(() => {
        if (error || (!loading && (!userData || !userData?.user))) {
            router.push("/access-denied");
        }
    }, [error, userData, loading, router]);

    const handleExtenstionPopup = () => {
        setExtensionPopup(true);
    };
    const closeExtensionPopup = () => {
        setExtensionPopup(false);
        setExtensionData({ extensionDate: "", reason: "" });
        setIsSubmitting(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setExtensionData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };    const handleExtension = async (e) => {
        e.preventDefault();

        if (!extensionData.extensionDate || !extensionData.reason.trim()) {
            showToast("Please fill in both the extension date and reason.", "error");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/user/extension", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: userData.user.email,
                    extensionDate: extensionData.extensionDate,
                    reason: extensionData.reason,
                }),
            });

            const data = await res.json();

            if (res.error) {
                throw new Error(
                    data.error || `Failed to request extension: ${res.status}`
                );
            }            if (data.success) {
                closeExtensionPopup();
                setTimeout(() => {
                    showToast("Extension request sent successfully!", "success");
                }, 300);
            } else {
                showToast("Failed to send extension request. Please try again later.", "error");
            }
        } catch (err) {
            console.error("Error requesting extension:", err);
            showToast("An error occurred while requesting extension. Please try again later.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen py-1 overflow-x-hidden">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        );
    }

    if (error || !userData || !userData.user) {
        return null;
    }
    const createdAt = new Date(userData.user.createdAt);
    const formattedDate = createdAt.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const validityDate = new Date(userData.user.validity);
    const formattedValidity = validityDate.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });    
    return (
        <>
            {toast.show && (
                <>
                    <style jsx>{`
                        @keyframes slideInFromTop {
                            0% {
                                opacity: 0;
                                transform: translateX(-50%) translateY(-20px);
                            }
                            100% {
                                opacity: 1;
                                transform: translateX(-50%) translateY(0);
                            }
                        }
                        @keyframes shrinkProgress {
                            0% {
                                width: 100%;
                            }
                            100% {
                                width: 0%;
                            }
                        }
                    `}</style>
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
                                }  bg-opacity-80`}
                                style={{
                                    width: "100%",
                                    animation: "shrinkProgress 3s linear",
                                }}
                            />
                        </div>
                    </div>
                </>
            )}

            <div className="py-4 sm:py-6 lg:py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-900 via-blue-950 to-gray-900 h-16 sm:h-20"></div>
                    <div className="px-4 py-4 sm:px-6 sm:py-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                    {userData.user.name}
                                </h1>
                                <p className="text-base sm:text-lg text-gray-600 mt-1">
                                    {userData.user.college}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 h-full">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Personal Information
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start sm:items-center gap-3">
                                    <FiMail className="w-5 h-5 text-gray-400 mt-1 sm:mt-0" />
                                    <div className="flex-1 min-w-0">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address
                                        </label>
                                        <span className="text-gray-600 break-all sm:break-normal text-sm sm:text-base">
                                            {userData.user.email}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-start sm:items-center gap-3">
                                    <BiBookBookmark className="w-5 h-5 text-gray-400 mt-1 sm:mt-0" />
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            College/Institution
                                        </label>
                                        <span className="text-gray-600 text-sm sm:text-base">
                                            {userData.user.college}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 h-full">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Account Overview
                            </h2>
                            <div className="space-y-4 flex flex-col items-center">
                                <div className="space-y-2 w-full">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm sm:text-base">
                                            Member Since
                                        </span>
                                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                                            {formattedDate}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm sm:text-base">
                                            Valid Until
                                        </span>
                                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                                            {formattedValidity}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleExtenstionPopup}
                                    className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base w-full hover:cursor-pointer"
                                >
                                    <div>Request for Extension</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Extension Popup */}
            {extensionPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Request Extension
                            </h3>
                            <button
                                onClick={closeExtensionPopup}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleExtension}
                            className="p-6 space-y-4"
                        >
                            <div>
                                <label
                                    htmlFor="extensionDate"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Extension Date *
                                </label>
                                <input
                                    type="date"
                                    id="extensionDate"
                                    name="extensionDate"
                                    value={extensionData.extensionDate}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="reason"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Reason for Extension *
                                </label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    value={extensionData.reason}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Please provide a detailed reason for your extension request..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    required
                                />
                            </div>{" "}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeExtensionPopup}
                                    className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`flex-1 px-4 py-2 text-white rounded-md transition-colors flex items-center justify-center ${
                                        isSubmitting
                                            ? "bg-blue-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="mr-2">
                                                Submitting...
                                            </span>
                                            <Loader filledColor="blue" />
                                        </>
                                    ) : "Submit Request"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            </div>
        </>
    );
}
