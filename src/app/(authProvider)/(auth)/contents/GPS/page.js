"use client";
import { useState } from "react";
import GPSMap from "@/components/GPSMap";
import gpsBusRoutes from "@/data/gpsBusRoutes.json"; // Assuming this is the correct path to your JSON file
export default function GPSPage() {
    const [mapData, setMapData] = useState(null);
    
    function handleClick(route) {
        return async () => {
            try {
                const data = await fetch(`/api/GPS/${route}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!data.ok) {
                    console.error("Failed to fetch GPS data");
                    return;
                }
                const fetchedData = await data.json();
                setMapData(fetchedData);
            } catch (error) {
                console.error("Error fetching GPS data:", error);
            }
        };
    }
    return (
        <div className="px-6">
            <h1 className="text-3xl font-bold mb-6">
                Global Positioning System (GPS) Data
            </h1>
            <div className="flex">
                <GPSMap mapData={mapData} />
                <div className="py-4 px-6 h-[calc(100vh-250px)] overflow-y-auto border border-gray-300 rounded-lg">
                    <ul>
                        {gpsBusRoutes.map((route) => (
                            <li key={route} className="my-2">
                                <button onClick={handleClick(route)}>
                                    {route}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
