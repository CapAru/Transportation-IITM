import { NextResponse } from "next/server";
import transportDb from "@/lib/transportClient";
import { format } from "@fast-csv/format";

// Function to format timestamp to DD-MM-YYYY HH:MM:SS in IST
const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    
    
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

// Function to format data with timestamps
const formatDataTimestamps = (data) => {
    return data.map(item => ({
        ...item,
        timestamp: formatTimestamp(item.timestamp)
    }));
};

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url);
    const { sensor_id } = await params;
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    try {
        // Create date range for the selected month
        const startDate = new Date(year, month - 1, 1); // First day of the month
        const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Last day of the month
        // Fetch the route data for the given sensor_id, year, and month
        const routeData = await transportDb.wifi_data.findMany({
            where: {
                timestamp: {
                    gte: startDate,
                    lte: endDate,
                },
                device_id: sensor_id,
            },
            orderBy: {
                timestamp: "asc",
            },
            take: 100,
        });

        // Format timestamps before returning
        const formattedData = formatDataTimestamps(routeData);

        // Return the formatted data as JSON
        return NextResponse.json(formattedData);
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
    const { year, month } = await request.json();
    try {
        const startDate = new Date(year, month - 1, 1); // First day of the month
        const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Last day of the month
        const data = await transportDb.wifi_data.findMany({
            where: {
                timestamp: {
                    gte: startDate,
                    lte: endDate,
                },
                device_id: sensor_id,
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
                console.log("CSV generation completed");
                resolve(
                    new NextResponse(csv, {
                        headers: {
                            "Content-Type": "text/csv",
                            "Content-Disposition": `attachment; filename="WiFi_data_${sensor_id}_${month}_${year}.csv"`,
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
