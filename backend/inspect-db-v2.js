const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    let output = '';
    const log = (msg) => { output += msg + '\n'; console.log(msg); };

    try {
        log('--- Columns in GithubRepo ---');
        const cols = await prisma.$queryRaw`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name IN ('githubRepo', 'GithubRepo')
            ORDER BY column_name
        `;
        log(JSON.stringify(cols, null, 2));

        log('\n--- Indexes in GithubRepo ---');
        const idxs = await prisma.$queryRaw`
            SELECT indexname, indexdef 
            FROM pg_indexes 
            WHERE tablename IN ('githubRepo', 'GithubRepo')
        `;
        log(JSON.stringify(idxs, null, 2));

    } catch (e) {
        log('SQL_ERROR: ' + e.message);
    } finally {
        fs.writeFileSync('db_inspect_log.txt', output);
        await prisma.$disconnect();
    }
}

main();
