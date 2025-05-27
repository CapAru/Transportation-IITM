import { generatePassword } from "@/lib/generatePassword";
import { generateAccessToken, generateRefreshToken } from "@/lib/generateTokens";
import { sendPasswordMail } from "@/lib/handleMail";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { encryptPassword } from "@/lib/encryptPassword";

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

        const accessToken = generateAccessToken(id);
        const refreshToken = generateRefreshToken(id);
        const newPassword = generatePassword();
        // Create a new user from the pending user data
        await sendPasswordMail(pendingUser, newPassword);

        const encryptedPassword = await encryptPassword(newPassword);

        const newUser = await prisma.user.create({
            data: {
                name: pendingUser.name,
                email: pendingUser.email,
                college: pendingUser.college,
                password: encryptedPassword,
                validity: validityDate,
                accessToken: accessToken,
                refreshToken: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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