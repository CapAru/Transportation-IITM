import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { comparePassword } from "@/lib/encryptPassword";
import { cookies } from "next/headers";
import { generateAccessToken, generateRefreshToken } from "@/lib/generateTokens";
import { serialize } from "cookie";
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
        if ((await comparePassword(password, user.password)) === false) {
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 401 }
            );
        }

        const accessToken = await generateAccessToken(user.id, user.isAdmin);
        const refreshToken = await generateRefreshToken(user.id, user.isAdmin);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        });

        await prisma.session.create({
            data: {
                userId: user.id,
                accessToken: accessToken,
                refreshToken: refreshToken,
                expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1000), // 1 day
            },
        });
        const cookieValue = JSON.stringify({
            accessToken: accessToken,
            refreshToken: refreshToken,
        });

        // More robust cookie configuration for production and network access
        const isProduction = process.env.NODE_ENV === "production";
        const host = request.headers.get("host");
        const isNetworkIP = host && /^\d+\.\d+\.\d+\.\d+/.test(host);

        const cookie = serialize("sessionToken", cookieValue, {
            httpOnly: true,
            secure: isProduction && !isNetworkIP, // Don't require HTTPS for local network IPs
            sameSite: isProduction && !isNetworkIP ? "none" : "lax", // Use lax for local network
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        const res = NextResponse.json(
            {
                message: "success",
                isAdmin: user.isAdmin,
                debug: {
                    cookieSet: true,
                    environment: process.env.NODE_ENV,
                    secure: isProduction,
                },
            },
            { status: 200 }
        );

        res.headers.set("Set-Cookie", cookie);
        return res;
    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
