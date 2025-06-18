import { NextResponse } from "next/server";
import transportDb from "@/lib/transportClient";
import { format } from "@fast-csv/format";

export async function GET(request, { params }) {
    const { gps_id } = params;
    const tableName = `gps_${gps_id}`;
    const data = await transportDb[tableName].findMany({
        orderBy: {
            time: "asc",
        },
    });
    return NextResponse.json(data);
}