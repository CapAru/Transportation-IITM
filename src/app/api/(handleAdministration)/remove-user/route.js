import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        const { id } = body;

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

        // Check if the user is an admin
        if (user.isAdmin) {
            return NextResponse.json(
                { error: "Cannot remove an admin user" },
                { status: 403 }
            );
        }

        if (await prisma.pastUser.count({ where: { email: user.email } })) {
            await prisma.pastUser.update({
                where: { email: user.email },
                data: {
                    id: user.id,
                    name: user.name,
                    college: user.college,
                    createdOn: user.createdAt,
                    expiredOn: new Date(),
                },
            });
        } else {
            await prisma.pastUser.create({
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    college: user.college,
                    createdOn: user.createdAt,
                    expiredOn: new Date(),
                },
            });
        }

        await prisma.session.deleteMany({
            where: { userId: id },
        });

        await prisma.user.delete({
            where: { id: id },
        });
        // Delete the user

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error removing user:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
