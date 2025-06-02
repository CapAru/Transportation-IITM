import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET() {
    try {
        const pastUsers = await prisma.pastUser.findMany({
            orderBy: {
                expiredOn: "desc",
            },
        });

        return NextResponse.json(pastUsers, { status: 200 });
    } catch (error) {
        console.error("Error fetching past users:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}