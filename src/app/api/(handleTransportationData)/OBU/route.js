import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { format } from "@fast-csv/format";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const data = await prisma.sampleData.findMany({
            orderBy: {
                id: "asc",
            },
        });
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST() {
    try {
        const data = await prisma.sampleData.findMany({
            orderBy: {
                id: "asc",
            },
        });

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
                            "Content-Disposition": `attachment; filename="OBU_data_${
                                new Date().toISOString().split("T")[0]
                            }.csv"`,
                        },
                    })
                );
            });

            data.forEach((record) => {
                csvStream.write(record);
            });

            csvStream.end();
        });
    } catch (error) {
        console.error("Error creating CSV:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
