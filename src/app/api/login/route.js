import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { comparePassword } from "@/lib/encryptPassword";
import { cookies } from "next/headers";
import { generateAccessToken, generateRefreshToken } from "@/lib/generateTokens";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Check password (in a real application, you should hash the password and compare)
        if (comparePassword(password, user.password) === false) {
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 401 }
            );
        }

        // Generate access and refresh tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
                expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1000), // 1 day
            },
        });

        // Update user with tokens
        await prisma.session.create({
            data: {
                userId: user.id,
                accessToken: accessToken,
                refreshToken: refreshToken,
                expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1000), // 1 day
            },
        });
        // Set the session cookie directly
        const cookieStore = await cookies();
        cookieStore.set({
            name: "sessionToken",
            value: JSON.stringify({
                accessToken: accessToken,
                refreshToken: refreshToken,
            }),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        return NextResponse.json({ message: "success", isAdmin: user.isAdmin }, { status: 200 });
    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
