import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const prisma = new PrismaClient();
export async function POST() {
    try {
        // Check for the cron secret in the request headers
        const reqHeaders = await headers();
        const cronSecret = reqHeaders.get("x-cron-secret");
        if (cronSecret !== process.env.CRON_SECRET) {
            return NextResponse.json(
                { error: "Unauthorized access." },
                { status: 401 }
            );
        }
        const users = await prisma.user.findMany({
            where: {
                validity: {
                    lt: new Date(),
                },
            },
        });

        if (users.length === 0) {
            return NextResponse.json({
                message: "No expired users found.",
            });
        }

        await prisma.pastUser.deleteMany({
            where: {
                email: {
                    in: users.map(user => user.email),
                }
            },
        });

        await prisma.pastUser.createMany({
            data: users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                college: user.college,
                createdOn: new Date(user.createdAt),
                expiredOn: new Date(user.validity),
            })),
        });
        
        await prisma.session.deleteMany({
            where: {
                userId: {
                    in: users.map(user => user.id),
                },
            },
        });

        const deletedUsers = await prisma.user.deleteMany({
            where: {
                id: {
                    in: users.map(user => user.id),
                },
            },
        });
        return NextResponse.json({
            message: `${deletedUsers.count} expired user(s) removed successfully.`,
        });
    } catch (error) {
        console.error("Error removing expired users:", error);
        return NextResponse.json(
            { error: "Failed to remove expired users." },
            { status: 500 }
        );
    }
}