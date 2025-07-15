import { NextResponse } from "next/server";
import transportDb from "@/lib/transportClient";
import { format } from "@fast-csv/format";

export async function GET(request, { params }) {
    const date = request.nextUrl.searchParams.get("date");
    if (!date) {
        return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }
    const { obu_id } = await params;
    const data = await transportDb.obu_data.findMany({
        where: {
            obu_id: Number(obu_id),
            date_ist: new Date(date),
        },
        orderBy: {
            time_ist: "asc",
        },
    });
    return NextResponse.json(data);
}