import transportDb from "@/lib/transportClient";
import { NextResponse } from "next/server";

export async function GET(request) {
    const date = request.nextUrl.searchParams.get("date");

    if (!date) {
        return NextResponse.json(
            { error: "Date parameter is required" },
            { status: 400 }
        );
    }
    try {
        const data = await transportDb.obu_data.findMany({
            where: {
                date_ist: new Date(date),
            },
            select: {
                obu_id: true,
            },
            distinct: ["obu_id"],
            orderBy: {
                obu_id: "asc",
            },
        });

        if (data.length === 0) {
            return NextResponse.json(
                { message: "No data found for the selected date" },
                { status: 404 }
            );
        }
        const uniqueOBUs = data.map((item) => item.obu_id);
        return NextResponse.json(
            {
                date: date,
                obu_ids: uniqueOBUs,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching GPS data:", error);
        return NextResponse.json(
            { error: "Failed to fetch GPS data" },
            { status: 500 }
        );
    }
}

