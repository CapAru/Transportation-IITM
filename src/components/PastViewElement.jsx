import React from "react";
import "@aws-amplify/ui-react/styles.css";
import { Loader } from "@aws-amplify/ui-react";

function PastViewElement({ user }) {
    const [showRemovePopup, setShowRemovePopup] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [toast, setToast] = React.useState({
        show: false,
        message: "",
        type: "",
    });

    const date = new Date(user.expiredOn);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${day}-${month}-${year}`;

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type: "" });
            if (type === "success") {
                window.location.reload();
            }
        }, 3000);
    };

    const handleRemoveUser = () => {
        setShowRemovePopup(true);
    };
    const handleConfirmDelete = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/delete-past-user", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: user.id }),
            });
            const data = await res.json();
            if (data.error) {
                showToast(data.error, "error");
            } else {
                showToast("User record deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting user record:", error);
            showToast(
                "An error occurred while deleting the user record.",
                "error"
            );
        }
        setIsLoading(false);
        setShowRemovePopup(false);
    };
    return (
        <>
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
                        <p>Expired On</p>
                        <span className="text-blue-900 font-medium">
                            {formattedDate}
                        </span>
                    </div>
                    <button
                        onClick={handleRemoveUser}
                        className="bg-red-500 py-2 px-4 sm:py-3 sm:px-6 rounded-2xl text-white text-base w-full sm:w-auto mt-2 sm:mt-0 hover:bg-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:outline-none active:ring-2 active:ring-red-400 cursor-pointer"
                    >
                        Delete User Record
                    </button>
                </div>
            </div>
            {showRemovePopup && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            Delete User Record
                        </h2>
                        <p className="mb-4 text-gray-600">
                            Are you sure you want to delete the user{" "}
                            <span className="font-semibold">{user.name}</span>{" "}
                            from past users?
                        </p>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowRemovePopup(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isLoading}
                                className={`px-4 py-2 text-white rounded-md transition-colors flex items-center justify-center ${
                                    isLoading
                                        ? "bg-red-400 cursor-not-allowed"
                                        : "bg-red-600 hover:bg-red-700 cursor-pointer"
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="mr-2">
                                            Deleting...
                                        </span>
                                        <Loader filledColor="red" />
                                    </>
                                ) : (
                                    "Delete User Record"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PastViewElement;
