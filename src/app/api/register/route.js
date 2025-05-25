import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function POST(request) {
    try {
        const body = await request.json();
        const { email, name, college, password } = body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const user = {
            name: name,
            email: email,
            college: college,
            password: password, // In a real application, hash the password before storing it
        }
        // Create new user
        await prisma.pendingUser.create({user});

        return NextResponse.json({success: true, status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}