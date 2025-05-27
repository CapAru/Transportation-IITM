import { generatePassword } from "@/lib/generatePassword";
import { sendPasswordMail } from "@/lib/handleMail";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { encryptPassword } from "@/lib/encryptPassword";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        const { id, validityDate } = body;

        const pendingUser = await prisma.pendingUser.findUnique({
            where: { id: id },
        });

        if (!pendingUser) {
            return NextResponse.json(
                { error: "Pending user not found" },
                { status: 404 }
            );
        }

        const newPassword = generatePassword();

        await sendPasswordMail(pendingUser, newPassword);

        const encryptedPassword = await encryptPassword(newPassword);

        const newUser = await prisma.user.create({
            data: {
                name: pendingUser.name,
                email: pendingUser.email,
                college: pendingUser.college,
                password: encryptedPassword,
                validity: new Date(validityDate),
                accessToken: "",
                refreshToken: "",
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        await prisma.pendingUser.delete({
            where: { id: id },
        });

        return NextResponse.json(
            { success: true, user: newUser },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error accepting request:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
