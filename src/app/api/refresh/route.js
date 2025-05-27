import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { generateAccessToken } from "@/lib/generateTokens";

const prisma = new PrismaClient();

export async function POST(request) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken")?.value;
    if (!sessionToken) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const tokenData = JSON.parse(sessionToken);
    const refreshToken = tokenData.refreshToken;
    if (!refreshToken) {
        return Response.json(
            { error: "No refresh token found" },
            { status: 401 }
        );
    }
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        // Optional: also verify token exists in session table (extra security)
        const session = await prisma.session.findUnique({
            where: { refreshToken: refreshToken },
        });

        if (!session || session.expiresAt < new Date()) {
            return Response.json({ error: "Session expired" }, { status: 401 });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(payload.uid);

        // Update session with new access token
        await prisma.session.update({
            where: { id: session.id },
            data: {
                accessToken: newAccessToken,
                expiresAt: new Date(Date.now() + 60 * 15 * 1000), // 15 minutes
            },
        });

        return Response.json({ accessToken: newAccessToken }, { status: 200 });
    } catch (error) {
        console.error("Error refreshing token:", error);
        return Response.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}