import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
    const userId = await request.headers.get("x-user-id");
    // Fetch user details
    const user = await prisma.user.findUnique({
        where: { id: userId},
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
        await prisma.session.deleteMany({
            where: { userId: payload.uid },
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
