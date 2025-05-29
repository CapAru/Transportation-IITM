"use client";
import React from "react";
import Link from "next/link";

import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [path, setPath] = useState("/");
    const router = useRouter();
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
                    setPath(data.user.isAdmin ? "/admin" : "/user/dashboard");
                }
            }
        }

        fetchUserData();
    }, []);

    useEffect(() => {
        if (loggedIn) {
            router.push(path);
        }
    }, [loggedIn]);

    function handleSignup(event) {
        event.preventDefault();
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
                    alert(data.error);
                } else {
                    alert(
                        "Account request created successfully! Please wait for approval."
                    );
                    window.location.href = "/login";
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred while creating the account.");
            });
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
                            />
                        </div>
                        {/* <div className="flex flex-col md:flex-row items-start w-full my-3">
                            <div className="flex flex-col items-start w-full my-2 md:my-3 md:mr-2">
                                <label htmlFor="password" className="mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="password"
                                    className="border-blue-600 border-2 rounded-lg py-2 px-4 text-base w-full bg-gray-100 placeholder-gray-500 text-black"
                                    name="password"
                                    required
                                />
                            </div>
                            <div className="flex flex-col items-start w-full my-2 md:my-3 md:ml-2">
                                <label htmlFor="cnfpassword" className="mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="cnfpassword"
                                    placeholder="password"
                                    className="border-blue-600 border-2 rounded-lg py-2 px-4 text-base w-full bg-gray-100 placeholder-gray-500 text-black"
                                    name="cnfpassword"
                                    required
                                />
                            </div>
                        </div> */}
                        <button
                            type="submit"
                            className="hover:bg-blue-400 text-white py-2 px-4 rounded-lg mt-6 w-full cursor-pointer bg-blue-500 transition-colors"
                        >
                            Create Account
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
            <img src="/Background.png" className="hidden md:block h-screen" />
        </div>
    );
}
