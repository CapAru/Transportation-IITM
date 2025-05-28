"use client";
import Link from "next/link";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [warning, setWarning] = useState("");
    function handleLogin(event) {
        event.preventDefault();
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
        });
        res
            .then((response) => response.json())
            .then((data) => {
                if (data.validity && data.validity < new Date()) {
                    setWarning("Your account has expired. Please contact support.");
                    return;
                }

                if (data.error) {
                    alert(data.error);
                }
                else if (data.isAdmin) {
                    window.location.href = "/admin";
                }
                else {
                    window.location.href = "/user/dashboard";
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred while logging in.");
            });
    }
    return (
        <div className="flex items-center min-h-screen bg-gray-100 w-full">
            <img src="/Background2.png" className="hidden md:block h-screen" />
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
                    <form className="flex flex-col items-center w-full" onSubmit={handleLogin}>
                        <div className="flex flex-col items-start w-full my-2 md:my-3">
                            <label htmlFor="email" className="mb-1">
                                Email
                            </label>
                            <input
                                type={email === "admin"? "text" : "email"}
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                name="email"
                                placeholder="example@mail.com"
                                className="border-blue-600 border-2 rounded-lg py-2 px-4 text-md w-full bg-gray-100 placeholder-gray-500 text-black"
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
                                className="border-blue-600 border-2 rounded-lg py-2 px-4 text-md w-full bg-gray-100 placeholder-gray-500 text-black"
                            />
                        </div>
                        <button
                            type="submit"
                            className="hover:bg-blue-400 text-white py-2 px-4 rounded-lg mt-6 w-full cursor-pointer bg-blue-500 transition-colors"
                        >
                            Login
                        </button>
                        {warning && (
                            <p className="text-red-500 mt-2">
                                {warning}
                            </p>
                        )}
                        <p className="mt-4">
                            Don't have an account?{" "}
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
