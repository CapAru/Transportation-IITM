import { NextResponse } from "next/server";
import transportDb from "@/lib/transportClient";
import { format } from "@fast-csv/format";

// Function to format timestamp to DD-MM-YYYY HH:MM:SS in local timezone
const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    // Check if date is valid
    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

// Function to format timestamp to simple HH:MM:SS format
const formatTimeOnly = (timestamp) => {
    const date = new Date(timestamp);

    // Check if date is valid
    if (isNaN(date.getTime())) {
        return "Invalid Time";
    }

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
};

// Function to format data with timestamps
const formatDataTimestamps = (data) => {
    return data.map((item) => ({
        ...item,
        timestamp: formatTimestamp(item.timestamp),
    }));
};

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url);
    const { sensor_id } = await params;
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const day = searchParams.get("day");

    try {
        // Create date range for the selected day
        const startDate = new Date(year, month - 1, day, 0, 0, 0, 0); // Start of the selected day
        const endDate = new Date(year, month - 1, day, 23, 59, 59, 999); // End of the selected day
        // Fetch the route data for the given sensor_id, year, month, and day
        const tableName = `wifi_data_${sensor_id}`;

        // Get total records count
        const totalRecords = await transportDb[tableName].count({
            where: {
                timestamp: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        if (totalRecords === 0) {
            return NextResponse.json(
                { error: "No records found for the specified date" },
                { status: 404 }
            );
        }
        // Get unique MAC addresses count
        const uniqueMACs = await transportDb[tableName].findMany({
            where: {
                timestamp: {
                    gte: startDate,
                    lte: endDate,
                },
                mac: {
                    not: null,
                },
            },
            select: {
                mac: true,
            },
            distinct: ["mac"],
        });

        // Get first record
        const firstRecord = await transportDb[tableName].findFirst({
            where: {
                timestamp: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                timestamp: true,
            },
            orderBy: {
                timestamp: "asc",
            },
        });

        // Get last record
        const lastRecord = await transportDb[tableName].findFirst({
            where: {
                timestamp: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                timestamp: true,
            },
            orderBy: {
                timestamp: "desc",
            },
        });

        // Format timestamps for first and last records
        const formattedFirstRecord = firstRecord
            ? {
                  ...firstRecord,
                  timestamp: formatTimeOnly(firstRecord.timestamp),
              }
            : null;

        const formattedLastRecord = lastRecord
            ? {
                  ...lastRecord,
                  timestamp: formatTimeOnly(lastRecord.timestamp),
              }
            : null;

        const metadata = {
            totalRecords,
            uniqueMACs: uniqueMACs.length,
            firstRecord: formattedFirstRecord.timestamp,
            lastRecord: formattedLastRecord.timestamp,
        };

        // Return only the metadata as JSON
        return NextResponse.json(metadata);
    } catch (error) {
        console.error("Error fetching route data:", error);
        return NextResponse.json(
            { error: "Failed to fetch route data" },
            { status: 500 }
        );
    }
}

export async function POST(request, { params }) {
    const { sensor_id } = await params;
    const { year, month, day } = await request.json();
    try {
        // Create date range for the selected day
        const startDate = new Date(year, month - 1, day, 0, 0, 0, 0); // Start of the selected day
        const endDate = new Date(year, month - 1, day, 23, 59, 59, 999); // End of the selected day
        const tableName = `wifi_data_${sensor_id}`;
        const data = await transportDb[tableName].findMany({
            where: {
                timestamp: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: {
                timestamp: "asc",
            },
        });

        // Format timestamps before generating CSV
        const formattedData = formatDataTimestamps(data);

        return new Promise((resolve, reject) => {
            const csvStream = format({ headers: true });
            let csv = "";

            csvStream.on("data", (chunk) => {
                csv += chunk;
            });

            csvStream.on("error", (error) => {
                console.error("CSV generation error:", error);
                reject(error);
            });

            csvStream.on("end", () => {
                resolve(
                    new NextResponse(csv, {
                        headers: {
                            "Content-Type": "text/csv",
                            "Content-Disposition": `attachment; filename="WiFi_data_${sensor_id}_${day}-${month}-${year}.csv"`,
                        },
                    })
                );
            });

            // Use formatted data for CSV generation
            formattedData.forEach((record) => {
                csvStream.write(record);
            });

            csvStream.end();
        });
    } catch (error) {
        console.error("Error fetching route data:", error);
        return NextResponse.json(
            { error: "Failed to fetch route data" },
            { status: 500 }
        );
    }
}
