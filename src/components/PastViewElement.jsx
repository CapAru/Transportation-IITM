import React from "react";

function PastViewElement({ user }) {
    const [showRemovePopup, setShowRemovePopup] = React.useState(false);
    const date = new Date(user.expiredOn);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${day}-${month}-${year}`;

    const handleRemoveUser = () => {
        setShowRemovePopup(true);
    }
    const handleConfirmDelete = async () => {
        try {
            const res = await fetch("/api/delete-past-user", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: user.id }),
            })
            const data = await res.json();
            if (data.error) {
                alert(data.error);
            } else {
                alert("User record deleted successfully!");
                window.location.reload();
            }
        }
        catch (error) {
            console.error("Error deleting user record:", error);
            alert("An error occurred while deleting the user record.");
        }
        setShowRemovePopup(false);
    };
    return (
        <>
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
                            <span className="font-semibold">{user.name}</span> from past users?
                        </p>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowRemovePopup(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                            >
                                Delete User Record
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PastViewElement;
