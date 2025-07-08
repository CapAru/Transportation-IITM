import { NextResponse } from "next/server";
import transportDb from "@/lib/transportClient";

export async function GET(request) {
    const date = request.nextUrl.searchParams.get("date");
    
    if (!date) {
        return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }
    console.log("Fetching GPS data for date:", date);
    try {
        const data = await transportDb.gps_data.findMany({
            where: {
                date: new Date(date),
            },
            select: {
                imei: true,
            },
            distinct: ["imei"],
            orderBy: {
                imei: "asc",
            },
        });

        if (data.length === 0) {
            return NextResponse.json({ message: "No data found for the selected date" }, { status: 404 });
        }
        const uniqueIMEIs = data.map((item) => item.imei);
        console.log("Unique IMEIs found:", uniqueIMEIs.length);
        return NextResponse.json(
            {
                date: date,
                imeis: uniqueIMEIs,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching GPS data:", error);
        return NextResponse.json({ error: "Failed to fetch GPS data" }, { status: 500 });
    }
}