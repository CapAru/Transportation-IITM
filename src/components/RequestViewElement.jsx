import React, { useState } from "react";
import "@aws-amplify/ui-react/styles.css";
import { Loader } from "@aws-amplify/ui-react";

const RequestViewElement = ({ user }) => {
    const [showAcceptPopup, setShowAcceptPopup] = useState(false);
    const [showRejectPopup, setShowRejectPopup] = useState(false);
    const [isAcceptLoading, setIsAcceptLoading] = useState(false);
    const [isRejectLoading, setIsRejectLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type: "" });
            if (type === "success") {
                window.location.reload();
            }
        }, 3000);
    };

    function handleAcceptClick() {
        setShowAcceptPopup(true);
    }

    async function handleFinalAccept() {
        setIsAcceptLoading(true);
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        try {
            const res = await fetch("/api/accept-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: user.id,
                    userTimeZone: userTimeZone,
                }),
            });
            if (res.error) {
                throw new Error(res.error || "Failed to accept request");
            }
            showToast("Request accepted successfully!");
        } catch (error) {
            console.error("Error accepting request:", error);
            showToast(
                error || "An error occurred while accepting the request.",
                "error"
            );
        }
        setIsAcceptLoading(false);
        setShowAcceptPopup(false);
    }

    function handleReject() {
        setShowRejectPopup(true);
    }

    async function handleFinalReject() {
        setIsRejectLoading(true);
        try {
            const res = await fetch("/api/reject-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: user.id }),
            });
            if (res.error) {
                throw new Error(res.error || "Failed to reject request");
            }

            showToast("Request rejected successfully!");
        } catch (error) {
            console.error("Error rejecting request:", error);
            showToast(
                "An error occurred while rejecting the request.",
                "error"
            );
        }
        setIsRejectLoading(false);
        setShowRejectPopup(false);
    }

    return (
        <>
            {/* Toast Notification */}
            {toast.show && (
                <div
                    className={`fixed top-4 left-1/2 z-50 rounded-lg shadow-lg text-white font-medium overflow-hidden ${
                        toast.type === "error" ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{
                        transform: "translateX(-50%)",
                        animation: "slideInFromTop 0.5s ease-out",
                    }}
                >
                    <div className="px-6 py-3">{toast.message}</div>
                    {/* Loading bar */}
                    <div
                        className={`w-full h-1 ${
                            toast.type === "error"
                                ? "bg-red-600"
                                : "bg-green-600"
                        } bg-opacity-20`}
                    >
                        <div
                            className={`h-full ${
                                toast.type === "error"
                                    ? "bg-red-400"
                                    : "bg-green-400"
                            }  bg-opacity-80`}
                            style={{
                                width: "100%",
                                animation: "shrinkProgress 3s linear",
                            }}
                        />
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center w-full py-4 px-4 sm:px-8 m-1 bg-amber-200 rounded-3xl hover:bg-amber-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <div className="flex flex-col w-full sm:flex-grow sm:mr-8 mb-4 sm:mb-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <h2 className="text-xl font-bold transition-colors duration-300">
                            {user.name}
                        </h2>
                        <p className="text-base mt-1 sm:mt-0 hover:text-blue-700 transition-colors cursor-pointer">
                            {user.email}
                        </p>
                    </div>
                    <p className="text-base mt-2">{user.college}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 whitespace-nowrap w-full sm:w-auto">
                    <button
                        onClick={handleAcceptClick}
                        className="bg-green-700 py-2 px-4 sm:py-3 sm:px-6 rounded-2xl text-white text-base w-full sm:w-auto hover:bg-green-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:outline-none active:ring-2 active:ring-green-500 cursor-pointer"
                    >
                        Accept Request
                    </button>
                    <button
                        onClick={handleReject}
                        className="bg-red-500 py-2 px-4 sm:py-3 sm:px-6 rounded-2xl text-white text-base w-full sm:w-auto mt-2 sm:mt-0 hover:bg-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:outline-none active:ring-2 active:ring-red-400 cursor-pointer"
                    >
                        Reject Request
                    </button>
                </div>
            </div>

            {/* Accept Request Confirmation Popup */}
            {showAcceptPopup && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            Accept Request
                        </h2>
                        <p className="mb-4 text-gray-600">
                            Are you sure you want to accept the request from{" "}
                            <span className="font-semibold">{user.name}</span>?
                        </p>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowAcceptPopup(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
                                disabled={isAcceptLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFinalAccept}
                                disabled={isAcceptLoading}
                                className={`px-4 py-2 text-white rounded-md transition-colors flex items-center justify-center ${
                                    isAcceptLoading
                                        ? "bg-green-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700 cursor-pointer"
                                }`}
                            >
                                {isAcceptLoading ? (
                                    <>
                                        <span className="mr-2">
                                            Accepting...
                                        </span>
                                        <Loader filledColor="green" />
                                    </>
                                ) : (
                                    "Accept Request"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/*Reject Request Confirmation Popup*/}
            {showRejectPopup && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            Reject Request
                        </h2>
                        <p className="mb-4 text-gray-600">
                            Are you sure you want to reject the request from{" "}
                            <span className="font-semibold">{user.name}</span>?
                        </p>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowRejectPopup(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
                                disabled={isRejectLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFinalReject}
                                disabled={isRejectLoading}
                                className={`px-4 py-2 text-white rounded-md transition-colors flex items-center justify-center ${
                                    isRejectLoading
                                        ? "bg-red-400 cursor-not-allowed"
                                        : "bg-red-600 hover:bg-red-700 cursor-pointer"
                                }`}
                            >
                                {isRejectLoading ? (
                                    <>
                                        <span className="mr-2">
                                            Rejecting...
                                        </span>
                                        <Loader filledColor="red" />
                                    </>
                                ) : (
                                    "Reject Request"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RequestViewElement;
