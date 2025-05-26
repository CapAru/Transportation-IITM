import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Fetch all users from the database
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Return the list of users as a JSON response
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}