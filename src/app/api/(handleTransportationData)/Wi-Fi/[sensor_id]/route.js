import { NextResponse } from "next/server";
import transportDb from "@/lib/transportClient";

export async function POST(request, { params }) {
    const { sensor_id } = await params;
    const { year, month } = await request.json();
    console.log(year, month, sensor_id);

    try {
        // Create date range for the selected month
        const startDate = new Date(year, month - 1, 1); // First day of the month
        const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Last day of the month
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);
        // Fetch the route data for the given sensor_id, year, and month
        const dbname = `device${sensor_id}_merged`;
        const routeData = await transportDb[dbname].findMany({
            where: {
                timestamp: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: {
                timestamp: "asc",
            },
            take: 100,
        });

        // Return the fetched data as JSON
        return NextResponse.json(routeData);
    } catch (error) {
        console.error("Error fetching route data:", error);
        return NextResponse.json(
            { error: "Failed to fetch route data" },
            { status: 500 }
        );
    }
}
