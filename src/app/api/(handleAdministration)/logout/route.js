import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST() {
    try {
        // Clear the session cookie
        const cookieStore = await cookies();
        
        await prisma.session.deleteMany({
            where: {
                accessToken: cookieStore.get("sessionToken")?.value?.accessToken,
            },
        });
        cookieStore.delete("sessionToken");
        
        return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error logging out:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}