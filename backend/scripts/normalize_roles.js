const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Normalizing user roles to UPPERCASE...');
    const users = await prisma.user.findMany();
    let count = 0;
    for (const user of users) {
        if (user.role && user.role !== user.role.toUpperCase()) {
            await prisma.user.update({
                where: { id: user.id },
                data: { role: user.role.toUpperCase() }
            });
            console.log(`Updated user ${user.email}: ${user.role} -> ${user.role.toUpperCase()}`);
            count++;
        }
    }
    console.log(`Finished! Updated ${count} users.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
