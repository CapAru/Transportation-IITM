import { useEffect, useState } from "react";
import UserViewElement from "./UserViewElement";
export default function UserView() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/users");
                const data = await res.json();
                if (res.ok) {
                    setUsers(data);
                } else {
                    console.error("Failed to fetch users:", data.error);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        // Fetch immediately on mount
        fetchData();
    }, [])
    const listOfUsers = users.map((user) => (
        <UserViewElement key={user.id} user={user} />
    ));
    return (
        <div className="flex flex-col items-center w-full py-1 overflow-x-hidden">
            {listOfUsers.length === 0 ? (
                <div className="text-center text-gray-500 mt-4">
                    No users found.
                </div>
            ) : (
                listOfUsers
            )}
        </div>
    );
}
