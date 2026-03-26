const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const projectId = '974721b5-e258-42ca-8e47-199de6c61e9e';
        console.log(`Checking project: ${projectId}`);
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        console.log('Project found:', !!project);
        if (project) {
            console.log('Project title:', project.title);
        }

        const existingRepo = await prisma.githubRepo.findUnique({ where: { projectId } });
        console.log('Existing repo for this project:', existingRepo);

        const fullName = 'ssmshehan/verity-project';
        const repoByFullName = await prisma.githubRepo.findUnique({ where: { repoFullName: fullName } });
        console.log(`Repo by full name '${fullName}':`, repoByFullName);

    } catch (e) {
        console.error('Diagnostic error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
