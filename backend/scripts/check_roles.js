const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: { email: true, role: true }
    });
    console.log('--- USER ROLES IN DB ---');
    users.forEach(u => {
        console.log(`Email: ${u.email.padEnd(25)} | Role: [${u.role}]`);
    });
}

main().finally(() => prisma.$disconnect());
