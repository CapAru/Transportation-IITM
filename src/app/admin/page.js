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
        <div className="flex flex-col md:flex-row items-center min-h-screen bg-gray-100 w-full">
            <div className="flex flex-row md:flex-col items-center md:items-start bg-white w-full md:w-1/2 lg:w-1/3 md:h-screen p-2 md:pr-2 md:pl-0 font-bold overflow-x-auto md:overflow-x-visible">
                <button className="bg-transparent text-red-700 text-left text-lg md:text-2xl py-2 md:py-4 px-3 md:px-8 rounded-full md:rounded-none md:rounded-r-full min-w-max md:w-full cursor-pointer hover:bg-red-700 hover:text-white transition-colors flex items-center">
                    <RiLogoutCircleLine className="inline-block mr-1 md:mr-2 text-2xl md:text-3xl" />
                    <p className="whitespace-nowrap">Sign Out</p>
                </button>
                <button
                    className={`${
                        view === "requests"
                            ? "bg-blue-900 text-white"
                            : "bg-transparent"
                    } text-blue-900 text-left text-lg md:text-2xl py-2 md:py-4 px-3 md:px-8 rounded-full md:rounded-none md:rounded-r-full min-w-max md:w-full cursor-pointer hover:bg-blue-900 hover:text-white transition-colors mx-2 md:mx-0 md:mt-2`}
                    onClick={handleView("requests")}
                >
                    <span className="whitespace-nowrap">View Requests</span>
                </button>
                <button
                    className={`${
                        view === "users"
                            ? "bg-blue-900 text-white"
                            : "bg-transparent"
                    } text-blue-900 text-left text-lg md:text-2xl py-2 md:py-4 px-3 md:px-8 rounded-full md:rounded-none md:rounded-r-full min-w-max md:w-full cursor-pointer hover:bg-blue-900 hover:text-white transition-colors mx-2 md:mx-0 md:mt-2`}
                    onClick={handleView("users")}
                >
                    <span className="whitespace-nowrap">View Users</span>
                </button>
            </div>
            <div className="bg-white w-full md:h-screen px-2 md:px-1 overflow-y-auto">
                {view === "requests" ? <RequestView /> : <UserView />}
            </div>
        </div>
    );
}
