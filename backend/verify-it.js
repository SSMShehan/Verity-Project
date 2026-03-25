const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const it = 'IT23833098';
    const user = await prisma.user.findUnique({ where: { indexNumber: it } });
    if (user) {
        console.log('User found with IT number ' + it + ': ' + user.email);
    } else {
        console.log('User not found with IT number ' + it);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
