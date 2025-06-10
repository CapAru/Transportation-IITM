import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { sendUserExpiryMail } from "@/lib/Mails/UserExpiryMail";

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

        const timezone = "Asia/Kolkata";

        // Send emails and collect results
        const emailPromises = users.map((user) =>
            sendUserExpiryMail(user, timezone)
        );
        const emailResults = await Promise.all(emailPromises);

        // Check if any emails failed to send
        const failedEmails = emailResults.filter((result) => !result.success);
        if (failedEmails.length > 0) {
            console.error("Some emails failed to send:", failedEmails);
            // Continue with cleanup but log the failures
        }

        // Use transaction to ensure data consistency
        await prisma.$transaction(async (tx) => {
            // Delete existing records from pastUser table for these emails (in case of duplicates)
            await tx.pastUser.deleteMany({
                where: {
                    email: {
                        in: users.map((user) => user.email),
                    },
                },
            });

            // Create new records in pastUser table
            await tx.pastUser.createMany({
                data: users.map((user) => ({
                    name: user.name,
                    email: user.email,
                    college: user.college,
                    createdOn: new Date(user.createdAt),
                    expiredOn: new Date(user.validity),
                })),
            });

            // Delete all sessions for expired users
            await tx.session.deleteMany({
                where: {
                    userId: {
                        in: users.map((user) => user.id),
                    },
                },
            });

            // Delete expired users
            await tx.user.deleteMany({
                where: {
                    id: {
                        in: users.map((user) => user.id),
                    },
                },
            });
        });

        return NextResponse.json({
            message: `${users.length} expired user(s) removed successfully.`,
            emailsSent: emailResults.filter((result) => result.success).length,
            emailsFailed: failedEmails.length,
        });
    } catch (error) {
        console.error("Error removing expired users:", error);
        return NextResponse.json(
            { error: "Failed to remove expired users." },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
