"use client";
import Link from "next/link";
import { useState } from "react";
import handleLogout from "@/utils/logout";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosLogOut } from "react-icons/io";

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white text-gray-800 z-50 w-full shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link
                            href="/"
                            className="text-xl font-bold hover:text-blue-600 transition-colors duration-200"
                        >
                            Transportation Database
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4 text-base">
                            <Link
                                href="/"
                                className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors duration-200"
                            >
                                Home
                            </Link>
                            <Link
                                href="/content"
                                className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors duration-200"
                            >
                                Contents
                            </Link>
                            <Link
                                href="/user/dashboard"
                                className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors duration-200"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/user/profile"
                                className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors duration-200"
                            >
                                Profile
                            </Link>
                            <Link
                                href="/login"
                                className="text-red-600 hover:text-gray-100 hover:bg-red-600 px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center"
                                onClick={handleLogout}
                            >
                                Logout
                                <IoIosLogOut className="inline-block ml-2 text-lg" />
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                        >
                            <RxHamburgerMenu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
                    <Link
                        href="/"
                        className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/content"
                        className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Contents
                    </Link>
                    <Link
                        href="/user/dashboard"
                        className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/login"
                        className="text-red-600 hover:text-gray-100 hover:bg-red-600 flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                        onClick={handleLogout}
                    >
                        Logout
                        <IoIosLogOut className="inline-block ml-3 text-lg" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
