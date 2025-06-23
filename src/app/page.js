"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

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
            <nav className="flex justify-between items-center p-6 lg:px-12 bg-white shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">T</span>
                    </div>
                    <span className="text-gray-900 font-bold text-xl">
                        TDMS
                    </span>
                </div>

                {isLoggedIn ? (
                    <div className="flex items-center space-x-6">
                        <span className="text-gray-600 hidden md:block">
                            Welcome,{" "}
                            <span className="font-semibold text-gray-900">
                                {userData?.name}
                            </span>
                        </span>
                        <Link
                            href="/contents"
                            className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                        >
                            Contents
                        </Link>
                        <Link
                            href="/user/profile"
                            className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                        >
                            Profile
                        </Link>
                        <Link
                            href="/admin"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Admin
                        </Link>
                    </div>
                ) : (
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
                )}
            </nav>

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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

                        <Link
                            href="/contents/GPS"
                            className="group bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all"
                        >
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                                <svg
                                    className="w-6 h-6 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                GPS Data
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Location tracking data
                            </p>
                        </Link>

                        <Link
                            href="/contents/Wi-Fi"
                            className="group bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-orange-300 transition-all"
                        >
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                                <svg
                                    className="w-6 h-6 text-orange-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Wi-Fi Data
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Network connectivity data
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
                                <div className="text-2xl font-bold text-blue-600 mb-2">
                                    Active
                                </div>
                                <div className="text-gray-600">
                                    Account Status
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 mb-2">
                                    {userData?.college || "IIT Madras"}
                                </div>
                                <div className="text-gray-600">Institution</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600 mb-2">
                                    {userData?.validity
                                        ? new Date(
                                              userData.validity
                                          ).toLocaleDateString()
                                        : "N/A"}
                                </div>
                                <div className="text-gray-600">Valid Until</div>
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
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Advanced analytics and intelligent insights for
                            transportation data at IIT Madras
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
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Real-time Analytics
                            </h3>
                            <p className="text-gray-600">
                                Monitor GPS, Wi-Fi, RSU, and OBU data with
                                advanced visualization and insights.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
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
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
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
                                <svg
                                    className="w-6 h-6 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Easy Export
                            </h3>
                            <p className="text-gray-600">
                                Export data in multiple formats with powerful
                                filtering and search capabilities.
                            </p>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="bg-gray-50 rounded-2xl p-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    10K+
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

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-3 mb-4 md:mb-0">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">T</span>
                            </div>
                            <span className="text-white font-semibold">
                                TDMS
                            </span>
                        </div>
                        <div className="flex space-x-8">
                            {!isLoggedIn && (
                                <Link
                                    href="/admin"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Admin Portal
                                </Link>
                            )}
                            <span className="text-gray-400">
                                © 2025 IIT Madras
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
