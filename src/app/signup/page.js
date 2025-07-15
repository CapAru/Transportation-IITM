"use client";
import React from "react";
import Link from "next/link";
import { Loader } from "@aws-amplify/ui-react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@aws-amplify/ui-react/styles.css";
import Image from "next/image";

export default function Signup() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [path, setPath] = useState("/");
    const [isLoading, setIsLoading] = useState(false);
    const [warning, setWarning] = useState("");
    const [success, setSuccess] = useState("");
    const [isCompleted, setIsCompleted] = useState(false); // Add completion state
    const router = useRouter();
    const [loading, setLoading] = useState(true); // Add loading state for the form
    useEffect(() => {
        async function fetchUserData() {
            const res = await fetch("/api/user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                const data = await res.json();
                if (data.user) {
                    setLoggedIn(true);
                    setPath(data.user.isAdmin ? "/admin" : "/contents");
                }
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

    function handleSignup(event) {
        event.preventDefault();
        setIsLoading(true);
        setWarning("");
        setSuccess("");

        const formData = new FormData(event.target);
        const email = formData.get("email");
        const name = formData.get("name");
        const college = formData.get("collegeName");

        const res = fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                name,
                college,
            }),
        });
        res.then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data);
                    setWarning(data.error);
                    setIsLoading(false);
                } else {
                    setSuccess(
                        "Account request created successfully! Please wait for approval. Redirecting to login..."
                    );
                    setIsCompleted(true);
                    setIsLoading(false);
                    // Navigate to login after showing success message
                    setTimeout(() => {
                        router.push("/login");
                    }, 3000);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setWarning("An error occurred while creating the account.");
                setIsLoading(false);
            });
    }

    // Show loading state while fetching user data
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }


    return (
        <div className="flex items-center min-h-screen w-full">
            <div className="flex flex-col items-start justify-start bg-gradient-to-br from-purple-900 via-blue-950 to-gray-900 px-4 sm:px-8 py-8 w-full min-h-screen">
                <Link
                    href="/"
                    className="text-white inline-block w-fit ml-4 sm:ml-10 mb-4 mt-4 sm:my-8"
                >
                    <IoArrowBackCircleOutline className="text-4xl sm:text-5xl" />
                </Link>
                <div className="w-full p-4 sm:p-10 text-white">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl mb-4">
                        Sign Up
                    </h1>

                    {/* Warning message display */}
                    {warning && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            <span className="block sm:inline">{warning}</span>
                        </div>
                    )}

                    {/* Success message display */}
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            <span className="block sm:inline">{success}</span>
                        </div>
                    )}

                    <form
                        className="flex flex-col items-center w-full"
                        onSubmit={handleSignup}
                    >
                        <div className="flex flex-col md:flex-row items-start w-full my-3">
                            <div className="flex flex-col items-start w-full my-2 md:my-3 md:mr-2">
                                <label htmlFor="email" className="mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="example@mail.com"
                                    className="border-blue-600 border-2 rounded-lg py-2 px-4 text-base w-full bg-gray-100 placeholder-gray-500 text-black"
                                    name="email"
                                    required
                                    disabled={isLoading} // Disable input while loading
                                />
                            </div>
                            <div className="flex flex-col items-start w-full my-2 md:my-3 md:ml-2">
                                <label htmlFor="name" className="mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Abc Xyz"
                                    className="border-blue-600 border-2 rounded-lg py-2 px-4 text-base w-full bg-gray-100 placeholder-gray-500 text-black"
                                    name="name"
                                    required
                                    disabled={isLoading} // Disable input while loading
                                />
                            </div>
                        </div>
                        <div className="flex flex-col items-start w-full my-2 md:my-3">
                            <label htmlFor="collegeName" className="mb-1">
                                College Name
                            </label>
                            <input
                                type="text"
                                id="collegeName"
                                placeholder="Indian Institute of Technology, Madras"
                                className="border-blue-600 border-2 rounded-lg py-2 px-4 text-base w-full bg-gray-100 placeholder-gray-500 text-black"
                                name="collegeName"
                                required
                                disabled={isLoading} // Disable input while loading
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || isCompleted} // Disable button while loading or completed
                            className={`${
                                isLoading || isCompleted
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "hover:bg-blue-400 bg-blue-500 cursor-pointer"
                            } text-white py-2 px-4 rounded-lg mt-6 w-full transition-colors flex items-center justify-center`}
                        >
                            {isLoading ? (
                                <>
                                    <p>Submitting Request...</p>
                                    <div className="ml-1 flex items-center justify-center">
                                        <Loader />
                                    </div>
                                </>
                            ) : isCompleted ? (
                                "Request Submitted Successfully"
                            ) : (
                                "Create Account"
                            )}
                        </button>
                        <p className="mt-4">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-blue-400 hover:underline"
                            >
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
            <Image
                src="/Background.png"
                width={1920}
                height={1080}
                alt="Bus moving on a road, giving signals to wifi sensors and GPS location"
                className="hidden md:block h-screen"
            />
        </div>
    );
}
