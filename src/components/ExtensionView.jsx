import React, { useEffect, useState } from 'react'
import ExtensionViewElement from './ExtensionViewElement';

export default function ExtensionView() {
    const [extensionData, setExtensionData] = useState([]);

    useEffect(() => {
        async function fetchExtensionRequests() {
            try {
                const res = await fetch('/api/user/extension', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (res.error) {
                    throw new Error(`Failed to fetch extension requests: ${res.error}`);
                }
                const data = await res.json();
                setExtensionData(data);
            } catch (error) {
                console.error('Error fetching extension requests:', error);
            }
        }

        fetchExtensionRequests();
    }, [])
    const listOfExtensionRequests = extensionData.length > 0 ? extensionData.map((user) => (
        <ExtensionViewElement key={user.id} user={user} />
    )) : [];
    return (
        <div className="flex flex-col items-center w-full py-1 overflow-x-hidden">
            {listOfExtensionRequests.length === 0 ? (
                <div className="text-center text-gray-500 mt-4">
                    No extension requests at the moment.
                    </div>
                    ) : (
                listOfExtensionRequests
            )}
        </div>
    );
}