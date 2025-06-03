import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        const deletedUser = await prisma.pastUser.delete({
            where: { id },
        });

        return NextResponse.json(deletedUser, { status: 200 });
    } catch (error) {
        console.error("Error deleting past user:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}