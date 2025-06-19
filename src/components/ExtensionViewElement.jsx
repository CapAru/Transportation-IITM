import React, { useEffect, useState } from "react";
import "@aws-amplify/ui-react/styles.css";
import { Loader } from "@aws-amplify/ui-react";
import { CiCalendar, CiCircleInfo } from "react-icons/ci";

const ExtensionViewElement = ({ user }) => {
    const [showAcceptPopup, setShowAcceptPopup] = useState(false);
    const [showRejectPopup, setShowRejectPopup] = useState(false);
    const [isAcceptLoading, setIsAcceptLoading] = useState(false);
    const [isRejectLoading, setIsRejectLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
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
            const res = await fetch("/api/accept-extension", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: user.email,
                    userTimeZone: userTimeZone,
                }),
            });
            if (res.error) {
                throw new Error(
                    res.error || "Failed to accept extension request"
                );
            }
            showToast("Extension request accepted successfully!");
        } catch (error) {
            console.error("Error accepting extension request:", error);
            showToast(
                error ||
                    "An error occurred while accepting the extension request.",
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
            const res = await fetch("/api/reject-extension", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: user.email }),
            });
            if (res.error) {
                throw new Error(
                    res.error || "Failed to reject extension request"
                );
            }

            showToast("Extension request rejected successfully!");
        } catch (error) {
            console.error("Error rejecting extension request:", error);
            showToast(
                "An error occurred while rejecting the extension request.",
                "error"
            );
        }
        setIsRejectLoading(false);
        setShowRejectPopup(false);
    }

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "Not specified";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (error) {
            return dateString;
        }
    };

    useEffect(() => {
        console.log(showDetails);
    }, [showDetails]);

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
            )}{" "}
            <div className="flex flex-col items-center w-full bg-amber-100 rounded-3xl">
                <div
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full py-4 px-4 sm:px-6 lg:px-8 bg-amber-200 rounded-3xl hover:bg-amber-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    <div className="flex flex-col w-full lg:flex-grow lg:mr-8 mb-4 lg:mb-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start lg:items-center">
                            <h2 className="text-lg sm:text-xl font-bold transition-colors duration-300 text-gray-800 mb-1 sm:mb-0">
                                {user.name}
                            </h2>
                            <p className="text-sm sm:text-base hover:text-blue-700 transition-colors cursor-pointer text-gray-700 break-all sm:break-normal">
                                {user.email}
                            </p>
                        </div>
                        <p className="text-sm sm:text-base mt-2 text-gray-700">
                            {user.college}
                        </p>
                    </div>
                    <div
                        className="flex flex-col sm:flex-row lg:items-center gap-3 sm:gap-2 w-full lg:w-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {" "}
                        <div className="flex flex-col items-center sm:items-center lg:my-0 lg:mx-5 w-full sm:w-48 lg:w-auto bg-amber-100 px-3 py-2 rounded-lg flex-shrink-0">
                            <p className="text-sm sm:text-base font-semibold text-gray-700 text-center whitespace-nowrap">
                                Extension Until
                            </p>
                            <span className="text-blue-900 font-medium text-sm sm:text-base text-center whitespace-nowrap">
                                {formatDate(user.extensionDate)}
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <button
                                onClick={handleAcceptClick}
                                className="bg-green-700 py-2 px-4 lg:py-3 lg:px-6 rounded-2xl text-white text-sm sm:text-base w-full sm:w-auto hover:bg-green-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:outline-none active:ring-2 active:ring-green-500 cursor-pointer whitespace-nowrap"
                            >
                                Accept Request
                            </button>
                            <button
                                onClick={handleReject}
                                className="bg-red-500 py-2 px-4 lg:py-3 lg:px-6 rounded-2xl text-white text-sm sm:text-base w-full sm:w-auto hover:bg-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:outline-none active:ring-2 active:ring-red-400 cursor-pointer whitespace-nowrap"
                            >
                                Reject Request
                            </button>
                        </div>
                    </div>
                </div>
                {/* Extension Details Section - Only show when showDetails is true */}
                <div
                    className={`overflow-hidden w-full transition-all duration-500 ease-in-out ${
                        showDetails
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                    }`}
                >
                    <div
                        className={`w-full px-4 py-4 transform transition-all duration-500 ease-in-out ${
                            showDetails ? "translate-y-0" : "-translate-y-4"
                        }`}
                    >
                        {" "}
                        <div className="flex flex-col lg:flex-row lg:items-center gap-0 p-3 sm:p-4 bg-amber-50 rounded-xl border border-amber-200">
                            {/* Extension Until Section */}
                            <div className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 pb-3 lg:pb-0 lg:pr-6">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center rounded-full">
                                        <CiCalendar className="text-amber-600 text-lg sm:text-xl flex-shrink-0 mb-1" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-semibold text-gray-700">
                                        Extension Until:
                                    </span>
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-amber-800 bg-amber-100 px-2 sm:px-3 py-1 rounded-lg border border-amber-300 ml-6 sm:ml-0">
                                    {formatDate(user.extensionDate)}
                                </span>
                            </div>

                            {/* Vertical Separator */}
                            <div className="hidden lg:block w-px bg-amber-300 mx-4 self-stretch"></div>

                            {/* Horizontal Separator for Mobile/Tablet */}
                            <div className="lg:hidden w-full h-px bg-amber-300 my-2"></div>

                            {/* Reason Section */}
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-start lg:items-center gap-2 pt-3 lg:pt-0 lg:pl-6">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center rounded-full">
                                        <CiCircleInfo className="text-amber-600 mb-1 text-lg sm:text-xl flex-shrink-0" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-semibold text-gray-700 flex-shrink-0">
                                        Reason:
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 ml-6 sm:ml-0 break-words">
                                    {user.reason}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>{" "}
            {/* Accept Request Confirmation Popup */}
            {showAcceptPopup && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
                        <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">
                            Accept Extension Request
                        </h2>
                        <div className="mb-4 text-gray-600">
                            <p className="mb-3 text-sm sm:text-base">
                                Are you sure you want to accept the extension
                                request from{" "}
                                <span className="font-semibold">
                                    {user.name}
                                </span>
                                ?
                            </p>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs sm:text-sm break-words">
                                    <span className="font-medium">
                                        Extension until:
                                    </span>{" "}
                                    {formatDate(user.extensionDate)}
                                </p>
                                {user.reason && (
                                    <p className="text-xs sm:text-sm mt-1 break-words">
                                        <span className="font-medium">
                                            Reason:
                                        </span>{" "}
                                        {user.reason}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={() => setShowAcceptPopup(false)}
                                className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors cursor-pointer text-sm sm:text-base"
                                disabled={isAcceptLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFinalAccept}
                                disabled={isAcceptLoading}
                                className={`w-full sm:w-auto px-4 py-2 text-white rounded-md transition-colors flex items-center justify-center text-sm sm:text-base ${
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
            )}{" "}
            {/*Reject Request Confirmation Popup*/}
            {showRejectPopup && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
                        <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">
                            Reject Extension Request
                        </h2>
                        <div className="mb-4 text-gray-600">
                            <p className="mb-3 text-sm sm:text-base">
                                Are you sure you want to reject the extension
                                request from{" "}
                                <span className="font-semibold">
                                    {user.name}
                                </span>
                                ?
                            </p>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs sm:text-sm break-words">
                                    <span className="font-medium">
                                        Extension until:
                                    </span>{" "}
                                    {formatDate(user.extensionDate)}
                                </p>
                                {user.reason && (
                                    <p className="text-xs sm:text-sm mt-1 break-words">
                                        <span className="font-medium">
                                            Reason:
                                        </span>{" "}
                                        {user.reason}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={() => setShowRejectPopup(false)}
                                className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors cursor-pointer text-sm sm:text-base"
                                disabled={isRejectLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFinalReject}
                                disabled={isRejectLoading}
                                className={`w-full sm:w-auto px-4 py-2 text-white rounded-md transition-colors flex items-center justify-center text-sm sm:text-base ${
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

export default ExtensionViewElement;
