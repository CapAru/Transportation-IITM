import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET() {
    try {
        const pendingUsers = await prisma.pendingUser.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(pendingUsers, { status: 200 });
    } catch (error) {
        console.error("Error fetching pending users:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
