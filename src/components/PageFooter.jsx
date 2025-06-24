import Link from "next/link";
import { usePathname } from "next/navigation";
export default function PageFooter() {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";
    const isSignupPage = pathname === "/signup";
    const isAdminPage = pathname.startsWith("/admin");
    const isContentsPage = pathname.startsWith("/contents");
    if (isLoginPage || isSignupPage || isAdminPage || isContentsPage) {
        return null; // Don't render footer on login, signup, or admin pages
    }
    return (
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 mt-auto border-t border-gray-700">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                    {/* Logo and Institution */}
                    <div className="flex flex-col items-center md:items-start space-y-3">
                        <div className="flex items-center space-x-3">
                            <a
                                href="https://www.iitm.ac.in/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src="/IIT_Madras_Logo.svg"
                                    alt="IIT Madras Logo"
                                    className="w-12 h-12 object-contain"
                                />
                            </a>
                            <div className="text-left">
                                <h3 className="text-lg font-semibold text-white">
                                    IIT Madras
                                </h3>
                                <a href="https://civil.iitm.ac.in/tran/">
                                    <p className="text-sm text-gray-300">
                                        Department of Transportation Engineering
                                    </p>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Copyright and Links */}
                    <div className="flex flex-col items-center md:items-end space-y-2">
                        <div className="text-sm text-gray-300">
                            &copy; {new Date().getFullYear()} Indian Institute
                            of Technology Madras
                        </div>
                        <div className="text-xs text-gray-400">
                            All rights reserved
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
