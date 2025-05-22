import React from "react";

const RequestViewElement = (props) => {
    const popUp = (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Request Details</h2>
                <p>Details about the request...</p>
                <button
                    onClick={() => setPopUp(false)}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    )
    function handleAccept() {
        // Handle the accept request logic here
        
        alert("Request accepted");
    }
    function handleReject() {
        // Handle the reject request logic here
        alert("Request rejected");
    }
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center w-full py-4 px-4 sm:px-8 m-1 bg-amber-200 rounded-3xl hover:bg-amber-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
            <div className="flex flex-col w-full sm:flex-grow sm:mr-8 mb-4 sm:mb-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <h2 className="text-xl font-bold transition-colors duration-300">
                        Arunava Chakrabarty
                    </h2>
                    <p className="text-md mt-1 sm:mt-0 hover:text-blue-700 transition-colors cursor-pointer">
                        chakrabartyarunava19@gmail.com
                    </p>
                </div>
                <p className="text-md mt-2">
                    Indian Institute of Engineering Science and Technology,
                    Shibpur
                </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 whitespace-nowrap w-full sm:w-auto">
                <button onClick={handleAccept} className="bg-green-700 py-2 px-4 sm:py-3 sm:px-6 rounded-2xl text-white text-md w-full sm:w-auto hover:bg-green-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:outline-none active:ring-2 active:ring-green-500 cursor-pointer">
                    Accept Request
                </button>
                <button onClick={handleReject} className="bg-red-500 py-2 px-4 sm:py-3 sm:px-6 rounded-2xl text-white text-md w-full sm:w-auto mt-2 sm:mt-0 hover:bg-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:outline-none active:ring-2 active:ring-red-400 cursor-pointer">
                    Reject Request
                </button>
            </div>
        </div>
    );
};

export default RequestViewElement;
