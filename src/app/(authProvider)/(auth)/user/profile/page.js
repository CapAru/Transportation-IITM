"use client";

import { useState, useEffect } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { BiBookBookmark } from "react-icons/bi";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
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
        <div className="py-4 sm:py-6 lg:py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
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

                {/* Main Content */}
                <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Left Column - Personal Info */}
                    <div className="space-y-6">
                        {/* Contact Information */}
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

                    {/* Right Column - Account Info */}
                    <div className="space-y-6">
                        {/* Account Overview */}
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
                                <button className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base w-full hover:cursor-pointer">
                                    <div>Request for Extension</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
