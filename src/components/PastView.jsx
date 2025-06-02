import { useEffect, useState } from "react";
import PastViewElement from "./PastViewElement";
export default function PastView() {
    const [userData, setUserData] = useState([]);
    useEffect(() => {
        async function fetchPastUsers() {
            try {
                const res = await fetch("/api/past-users", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch past users: ${res.status}`);
                }

                const data = await res.json();
                setUserData(data);
            } catch (error) {
                console.error("Error fetching past users:", error);
            }
        }

        fetchPastUsers();
    }, []);

    const listOfPastUsers = userData.map((user) => (
        <PastViewElement key={user.id} user={user} />
    ));

    return (
        <div className="flex flex-col items-center w-full py-1 overflow-x-hidden">
            {listOfPastUsers.length === 0 ? (
                <div className="text-center text-gray-500 mt-4">
                    No past users found.
                </div>
            ) : (
                listOfPastUsers
            )}
        </div>
    );
}