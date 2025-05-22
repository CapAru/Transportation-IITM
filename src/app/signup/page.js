import React from "react";
import Link from "next/link";

import { IoArrowBackCircleOutline } from "react-icons/io5";

export default function Signup() {
    return (
        <div className="flex items-center min-h-screen bg-gray-100 w-full">
            <div className="flex flex-col items-start justify-center bg-gradient-to-br from-purple-900 via-blue-950 to-gray-900 px-4 sm:px-8 py-8 w-full min-h-screen">
                <Link
                    href="/"
                    className="text-white inline-block w-fit ml-4 sm:ml-10 mt-4"
                >
                    <IoArrowBackCircleOutline className="text-4xl sm:text-5xl" />
                </Link>
                <div className="w-full p-4 sm:p-10 text-white">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl mb-4">
                        Sign Up
                    </h1>
                    <form className="flex flex-col items-center w-full">
                        <div className="flex flex-col md:flex-row items-start w-full my-3">
                            <div className="flex flex-col items-start w-full my-2 md:my-3 md:mr-2">
                                <label htmlFor="email" className="mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="example@mail.com"
                                    className="border-blue-600 border-2 rounded-lg py-2 px-4 text-md w-full bg-gray-100 placeholder-gray-500 text-black"
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
                                    className="border-blue-600 border-2 rounded-lg py-2 px-4 text-md w-full bg-gray-100 placeholder-gray-500 text-black"
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
                                className="border-blue-600 border-2 rounded-lg py-2 px-4 text-md w-full bg-gray-100 placeholder-gray-500 text-black"
                            />
                        </div>
                        <div className="flex flex-col md:flex-row items-start w-full my-3">
                            <div className="flex flex-col items-start w-full my-2 md:my-3 md:mr-2">
                                <label htmlFor="password" className="mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="password"
                                    className="border-blue-600 border-2 rounded-lg py-2 px-4 text-md w-full bg-gray-100 placeholder-gray-500 text-black"
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
                                    className="border-blue-600 border-2 rounded-lg py-2 px-4 text-md w-full bg-gray-100 placeholder-gray-500 text-black"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-400 text-white py-2 px-4 rounded-lg mt-6 w-full cursor-pointer hover:bg-blue-500 transition-colors"
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
