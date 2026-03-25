const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- YEARS ---');
    const years = await prisma.year.findMany({ include: { semesters: true } });
    console.log(JSON.stringify(years, null, 2));

    console.log('\n--- USERS ---');
    const users = await prisma.user.findMany({ select: { email: true, indexNumber: true } });
    console.log(JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
