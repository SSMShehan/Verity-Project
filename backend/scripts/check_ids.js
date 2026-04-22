const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const announcements = await prisma.announcement.findMany({
        take: 5,
        select: { authorId: true }
    });
    const users = await prisma.user.findMany({
        take: 5,
        select: { id: true }
    });
    console.log('--- ANNOUNCEMENT AUTHOR IDs ---');
    announcements.forEach(a => console.log(`AuthorID: [${a.authorId}]`));
    console.log('--- USER IDs ---');
    users.forEach(u => console.log(`UserID:   [${u.id}]`));
}

main().finally(() => prisma.$disconnect());
