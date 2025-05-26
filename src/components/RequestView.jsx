import { useEffect, useState } from "react";
import RequestViewElement from "./RequestViewElement";

export default function RequestView() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/pending-users");
                const data = await res.json();
                if (res.ok) {
                    setPendingUsers(data);
                } else {
                    console.error("Failed to fetch pending users:", data.error);
                }
            } catch (error) {
                console.error("Error fetching pending users:", error);
            } finally {
                setLoading(false);
            }
        };

        // Fetch immediately on mount
        fetchData();
    }, []);

    const listOfPendingUsers = pendingUsers.map((user) => (
        <RequestViewElement key={user.id} user={user} />
    ));

    return (
        <div className="flex flex-col items-center w-full py-1 overflow-x-hidden">
            {loading && pendingUsers.length === 0 && (
                <div className="text-center text-gray-500 mt-4">
                    Loading pending requests...
                </div>
            )}

            {!loading && pendingUsers.length === 0 ? (
                <div className="text-center text-gray-500 mt-4">
                    No pending requests at the moment.
                </div>
            ) : (
                listOfPendingUsers
            )}
        </div>
    );
}
