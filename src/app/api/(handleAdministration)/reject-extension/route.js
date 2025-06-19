import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { email } = await request.json();
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const extensionRequest = await prisma.extensionRequest.delete({
            where: { email: email },
        });
        if (!extensionRequest) {
            return NextResponse.json({ error: "Extension request not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Extension request rejected successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error rejecting extension request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}