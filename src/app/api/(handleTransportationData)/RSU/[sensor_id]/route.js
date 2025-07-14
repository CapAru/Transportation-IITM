import { NextResponse } from "next/server";
import transportDb from "@/lib/transportClient";
import { format } from "@fast-csv/format";

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url);
    const { sensor_id } = await params;
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    try {
        // Create start date: first day of the month at 00:00:00 UTC
        const startDate = new Date(
            Date.UTC(year, month - 1, 1)
        );

        // Create end date: last day of the month at 23:59:59 UTC
        const endDate = new Date(
            Date.UTC(year, month, 0, 23, 59, 59, 999)
        );
        // Fetch the route data for the given sensor_id, year, and month
        const routeData = await transportDb.rsu_data.findMany({
            where: {
                date_ist: {
                    gte: startDate,
                    lte: endDate,
                },
                rsu_id: Number(sensor_id),
            },
            orderBy: [
                {
                    date_ist: "asc",
                },
                {
                    time_ist: "asc",
                },
            ],
            take: 100,
        });

        // Format the data to show only date and time
        const formattedData = routeData.map((item) => ({
            ...item,
            date_ist: item.date_ist
                ? item.date_ist.toLocaleDateString("en-GB")
                : null,
            time_ist: item.time_ist
                ? item.time_ist.toLocaleTimeString("en-GB", { hour12: false })
                : null,
        }));

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
        // Create start date: first day of the month at 00:00:00 UTC
        const startDate = new Date(
            Date.UTC(year, month - 1, 1, 0, 0, 0, 0)
        );

        // Create end date: last day of the month at 23:59:59 UTC
        const endDate = new Date(
            Date.UTC(year, month, 0, 23, 59, 59, 999)
        );

        const data = await transportDb.rsu_data.findMany({
            where: {
                date_ist: {
                    gte: startDate,
                    lte: endDate,
                },
                rsu_id: Number(sensor_id),
            },
            orderBy: [
                {
                    date_ist: "asc",
                },
                {
                    time_ist: "asc",
                },
            ],
        });

        // Format the data to show only date and time
        const formattedData = data.map((item) => ({
            ...item,
            date_ist: item.date_ist
                ? item.date_ist.toLocaleDateString("en-GB")
                : null,
            time_ist: item.time_ist
                ? item.time_ist.toLocaleTimeString("en-GB", { hour12: false })
                : null,
        }));

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
                            "Content-Disposition": `attachment; filename="RSU_data_${sensor_id}_${month}_${year}.csv"`,
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
