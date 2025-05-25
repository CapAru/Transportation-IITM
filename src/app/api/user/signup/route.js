import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request) {
    const body = await request.json();
    const newUser = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            college: body.college,
            password: body.password, // hash it before using in real apps
        },
    });
    return NextResponse.json(newUser, { status: 201 });
}
