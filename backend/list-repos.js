const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Fetching all repos...');
        const repos = await prisma.githubRepo.findMany();
        console.log('Repos count:', repos.length);
        console.log('Repos:', JSON.stringify(repos, null, 2));
    } catch (e) {
        console.error('DIAGNOSTIC_ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
