import { encryptPassword } from "@/lib/encryptPassword";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedAdmin() {
    const adminEmail = "admin";
    const adminPassword = "admin";

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
        const hashedPassword = await encryptPassword(adminPassword);
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: "Admin",
                college: "AdminInstitute",
                isAdmin: true,
                validity: null,
                firstLogin: false,
                accessToken: "",
                refreshToken: "",
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });
        console.log("Admin user created");
    } else {
        console.log("Admin user already exists");
    }
}

seedAdmin().then(() => process.exit());
