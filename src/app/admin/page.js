"use client";
import { RiLogoutCircleLine } from "react-icons/ri";
import RequestView from "@/components/RequestView";
import UserView from "@/components/UserView";
import { useState } from "react";

export default function Admin() {
    const [view, setView] = useState("requests");

    const handleView = (viewType) => {
        return () => {
            setView(viewType);
        };
    };

    return (
        <div className="flex items-center min-h-screen bg-gray-100 w-full">
            <div className="flex flex-col items-start bg-white h-screen w-1/2 lg:w-1/3 pr-2 font-bold py-3">
                <button className="bg-transparent text-red-700 text-left text-2xl py-4 px-8 rounded-r-full w-full cursor-pointer hover:bg-red-700 hover:text-white transition-colors flex items-center">
                    <RiLogoutCircleLine className="inline-block mr-2 text-3xl" />
                    <p>Sign Out</p>
                </button>
                <button
                    className={`${
                        view === "requests"
                            ? "bg-blue-900 text-white"
                            : "bg-transparent"
                    } text-blue-900 text-left text-2xl py-4 px-8 rounded-r-full w-full cursor-pointer hover:bg-blue-900 hover:text-white transition-colors `}
                    onClick={handleView("requests")}
                >
                    View Requests
                </button>
                <button
                    className={`${
                        view === "users" ? "bg-blue-900 text-white" : "bg-transparent"
                    } text-blue-900 text-left text-2xl py-4 px-8 rounded-r-full w-full cursor-pointer hover:bg-blue-900 hover:text-white transition-colors`}
                    onClick={handleView("users")}
                >
                    View Users
                </button>
            </div>
            <div className="bg-white h-screen w-full">
                {view === "requests" ? <RequestView /> : <UserView />}
            </div>
        </div>
    );
}
