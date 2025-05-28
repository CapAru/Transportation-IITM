import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    // Await the cookies() function
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken")?.value;
    console.log("Session Token(/user Route):", sessionToken);
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

    // Fetch user details
    const user = await prisma.user.findUnique({
        where: { id: payload.uid },
        select: {
            id: true,
            name: true,
            email: true,
            college: true,
            validity: true,
            firstLogin: true,
        },
    });

    if (!user) {
        return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ user });
}
