const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Connecting to database...");
    await prisma.$connect();
    console.log("Database connected successfully!");
    
    const userCount = await prisma.user.count();
    console.log("Number of users in DB:", userCount);
}

main()
    .catch((e) => {
        console.error("Database connection error:", e.message);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
