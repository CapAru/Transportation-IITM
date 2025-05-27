import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { encryptPassword } from "@/lib/encryptPassword";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("sessionToken")?.value;
        if (!sessionToken) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const tokenData = JSON.parse(sessionToken);
        const token = tokenData.accessToken;
        if (!token) {
            return Response.json(
                { error: "No access token found" },
                { status: 401 }
            );
        }
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Optional: also verify token exists in session table (extra security)
        const session = await prisma.session.findUnique({
            where: { accessToken: token },
        });

        if (!session || session.expiresAt < new Date()) {
            return Response.json({ error: "Session expired" }, { status: 401 });
        }
        const user = await prisma.user.findUnique({
            where: { id: payload.uid },
        });
        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }
        const body = await request.json();
        const { newPassword } = body;
        if (!newPassword) {
            return NextResponse.json(
                { error: "New password is required" },
                { status: 400 }
            );
        }
        const encryptedPassword = await encryptPassword(newPassword);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: encryptedPassword,
                firstLogin: false,
            },
        });
        console.log(encryptedPassword)
        return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
