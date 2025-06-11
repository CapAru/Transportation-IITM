import React from "react";
import "@aws-amplify/ui-react/styles.css";
import { Loader } from "@aws-amplify/ui-react";

const UserViewElement = ({ user }) => {
    const date = new Date(user.validity);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${day}-${month}-${year}`;

    const [showRemovePopup, setShowRemovePopup] = React.useState(false);
    const [showExtendPopup, setShowExtendPopup] = React.useState(false);
    const [validityDate, setValidityDate] = React.useState("");
    const [isExtendLoading, setIsExtendLoading] = React.useState(false);
    const [isRemoveLoading, setIsRemoveLoading] = React.useState(false);
    const [toast, setToast] = React.useState({
        show: false,
        message: "",
        type: "",
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type: "" });
            if (type === "success") {
                window.location.reload();
            }
        }, 3000);
    };

    const handleExtendValidity = () => {
        setShowExtendPopup(true);
    };

    const handleConfirmExtend = async () => {
        setIsExtendLoading(true);
        try {
            const res = await fetch("/api/extend-validity", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: user.id,
                    validityDateExtended: validityDate,
                }),
            });
            const data = await res.json();
            if (data.error) {
                showToast(data.error, "error");
            } else {
                showToast("Validity extended successfully!");
            }
        } catch (error) {
            console.error("Error extending validity:", error);
            showToast(
                error || "An error occurred while extending validity.",
                "error"
            );
        }
        setIsExtendLoading(false);
        setShowExtendPopup(false);
    };

    const handleRemoveUser = () => {
        setShowRemovePopup(true);
    };

    const handleConfirmRemove = async () => {
        setIsRemoveLoading(true);
        try {
            const res = await fetch("/api/remove-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: user.id }),
            });
            const data = await res.json();
            if (data.error) {
                showToast(data.error, "error");
            } else {
                showToast("User removed successfully!");
            }
        } catch (error) {
            console.error("Error removing user:", error);
            showToast("An error occurred while removing the user.", "error");
        }
        setIsRemoveLoading(false);
        setShowRemovePopup(false);
    };
    return (
        <>
            <style jsx global>{`
                /* Override AWS Amplify styles to preserve Tailwind classes */
                .text-xl {
                    font-size: 1.25rem !important;
                    line-height: 1.75rem !important;
                }
                .text-2xl {
                    font-size: 1.5rem !important;
                    line-height: 2rem !important;
                }
                .text-base {
                    font-size: 1rem !important;
                    line-height: 1.5rem !important;
                }
                .text-sm {
                    font-size: 0.875rem !important;
                    line-height: 1.25rem !important;
                }
                .font-bold {
                    font-weight: 700 !important;
                }
                .font-medium {
                    font-weight: 500 !important;
                }
                .font-semibold {
                    font-weight: 600 !important;
                }

                /* Toast animations */
                @keyframes slideInFromTop {
                    0% {
                        transform: translateX(-50%) translateY(-100%);
                        opacity: 0;
                    }
                    100% {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                }
                @keyframes shrinkProgress {
                    0% {
                        width: 100%;
                    }
                    100% {
                        width: 0%;
                    }
                }
            `}</style>

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
                <div className="flex flex-col w-full sm:flex-grow sm:mr-4 mb-4 sm:mb-0">
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
                    <div className="flex flex-col items-center my-2 sm:my-0 sm:mx-5 w-full sm:w-auto bg-amber-100 px-3 py-1 rounded-lg">
                        <p>Validity</p>
                        <span className="text-blue-900 font-medium">
                            {formattedDate}
                        </span>
                    </div>
                    <button
                        onClick={handleExtendValidity}
                        className="bg-blue-900 py-2 px-4 sm:py-3 sm:px-6 rounded-2xl text-white text-base w-full sm:w-auto hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:outline-none active:ring-2 active:ring-blue-500 cursor-pointer"
                    >
                        Extend Validity
                    </button>
                    <button
                        onClick={handleRemoveUser}
                        className="bg-red-500 py-2 px-4 sm:py-3 sm:px-6 rounded-2xl text-white text-base w-full sm:w-auto mt-2 sm:mt-0 hover:bg-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:outline-none active:ring-2 active:ring-red-400 cursor-pointer"
                    >
                        Remove User
                    </button>
                </div>
            </div>
            {showExtendPopup && (
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
                                disabled={isExtendLoading}
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowExtendPopup(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
                                disabled={isExtendLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmExtend}
                                disabled={isExtendLoading}
                                className={`px-4 py-2 text-white rounded-md transition-colors flex items-center justify-center ${
                                    isExtendLoading
                                        ? "bg-blue-400 cursor-not-allowed"
                                        : "bg-blue-900 hover:bg-blue-700 cursor-pointer"
                                }`}
                            >
                                {isExtendLoading ? (
                                    <>
                                        <span className="mr-2">
                                            Extending...
                                        </span>
                                        <Loader filledColor="blue" />
                                    </>
                                ) : (
                                    "Extend Validity"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showRemovePopup && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            Remove User
                        </h2>
                        <p className="mb-4 text-gray-600">
                            Are you sure you want to remove the user{" "}
                            <span className="font-semibold">{user.name}</span>?
                        </p>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowRemovePopup(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
                                disabled={isRemoveLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmRemove}
                                disabled={isRemoveLoading}
                                className={`px-4 py-2 text-white rounded-md transition-colors flex items-center justify-center ${
                                    isRemoveLoading
                                        ? "bg-red-400 cursor-not-allowed"
                                        : "bg-red-600 hover:bg-red-700 cursor-pointer"
                                }`}
                            >
                                {isRemoveLoading ? (
                                    <>
                                        <span className="mr-2">
                                            Removing...
                                        </span>
                                        <Loader filledColor="red" />
                                    </>
                                ) : (
                                    "Remove User"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserViewElement;
