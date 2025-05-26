import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        const { id, validityDate } = body;
        // Find the pending user by ID
        const pendingUser = await prisma.pendingUser.findUnique({
            where: { id: id },
        });

        if (!pendingUser) {
            return NextResponse.json(
                { error: "Pending user not found" },
                { status: 404 }
            );
        }

        // Create a new user from the pending user data
        const newUser = await prisma.user.create({
            data: {
                name: pendingUser.name,
                email: pendingUser.email,
                college: pendingUser.college,
                password: pendingUser.password,
                validity: validityDate, // Set validity to one year from now
            },
        });

        // Delete the pending user
        await prisma.pendingUser.delete({
            where: { id: id },
        });

        return NextResponse.json({ success: true, user: newUser }, { status: 201 });
    }
    catch (error) {
        console.error("Error accepting request:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}