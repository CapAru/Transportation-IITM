import { NextResponse } from "next/server";
import transportDb from "@/lib/transportClient";
import { format } from "@fast-csv/format";

export async function GET(){
    const data = await transportDb.sample_gps.findMany({
        orderBy: {
            time: "asc",
        },
    });
    return NextResponse.json(data);
}