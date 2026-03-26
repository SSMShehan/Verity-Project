const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Inspecting table githubRepo...');
        const result = await prisma.$queryRaw`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'GithubRepo'
        `;
        console.log('Columns:', JSON.stringify(result, null, 2));

        const indexes = await prisma.$queryRaw`
            SELECT indexname, indexdef 
            FROM pg_indexes 
            WHERE tablename = 'GithubRepo'
        `;
        console.log('Indexes:', JSON.stringify(indexes, null, 2));

    } catch (e) {
        console.error('DIAGNOSTIC_ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
