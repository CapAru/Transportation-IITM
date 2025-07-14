"use client";

import NavBar from "@/components/NavBar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { GrSecure } from "react-icons/gr";
import { IoCloudDownloadOutline } from "react-icons/io5";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "TDMS - Home";
        document.description =
            "Welcome to the Transport Data Management System. Access transportation data and analytics at IIT Madras.";
    });
    useEffect(() => {
        // Check if user is logged in
        async function checkAuthStatus() {
            try {
                const res = await fetch("/api/user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        setIsLoggedIn(true);
                        setUserData(data.user);
                    }
                }
            } catch (error) {
                console.log("User not logged in");
            } finally {
                setLoading(false);
            }
        }

        checkAuthStatus();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}

            {isLoggedIn ? (
                <NavBar />
            ) : (
                <nav className="flex justify-between items-center px-6 py-4 lg:px-12 bg-white shadow-sm">
                    <div className="flex items-center">
                        <img src="/IIT_Madras_Logo.svg" width={"50px"} />
                    </div>
                    <div className="hidden md:flex space-x-8">
                        <Link
                            href="/login"
                            className="text-gray-600 px-4 py-2 hover:text-blue-600 transition-colors hover:bg-gray-200 font-medium rounded-lg"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Register
                        </Link>
                    </div>
                </nav>
            )}

            {isLoggedIn ? (
                // Logged in user dashboard
                <div className="max-w-7xl mx-auto px-6 py-20">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Welcome back,{" "}
                            <span className="text-blue-600">
                                {userData?.name}!
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                            Access your transportation data and manage your
                            account
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                        <Link
                            href="/contents"
                            className="group bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all"
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                View Data
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Access transportation datasets
                            </p>
                        </Link>

                        <Link
                            href="/user/profile"
                            className="group bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all"
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Profile
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Manage your account
                            </p>
                        </Link>
                    </div>

                    {/* Account Info */}
                    <div className="bg-gray-50 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Account Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-gray-600 mb-2">
                                    Account Status
                                </div>
                                <div className="text-2xl font-bold text-blue-600">
                                    Active
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-gray-600 mb-2">
                                    Institution
                                </div>
                                <div className="text-2xl font-bold text-green-600">
                                    {userData?.college || "IIT Madras"}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-gray-600 mb-2">
                                    Valid Until
                                </div>
                                <div className="text-2xl font-bold text-purple-600">
                                    {userData?.validity
                                        ? new Date(
                                              userData.validity
                                          ).toLocaleDateString("en-GB")
                                        : "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Public landing page for non-logged in users
                <div className="max-w-7xl mx-auto px-6 py-20">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Transportation Database
                            <span className="block text-blue-600">
                                Management System
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-1 max-w-2xl mx-auto">
                            Open-source database for transportation data by IIT
                            Madras.
                        </p>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Access GPS, Wi-Fi, RSU, and OBU data now.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/login"
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Get Started
                            </Link>
                            <Link
                                href="/signup"
                                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        {/* ...existing features code... */}
                        <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                <FaMapMarkedAlt className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Data Visualization
                            </h3>
                            <p className="text-gray-600">
                                View GPS, Wi-Fi, RSU, and OBU data with
                                interactive maps and comprehensive insights.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                                <GrSecure className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Secure Platform
                            </h3>
                            <p className="text-gray-600">
                                Enterprise-grade security with role-based access
                                control and data encryption.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                                <IoCloudDownloadOutline className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Easy Download
                            </h3>
                            <p className="text-gray-600">
                                Download data in CSV format with date-based
                                filtering capabilities.
                            </p>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="bg-gray-50 rounded-2xl p-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    10M+
                                </div>
                                <div className="text-gray-600">Data Points</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    4
                                </div>
                                <div className="text-gray-600">
                                    Data Sources
                                </div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-purple-600 mb-2">
                                    24/7
                                </div>
                                <div className="text-gray-600">Monitoring</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-orange-600 mb-2">
                                    99.9%
                                </div>
                                <div className="text-gray-600">Uptime</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
