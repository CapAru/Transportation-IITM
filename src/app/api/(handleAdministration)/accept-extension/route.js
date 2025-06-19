import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import sendExtensionAcceptanceEmail from "@/lib/Mails/ExtensionAccept";
const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { email } = await request.json();
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }
        // Find the extension request by email
        const extensionItem = await prisma.extensionRequest.findUnique({
            where: { email: email },
        });
        if (!extensionItem) {
            return NextResponse.json({ error: "Extension request not found" }, { status: 404 });
        }

        const mailResponse = await sendExtensionAcceptanceEmail(email, extensionItem.name, extensionItem.extensionDate);
        
        if (!mailResponse.success) {
            return NextResponse.json({ error: "Failed to send acceptance email" }, { status: 500 });
        }
        // Delete the extension request
        await prisma.extensionRequest.delete({
            where: { email: email },
        });
        // Update the user's validity date
        await prisma.user.update({
            where: { email: extensionItem.email },
            data: { validity: new Date(extensionItem.extensionDate) },
        });
        return NextResponse.json({ message: "Extension request accepted and validity extended successfully", success: true }, { status: 201 });
    } catch (error) {
        console.error("Error accepting extension request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }   
}