import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        const { id } = body;

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

        // Delete the pending user
        await prisma.pendingUser.delete({
            where: { id: id },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error rejecting request:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}