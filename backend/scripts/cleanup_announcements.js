const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Detecting orphaned announcements...');
    const announcements = await prisma.announcement.findMany();
    const users = await prisma.user.findMany({ select: { id: true } });
    const userIds = new Set(users.map(u => u.id));

    const invalid = announcements.filter(a => !userIds.has(a.authorId));
    console.log(`Found ${invalid.length} orphaned announcements.`);

    if (invalid.length > 0) {
        console.log('Cleaning up orphaned announcements...');
        const deleteRes = await prisma.announcement.deleteMany({
            where: {
                id: { in: invalid.map(a => a.id) }
            }
        });
        console.log(`Deleted ${deleteRes.count} orphaned announcements.`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
