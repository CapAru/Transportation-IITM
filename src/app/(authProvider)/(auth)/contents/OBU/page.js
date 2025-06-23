"use client";
import TableComponent from "@/components/TableComponent";
import { useEffect, useState } from "react";

export default function OBUPage() {
    useEffect(() => {
        document.title = "OBU Data";
        document.description = "Explore On-Board Unit (OBU) data.";
    }, []);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/OBU", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    
    const columns = Object.keys(data[0] || {})


    const handleDownload = async () => {
        try {
            const response = await fetch("/api/OBU", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
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
                    ?.replace(/"/g, "") || "OBU_data.csv";
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold mb-6">
                    On-Board Unit (OBU) Data
                </h1>
                <button
                    onClick={handleDownload}
                    className="bg-yellow-300 hover:bg-yellow-400 transition duration-200 hover:cursor-pointer hover:scale-105 px-6 py-3 rounded-2xl"
                >
                    Download Dataset
                </button>
            </div>
            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!loading && !error && data.length === 0 && (
                <p className="text-gray-500">No data available.</p>
            )}
            <TableComponent columns={columns} data={data} />
        </div>
    );
}
