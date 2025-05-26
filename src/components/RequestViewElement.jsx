import React, { useState } from "react";

const RequestViewElement = ({ user }) => {
    const [showAcceptPopup, setShowAcceptPopup] = useState(false);
    const [showRejectPopup, setShowRejectPopup] = useState(false);
    const [validityDate, setValidityDate] = useState("");

    function handleAcceptClick() {
        setShowAcceptPopup(true);
    }

    function handleFinalAccept() {
        // Validate date input
        if (!validityDate) {
            alert("Please select a validity date");
            return;
        }
        try {
            const res = fetch("/api/accept-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: user.id,
                    validityDate: new Date(validityDate),
                }),
            });
            res.then((response) => response.json()).then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert("Request accepted successfully!");
                    window.location.reload();
                }
            });
        } catch (error) {
            console.error("Error accepting request:", error);
            alert("An error occurred while accepting the request.");
        }

        setShowAcceptPopup(false);
    }

    function handleReject() {
        setShowRejectPopup(true);
    }

    function handleFinalReject() {
        try {
            const res = fetch("/api/reject-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: user.id }),
            });
            res.then((response) => response.json()).then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert("Request rejected successfully!");
                    window.location.reload();
                }
            });
        } catch (error) {
            console.error("Error rejecting request:", error);
            alert("An error occurred while rejecting the request.");
        }

        setShowRejectPopup(false);
    }
    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-center w-full py-4 px-4 sm:px-8 m-1 bg-amber-200 rounded-3xl hover:bg-amber-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <div className="flex flex-col w-full sm:flex-grow sm:mr-8 mb-4 sm:mb-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <h2 className="text-xl font-bold transition-colors duration-300">
                            {user.name}
                        </h2>
                        <p className="text-md mt-1 sm:mt-0 hover:text-blue-700 transition-colors cursor-pointer">
                            {user.email}
                        </p>
                    </div>
                    <p className="text-md mt-2">{user.college}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 whitespace-nowrap w-full sm:w-auto">
                    <button
                        onClick={handleAcceptClick}
                        className="bg-green-700 py-2 px-4 sm:py-3 sm:px-6 rounded-2xl text-white text-md w-full sm:w-auto hover:bg-green-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:outline-none active:ring-2 active:ring-green-500 cursor-pointer"
                    >
                        Accept Request
                    </button>
                    <button
                        onClick={handleReject}
                        className="bg-red-500 py-2 px-4 sm:py-3 sm:px-6 rounded-2xl text-white text-md w-full sm:w-auto mt-2 sm:mt-0 hover:bg-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:outline-none active:ring-2 active:ring-red-400 cursor-pointer"
                    >
                        Reject Request
                    </button>
                </div>
            </div>

            {/* Validity Date Popup */}
            {showAcceptPopup && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            Set Validity Date
                        </h2>
                        <p className="mb-4 text-gray-600">
                            Please select an expiry date for user{" "}
                            <span className="font-semibold">{user.name}</span>'s
                            account:
                        </p>

                        <div className="mb-4">
                            <label
                                htmlFor="validityDate"
                                className="block mb-2 text-sm font-medium text-gray-700"
                            >
                                Validity Until
                            </label>
                            <input
                                type="date"
                                id="validityDate"
                                value={validityDate}
                                onChange={(e) =>
                                    setValidityDate(e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowAcceptPopup(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFinalAccept}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer"
                            >
                                Accept Request
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
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFinalReject}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                            >
                                Reject Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RequestViewElement;
