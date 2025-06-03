import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        const { id, validityDateExtended } = body;

        // Find the user by ID
        const user = await prisma.user.findUnique({
            where: { id: id },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Update the user's validity date
        await prisma.user.update({
            where: { id: id },
            data: { validity: new Date(validityDateExtended) }, // Assuming validityDateExtended is a valid date
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error removing user:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}