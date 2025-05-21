import React from "react";
import Link from "next/link";

export default function Signup() {
    return (
        <div className="flex items-center min-h-screen bg-gray-100 w-full">
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-950 to-gray-900 px-8 py-8 w-full min-h-screen">
                <div className="w-full p-10 text-white">
                    <h1 className="text-5xl my-4">Sign Up</h1>
                    <form className="flex flex-col items-center w-full">
                        <div className="flex flex-col items-start w-full my-3">
                            <label htmlFor="email" className="mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="example@mail.com"
                                className="border-blue-600 border-2 rounded-lg py-2 px-4 text-md w-full bg-gray-100 placeholder-gray-500"
                            />
                        </div>
                        <div className="flex flex-col items-start w-full my-3">
                            <label htmlFor="name" className="mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Abc Xyz"
                                className="border-blue-600 border-2 rounded-lg py-2 px-4 text-md w-full bg-gray-100 placeholder-gray-500"
                            />
                        </div>
                        <div className="flex flex-col items-start w-full my-3">
                            <label htmlFor="collegeName" className="mb-1">
                                College Name
                            </label>
                            <input
                                type="text"
                                id="collegeName"
                                placeholder="IIT Madras"
                                className="border-blue-600 border-2 rounded-lg py-2 px-4 text-md w-full bg-gray-100 placeholder-gray-500"
                            />
                        </div>
                        <div className="flex flex-col items-start w-full my-3">
                            <label htmlFor="password" className="mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="password"
                                className="border-blue-600 border-2 rounded-lg py-2 px-4 text-md w-full bg-gray-100 placeholder-gray-500"
                            />
                        </div>
                        <div className="flex flex-col items-start w-full my-3">
                            <label htmlFor="cnfpassword" className="mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="cnfpassword"
                                placeholder="password"
                                className="border-blue-600 border-2 rounded-lg py-2 px-4 text-md w-full bg-gray-100 placeholder-gray-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-400 text-white py-2 px-4 rounded-lg mt-6 w-full"
                        >
                            Login
                        </button>
                        <p className="mt-4">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-400">
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
            <img src="/Background.png" className="h-screen" />
        </div>
    );
}
