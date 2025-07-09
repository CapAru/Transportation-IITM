"use client";
import TableComponent from "@/components/TableComponent";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

export default function SensorDataPage() {
    const { sensor_id } = useParams();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [found, setFound] = useState(true);
    const [downloading, setDownloading] = useState(false);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 8 }, (_, i) => currentYear - i);

    useEffect(() => {
        document.title = `RSU Data - ${sensor_id}`;
        document.description = `View and sensor data for ${sensor_id}.`;
    }, [sensor_id]);

    const months = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const queryParams = `?year=${selectedYear}&month=${selectedMonth}`;
            const response = await fetch(`/api/RSU/${sensor_id}${queryParams}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.error("Failed to fetch sensor data");
                return;
            }

            const fetchedData = await response.json();
            setData(fetchedData);
            if (fetchedData.length === 0) {
                console.warn("No data found for the selected year and month");
                setFound(false);
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
            const response = await fetch(`/api/RSU/${sensor_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    year: selectedYear,
                    month: selectedMonth,
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
                    ?.replace(/"/g, "") || "RSU_data.csv";
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
        setDownloading(false);
    };
    // Define columns for timestamp-based data
    const columns = data.length > 0 ? Object.keys(data[0]) : [];

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
                                htmlFor="year"
                                className="text-lg font-medium text-gray-700"
                            >
                                Year:
                            </label>
                            <select
                                id="year"
                                value={selectedYear}
                                onChange={(e) =>
                                    setSelectedYear(parseInt(e.target.value))
                                }
                                className="border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 w-full sm:w-auto"
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col sm:flex-row lg:flex-row lg:items-center gap-2 lg:gap-2">
                            <label
                                htmlFor="month"
                                className="text-lg font-medium text-gray-700"
                            >
                                Month:
                            </label>
                            <select
                                id="month"
                                value={selectedMonth}
                                onChange={(e) =>
                                    setSelectedMonth(parseInt(e.target.value))
                                }
                                className="border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 w-full sm:w-auto"
                            >
                                {months.map((month) => (
                                    <option
                                        key={month.value}
                                        value={month.value}
                                    >
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer transition duration-200 w-full sm:w-auto"
                        >
                            {loading ? "Loading..." : "Load Data"}
                        </button>
                    </form>                    <button onClick={handleDownload} disabled={downloading} className="bg-yellow-300 px-6 py-2 rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer transition duration-200 w-full sm:w-auto lg:w-auto flex items-center justify-center">
                        {downloading ? (
                            <>
                                <span className="mr-2">Downloading...</span>
                                <Loader filledColor="orange" emptyColor="black"/>
                            </>
                        ) : (
                            "Download CSV"
                        )}
                    </button>
                </div>
            </div>

            {data.length > 0 ? (
                <div className="w-full overflow-x-auto">
                    <TableComponent columns={columns} data={data} />
                </div>
            ) : found ? (
                <div className="text-center py-8 text-gray-500">
                    Select a year and month to load sensor data
                </div>
            ) : (
                <div className="text-center py-8 text-red-500">
                    No data found for the selected year and month.
                </div>
            )}
        </div>
    );
}
