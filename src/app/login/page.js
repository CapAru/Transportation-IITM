"use client";
import Link from "next/link";
import Image from "next/image";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [warning, setWarning] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [path, setPath] = useState("/");
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [loading, setLoading] = useState(true); // Add loading state for the form
    useEffect(() => {
        async function fetchUserData() {
            try {
                const res = await fetch("/api/user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        setLoggedIn(true);
                        setPath(data.user.isAdmin ? "/admin" : "/contents");
                        return;
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        fetchUserData();
        setLoading(false); // Set loading to false after fetching user data
    }, []);

    useEffect(() => {
        if (loggedIn) {
            router.push(path);
        }
    }, [loggedIn, router, path]);

    function handleLogin(event) {
        event.preventDefault();
        setIsLoading(true); // Set loading to true when login starts
        setWarning(""); // Clear any previous warnings

        const formData = new FormData(event.target);
        const email = formData.get("email");
        const password = formData.get("password");

        const res = fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
            credentials: "include",
        });

        res.then((response) => {
            return response.json();
        })
            .then((data) => {
                if (data.validity && data.validity < new Date()) {
                    setWarning(
                        "Your account has expired. Please contact support."
                    );
                    setIsLoading(false); // Stop loading on error
                    return;
                }

                if (data.error) {
                    setWarning(data.error); // Use warning instead of alert
                    setIsLoading(false); // Stop loading on error
                } else if (data.message === "success") {
                    // Store session info in localStorage as fallback
                    if (typeof window !== "undefined" && data.debug) {
                        localStorage.setItem(
                            "sessionData",
                            JSON.stringify({
                                isAdmin: data.isAdmin,
                                timestamp: new Date().getTime(),
                                environment: data.debug.environment,
                            })
                        );
                    }

                    // Add a small delay to ensure cookie is set
                    setTimeout(() => {
                        if (data.isAdmin) {
                            window.location.href = "/admin";
                        } else {
                            window.location.href = "/contents";
                        }
                    }, 100);
                } else {
                    setWarning("Login failed. Please try again.");
                    setIsLoading(false);
                }
                // Don't set loading to false here since we're redirecting
            })
            .catch((error) => {
                console.error("Error:", error);
                setWarning(
                    "An error occurred while logging in. Please try again."
                ); // Use warning instead of alert
                setIsLoading(false); // Stop loading on error
            });
    }
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex items-center min-h-screen bg-gray-100 w-full">
            <Image
                src="/Background2.png"
                width={1920}
                height={1080}
                alt="Bus moving on a road, giving signals to wifi sensors and GPS location"
                className="hidden md:block h-screen object-cover"
            />
            <div className="flex flex-col justify-start bg-gradient-to-br from-purple-900 via-blue-950 to-gray-900 px-4 sm:px-8 py-8 w-full min-h-screen">
                <Link
                    href="/"
                    className="text-white inline-block w-fit ml-4 sm:ml-10 mb-4 sm:my-8"
                >
                    <IoArrowBackCircleOutline className="text-4xl sm:text-5xl" />
                </Link>
                <div className="w-full p-4 sm:p-10 text-white">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:my-4">
                        Login
                    </h1>
                    <form
                        className="flex flex-col items-center w-full"
                        onSubmit={handleLogin}
                    >
                        <div className="flex flex-col items-start w-full my-2 md:my-3">
                            <label htmlFor="email" className="mb-1">
                                Email
                            </label>
                            <input
                                type={email === "admin" ? "text" : "email"}
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                name="email"
                                placeholder="example@mail.com"
                                className="border-blue-600 border-2 rounded-lg py-2 px-4 text-base w-full bg-gray-100 placeholder-gray-500 text-black"
                                disabled={isLoading} // Disable input while loading
                            />
                        </div>
                        <div className="flex flex-col items-start w-full my-2 md:my-3">
                            <label htmlFor="password" className="mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="password"
                                className="border-blue-600 border-2 rounded-lg py-2 px-4 text-base w-full bg-gray-100 placeholder-gray-500 text-black"
                                disabled={isLoading} // Disable input while loading
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading} // Disable button while loading
                            className={`${
                                isLoading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "hover:bg-blue-400 bg-blue-500 cursor-pointer"
                            } text-white py-2 px-4 rounded-lg mt-6 w-full transition-colors flex items-center justify-center`}
                        >
                            {isLoading ? (
                                <>
                                    <p>Logging in...</p>
                                    <div className="ml-1 flex items-center justify-center">
                                        <Loader />
                                    </div>
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>
                        {warning && (
                            <p className="text-red-500 mt-2 text-center">
                                {warning}
                            </p>
                        )}
                        <p className="mt-4">
                            {"Don't have an account?"}
                            <Link
                                href="/signup"
                                className="text-blue-400 hover:underline"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
