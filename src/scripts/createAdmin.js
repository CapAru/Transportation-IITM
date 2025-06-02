import { encryptPassword } from "../lib/encryptPassword.js";
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
                accessToken: "",
                refreshToken: "",
            },
        });
        console.log("Admin user created");
    } else {
        console.log("Admin user already exists");
    }
}

seedAdmin().then(() => process.exit());
