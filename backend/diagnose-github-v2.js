const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    let output = '';
    const log = (msg) => { output += msg + '\n'; console.log(msg); };

    try {
        const projectId = '974721b5-e258-42ca-8e47-199de6c61e9e';
        log(`Checking project: ${projectId}`);
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        log('Project found: ' + !!project);
        
        if (project) {
            log('Project title: ' + project.title);
        }

        log('Checking existing repo for project...');
        const existingRepo = await prisma.githubRepo.findUnique({ where: { projectId } });
        log('Existing repo: ' + JSON.stringify(existingRepo));

        const fullName = 'ssmshehan/verity-project';
        log(`Checking repo by full name: ${fullName}`);
        const repoByFullName = await prisma.githubRepo.findUnique({ where: { repoFullName: fullName } });
        log('Repo by full name: ' + JSON.stringify(repoByFullName));

    } catch (e) {
        log('DIAGNOSTIC_ERROR: ' + e.message);
        log('STACK: ' + e.stack);
        if (e.code) log('ERROR_CODE: ' + e.code);
    } finally {
        fs.writeFileSync('diagnose_log.txt', output);
        await prisma.$disconnect();
    }
}

main();
