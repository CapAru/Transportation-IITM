"use client";
import { useEffect, useState } from "react";
import GPSMap from "@/components/GPSMap";

export default function GPSPage() {
    useEffect(() => {
        document.title = "GPS Data";
        document.description = "Explore GPS data and bus routes.";
    }, []);

    const [mapData, setMapData] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [availableIMEIs, setAvailableIMEIs] = useState([]);

    async function handleDateSubmit() {
        if (!selectedDate) {
            console.error("No date selected");
            return;
        }

        console.log("Fetching data for selected date:", selectedDate);

        try {
            const res = await fetch(`/api/GPS?date=${selectedDate}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                console.error("Failed to fetch GPS data for the selected date");
                return;
            }

            const data = await res.json();
            console.log("Fetched IMEI data:", data);
            setAvailableIMEIs(data.imeis || []);
        } catch (error) {
            console.error("Error fetching GPS data:", error);
        }
    }

    function handleClick(route) {
        return async () => {
            try {
                const data = await fetch(`/api/GPS/${route}?date=${selectedDate}`, {
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
            <div className="flex justify-evenly">
                <GPSMap mapData={mapData} />
                <div className="py-4 px-6 h-[calc(100vh-250px)] w-[300px] overflow-y-auto border border-gray-300 rounded-lg">
                    <form
                        className="mb-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleDateSubmit();
                        }}
                    >
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            className="block w-full p-2 border border-gray-300 rounded-lg mb-3"
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!selectedDate}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Get IMEIs for Date
                        </button>
                    </form>

                    {/* Display available IMEIs */}
                    {availableIMEIs.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-medium mb-2">
                                Available IMEIs ({availableIMEIs.length})
                            </h3>
                            <div className="space-y-2">
                                {availableIMEIs.map((imei) => (
                                    <button
                                        key={imei}
                                        onClick={handleClick(imei)}
                                        className="w-full text-left p-2 bg-gray-100 hover:bg-blue-100 rounded border transition-colors"
                                    >
                                        {imei}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
