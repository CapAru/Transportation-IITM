import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request){
    try {
        const { email, extensionDate, reason } = await request.json();
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        await prisma.extensionRequest.create({
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                college: user.college,
                reason: reason || "No reason provided",     
                extensionDate: new Date(extensionDate),
            },
        });
        return NextResponse.json({ message: "Extension request created successfully", success: true }, { status: 201 });
    } catch (error) {
        console.error("Error creating extension request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const extensionRequests = await prisma.extensionRequest.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(extensionRequests, { status: 200 });
    } catch (error) {
        console.error("Error fetching extension requests:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}