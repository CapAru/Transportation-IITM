import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
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

    const session = await prisma.session.findUnique({
        where: { accessToken: token },
    });

    if (!session || session.expiresAt < new Date()) {
        return Response.json({ error: "Session expired" }, { status: 401 });
    }

    // Fetch user details
    const user = await prisma.user.findUnique({
        where: { id: payload.uid },
        select: {
            id: true,
            name: true,
            email: true,
            college: true,
            validity: true,
            isAdmin: true,
            createdAt: true,
        },
    });

    if (!user?.isAdmin && new Date(user.validity) < new Date()) {
        await prisma.session.delete({
            where: { id: session.id },
        });

        await prisma.user.delete({
            where: { id: payload.uid },
        });
        cookieStore.delete("sessionToken");
        return Response.json(
            { error: "User validity expired" },
            { status: 403 }
        );
    }

    if (!user) {
        return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ user });
}
