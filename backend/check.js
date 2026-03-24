const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.module.findMany().then(c => console.log('Modules count:', c.length)).finally(() => prisma.$disconnect());
