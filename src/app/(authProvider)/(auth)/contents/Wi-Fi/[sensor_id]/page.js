"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "@aws-amplify/ui-react";
import {
    FaWifi,
    FaDatabase,
    FaNetworkWired,
} from "react-icons/fa";
import { TbClockHour4Filled, TbClockHour11Filled } from "react-icons/tb";

export default function SensorDataPage() {
    const { sensor_id } = useParams();
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0] // Format: YYYY-MM-DD
    );
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(false);
    const [found, setFound] = useState(true);
    const [downloading, setDownloading] = useState(false);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 8 }, (_, i) => currentYear - i);

    useEffect(() => {
        document.title = `Wi-Fi Data - ${sensor_id}`;
        document.description = `View and manage sensor data for ${sensor_id}.`;
    }, [sensor_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const date = new Date(selectedDate);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();

            const queryParams = `?year=${year}&month=${month}&day=${day}`;
            const response = await fetch(
                `/api/Wi-Fi/${sensor_id}${queryParams}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            
            if (response.status === 404) {
                setFound(false);
                setMetadata(null);
                setLoading(false);
                return;
            }
            
            if (!response.ok) {
                console.error("Failed to fetch sensor data");
                return;
            }
            
            const fetchedMetadata = await response.json();
            console.log("Fetched metadata:", fetchedMetadata);
            setMetadata(fetchedMetadata);
            if (fetchedMetadata.totalRecords === 0) {
                console.warn("No data found for the selected date");
                setFound(false);
            } else {
                setFound(true);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (e) => {
        e.preventDefault();
        setDownloading(true);
        try {
            // Parse the selected date to get year and month
            const date = new Date(selectedDate);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // JavaScript months are 0-indexed
            const day = date.getDate();

            const response = await fetch(`/api/Wi-Fi/${sensor_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    year: year,
                    month: month,
                    day: day,
                }),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const filename =
                response.headers
                    .get("content-disposition")
                    ?.split("filename=")[1]
                    ?.replace(/"/g, "") || "WiFi_data.csv";
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
        setDownloading(false);
    };

    return (
        <div className="px-4 lg:px-6 w-full">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-gray-300 pb-4 mb-6 gap-4 lg:gap-0">
                <h2 className="text-2xl lg:text-3xl font-bold">
                    Sensor Data - {sensor_id}
                </h2>
                <div className="lg:mr-10 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                    <form
                        className="flex flex-col sm:flex-row lg:flex-row lg:items-center gap-4 lg:gap-6"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col sm:flex-row lg:flex-row lg:items-center gap-2 lg:gap-2">
                            <label
                                htmlFor="date"
                                className="text-lg font-medium text-gray-700"
                            >
                                Select Date:
                            </label>
                            <input
                                type="date"
                                id="date"
                                value={selectedDate}
                                onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                }
                                className="border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 w-full sm:w-auto"
                                max="2022-12-32"
                                min="2019-01-01"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer transition duration-200 w-full sm:w-auto"
                        >
                            {loading ? "Loading..." : "Load Metadata"}
                        </button>
                    </form>{" "}
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="bg-yellow-300 px-6 py-2 rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer transition duration-200 w-full sm:w-auto lg:w-auto flex items-center justify-center"
                    >
                        {downloading ? (
                            <>
                                <span className="mr-2">Downloading...</span>
                                <Loader
                                    filledColor="orange"
                                    emptyColor="black"
                                />
                            </>
                        ) : (
                            "Download CSV"
                        )}
                    </button>
                </div>
            </div>

            {metadata ? (
                <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
                    <div className="flex items-center mb-4">
                        <FaWifi className="text-blue-600 text-2xl mr-3" />
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                            WiFi Data Overview
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg border-2 bg-blue-50 border-blue-200 transition-all duration-200 hover:shadow-md">
                            <div className="flex items-center mb-2">
                                <FaDatabase className="text-blue-600 text-2xl mr-3" />
                                <div className="flex-1">
                                    <h3 className="text-sm md:text-base font-semibold text-gray-700 mb-1">
                                        Total Records
                                    </h3>
                                    <p className="text-lg md:text-xl font-bold text-gray-900 break-words">
                                        {metadata.totalRecords?.toLocaleString() ||
                                            0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg border-2 bg-green-50 border-green-200 transition-all duration-200 hover:shadow-md">
                            <div className="flex items-center mb-2">
                                <FaNetworkWired className="text-green-600 text-2xl mr-3" />
                                <div className="flex-1">
                                    <h3 className="text-sm md:text-base font-semibold text-gray-700 mb-1">
                                        Unique MAC Addresses
                                    </h3>
                                    <p className="text-lg md:text-xl font-bold text-gray-900 break-words">
                                        {metadata.uniqueMACs?.toLocaleString() ||
                                            0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg border-2 bg-purple-50 border-purple-200 transition-all duration-200 hover:shadow-md">
                            <div className="flex items-center mb-2">
                                <TbClockHour4Filled className="text-purple-600 text-2xl mr-3" />
                                <div className="flex-1">
                                    <h3 className="text-sm md:text-base font-semibold text-gray-700 mb-1">
                                        First Recorded Time
                                    </h3>
                                    <p className="text-lg md:text-xl font-bold text-gray-900 break-words">
                                        {metadata.firstRecord}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg border-2 bg-orange-50 border-orange-200 transition-all duration-200 hover:shadow-md">
                            <div className="flex items-center mb-2">
                                <TbClockHour11Filled className="text-orange-600 text-2xl mr-3" />
                                <div className="flex-1">
                                    <h3 className="text-sm md:text-base font-semibold text-gray-700 mb-1">
                                        Last Recorded Time
                                    </h3>
                                    <p className="text-lg md:text-xl font-bold text-gray-900 break-words">
                                        {metadata.lastRecord}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {metadata.totalRecords > 0 && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                📊 Data collected from{" "}
                                <strong>{sensor_id}</strong> for{" "}
                                <strong>
                                    {new Date(selectedDate).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )}
                                </strong>
                            </p>
                        </div>
                    )}
                </div>
            ) : found ? (
                <div className="text-center py-8 text-gray-500">
                    Select a date to load WiFi sensor metadata
                </div>
            ) : (
                <div className="text-center py-8 text-red-500">
                    No data found for the selected date.
                </div>
            )}
        </div>
    );
}
