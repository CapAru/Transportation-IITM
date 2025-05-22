import React from "react";

const UserViewElement = (props) => {
    return (
        <div className="flex justify-between items-center w-full py-4 px-8 m-1 bg-amber-200 rounded-3xl">
            <div className="flex flex-col flex-grow mr-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Arunava Chakrabarty</h2>
                    <p className="text-md">chakrabartyarunava19@gmail.com</p>
                </div>
                <p className="text-md">
                    Indian Institute of Engineering Science and Technology,
                    Shibpur
                </p>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
                <div className="flex flex-col items-center mx-5">
                    <p>Validity</p>
                    <span className="text-blue-900 font-bold ">12/12/2023</span>
                </div>
                <button className="bg-blue-900 py-3 px-6 rounded-2xl text-white text-md font-bold">
                    Extend Validity
                </button>
                <button className="bg-red-500 py-3 px-6 rounded-2xl text-white text-md font-bold">
                    Remove User
                </button>
            </div>
        </div>
    );
};

export default UserViewElement;
