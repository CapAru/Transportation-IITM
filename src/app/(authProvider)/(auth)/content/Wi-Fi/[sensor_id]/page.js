"use client";
import TableComponent from "@/components/TableComponent";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function SensorDataPage() {
    const { sensor_id } = useParams();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [found, setFound] = useState(true);

    // Generate years (current year and previous 7 years)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 8 }, (_, i) => currentYear - i);

    // Generate months
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
            const response = await fetch(`/api/Wi-Fi/${sensor_id}`, {
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

    // Define columns for timestamp-based data
    const columns = data.length > 0 ? Object.keys(data[0]) : ["timestamp"];
    console.log("Columns:", columns);

    return (
        <div className="px-6 w-full">
            <div className="flex items-center justify-start border-b border-gray-300 pb-4 mb-6">
                <h2 className="text-3xl font-bold">
                    Sensor Data - {sensor_id}
                </h2>
                <form
                    className="flex items-center gap-6 mx-auto"
                    onSubmit={handleSubmit}
                >
                    <div className="flex items-center gap-2">
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
                            className="border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
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
                            className="border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                        >
                            {months.map((month) => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer transition duration-200"
                    >
                        {loading ? "Loading..." : "Load Data"}
                    </button>
                </form>
            </div>

            {data.length > 0 ? (
                <div className="w-full">
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
