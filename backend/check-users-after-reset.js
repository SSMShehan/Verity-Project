const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const count = await prisma.user.count();
    console.log('USER_COUNT:' + count);
    const users = await prisma.user.findMany({ select: { email: true, indexNumber: true } });
    console.log('USERS:' + JSON.stringify(users));
}

main().finally(() => prisma.$disconnect());
