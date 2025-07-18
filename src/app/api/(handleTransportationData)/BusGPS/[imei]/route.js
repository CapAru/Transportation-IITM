import { NextResponse } from "next/server";
import transportDb from "@/lib/transportClient";
import { format } from "@fast-csv/format";

export async function GET(request, { params }) {
    const date = request.nextUrl.searchParams.get("date");
    if (!date) {
        return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }
    const { imei } = await params;
    const data = await transportDb.gps_data.findMany({
        where: {
            imei: imei,
            date: new Date(date),
        },
        orderBy: {
            time: "asc",
        },
    });
    return NextResponse.json(data);
}