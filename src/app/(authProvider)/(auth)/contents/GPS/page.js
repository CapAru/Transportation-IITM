"use client";
import { useEffect, useState } from "react";
import GPSMap from "@/components/GPSMap";
import { Loader } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
export default function GPSPage() {
    useEffect(() => {
        document.title = "GPS Data";
        document.description = "Explore GPS data and bus routes.";
    }, []);

    const [mapData, setMapData] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [availableIMEIs, setAvailableIMEIs] = useState([]);
    const [selectedIMEI, setSelectedIMEI] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [isLoadingIMEIs, setIsLoadingIMEIs] = useState(false);
    const [showDirections, setShowDirections] = useState(true);

    async function handleDateSubmit() {
        if (!selectedDate) {
            console.error("No date selected");
            return;
        }

        console.log("Fetching data for selected date:", selectedDate);
        setIsLoadingIMEIs(true);

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
        } finally {
            setIsLoadingIMEIs(false);
        }
    }

    function handleClick(route) {
        return async () => {
            try {
                setSelectedIMEI(route);
                const data = await fetch(
                    `/api/GPS/${route}?date=${selectedDate}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
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

    async function handleDownloadCSV() {
        if (!selectedIMEI || !selectedDate) {
            alert("Please select a date and IMEI first");
            return;
        }

        setIsDownloading(true);
        try {
            const response = await fetch(
                `/api/GPS/${selectedIMEI}?date=${selectedDate}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch data for CSV download");
            }

            const data = await response.json();

            // Convert JSON to CSV
            const csvContent = convertToCSV(data);

            // Create and download the file
            const blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;",
            });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute(
                "download",
                `GPS_${selectedIMEI}_${selectedDate}.csv`
            );
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading CSV:", error);
            alert("Failed to download CSV file");
        } finally {
            setIsDownloading(false);
        }
    }

    function convertToCSV(data) {
        if (!data || data.length === 0) return "";

        const headers = Object.keys(data[0]);
        const csvHeaders = headers.join(",");

        const csvRows = data.map((row) => {
            return headers
                .map((header) => {
                    let value = row[header];

                    // Format time and date values
                    if (
                        header.toLowerCase().includes("time") &&
                        value &&
                        typeof value === "string"
                    ) {
                        // Extract time part from ISO string (e.g., "1970-01-01T00:00:02.000Z" -> "00:00:02")
                        const timeMatch = value.match(/T(\d{2}:\d{2}:\d{2})/);
                        if (timeMatch) {
                            value = timeMatch[1];
                        }
                    } else if (
                        header.toLowerCase().includes("date") &&
                        value &&
                        typeof value === "string"
                    ) {
                        // Extract date part from ISO string (e.g., "2025-05-08T00:00:00.000Z" -> "2025-05-08")
                        const dateMatch = value.match(/(\d{4}-\d{2}-\d{2})/);
                        if (dateMatch) {
                            value = dateMatch[1];
                        }
                    }

                    // Handle values that might contain commas or quotes
                    if (
                        typeof value === "string" &&
                        (value.includes(",") || value.includes('"'))
                    ) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                })
                .join(",");
        });

        return [csvHeaders, ...csvRows].join("\n");
    }

    return (
        <div className="px-6">
            <h1 className="text-3xl font-bold mb-6">
                Global Positioning System (GPS) Data
            </h1>
            <div className="flex justify-evenly space-x-4">
                <div className="flex flex-col">
                    <GPSMap mapData={mapData} showDirections={showDirections} />

                    {/* Direction Toggle Button */}
                    <div className="mt-2 flex justify-center">
                        <button
                            onClick={() => setShowDirections(!showDirections)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                showDirections
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            {showDirections
                                ? "Hide Directions"
                                : "Show Directions"}
                        </button>
                    </div>
                </div>
                <div className="py-4 flex-grow px-6 h-[calc(100vh-250px)] border border-gray-300 rounded-lg bg-white flex flex-col">
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
                            className="block w-full p-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!selectedDate || isLoadingIMEIs}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center hover:cursor-pointer"
                        >
                            {isLoadingIMEIs ? (
                                <>
                                    <span className="mr-2">
                                        Loading IMEIs...
                                    </span>
                                    <Loader size="small" className="mr-2" />
                                </>
                            ) : (
                                "Get IMEIs for Date"
                            )}
                        </button>
                    </form>

                    {/* Download Button */}
                    {selectedIMEI && (
                        <div className="mb-4">
                            <button
                                onClick={handleDownloadCSV}
                                disabled={isDownloading}
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center hover:cursor-pointer"
                            >
                                {isDownloading ? (
                                    <>
                                        <span className="mr-2">
                                            Downloading...
                                        </span>
                                        <Loader size="small" className="mr-2" />
                                    </>
                                ) : (
                                    "Download CSV"
                                )}
                            </button>
                        </div>
                    )}

                    {/* Display available IMEIs */}
                    {availableIMEIs.length > 0 && (
                        <div className="mt-4 flex-1 flex flex-col min-h-0">
                            <h3 className="text-lg font-medium mb-2">
                                Available IMEIs ({availableIMEIs.length})
                            </h3>
                            <div className="flex flex-col space-y-2 overflow-y-auto flex-1 p-2 rounded">
                                {availableIMEIs.map((imei) => (
                                    <button
                                        key={imei}
                                        onClick={handleClick(imei)}
                                        className={`text-left p-2 rounded border transition-colors ${
                                            selectedIMEI === imei
                                                ? "bg-blue-100 border-blue-300 text-blue-800"
                                                : "bg-gray-100 border-gray-200 hover:bg-blue-50"
                                        }`}
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
