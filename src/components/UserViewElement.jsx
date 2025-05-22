import React from "react";

const UserViewElement = (props) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center w-full py-4 px-4 sm:px-8 m-1 bg-amber-200 rounded-3xl hover:bg-amber-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
            <div className="flex flex-col w-full sm:flex-grow sm:mr-4 mb-4 sm:mb-0">
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
                <div className="flex flex-col items-center my-2 sm:my-0 sm:mx-5 w-full sm:w-auto bg-amber-100 px-3 py-1 rounded-lg">
                    <p>Validity</p>
                    <span className="text-blue-900 font-medium">
                        18/07/2025
                    </span>
                </div>
                <button className="bg-blue-900 py-2 px-4 sm:py-3 sm:px-6 rounded-2xl text-white text-md w-full sm:w-auto hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:outline-none active:ring-2 active:ring-blue-500 cursor-pointer">
                    Extend Validity
                </button>
                <button className="bg-red-500 py-2 px-4 sm:py-3 sm:px-6 rounded-2xl text-white text-md w-full sm:w-auto mt-2 sm:mt-0 hover:bg-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:outline-none active:ring-2 active:ring-red-400 cursor-pointer">
                    Remove User
                </button>
            </div>
        </div>
    );
};

export default UserViewElement;
