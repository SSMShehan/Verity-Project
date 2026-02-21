const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // 1. Create System Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@verity.edu' },
        update: {},
        create: {
            email: 'admin@verity.edu',
            name: 'System Administrator',
            password: adminPassword,
            role: 'ADMIN',
        },
    });
    console.log(`Created admin user: ${admin.email}`);

    // 2. Create Years
    const year1 = await prisma.year.upsert({
        where: { name: 'Year 1' },
        update: {},
        create: { name: 'Year 1' },
    });

    const year2 = await prisma.year.upsert({
        where: { name: 'Year 2' },
        update: {},
        create: { name: 'Year 2' },
    });

    const year3 = await prisma.year.upsert({
        where: { name: 'Year 3' },
        update: {},
        create: { name: 'Year 3' },
    });

    const year4 = await prisma.year.upsert({
        where: { name: 'Year 4' },
        update: {},
        create: { name: 'Year 4' },
    });

    // 3. Create Semesters
    const semestersToCreate = [
        { name: 'Semester 1', yearId: year1.id },
        { name: 'Semester 2', yearId: year1.id },
        { name: 'Semester 1', yearId: year2.id },
        { name: 'Semester 2', yearId: year2.id },
        { name: 'Semester 1', yearId: year3.id },
        { name: 'Semester 2', yearId: year3.id },
        { name: 'Semester 1', yearId: year4.id },
        { name: 'Semester 2', yearId: year4.id },
    ];

    const createdSemesters = {};
    for (const sem of semestersToCreate) {
        const created = await prisma.semester.upsert({
            where: { name_yearId: { name: sem.name, yearId: sem.yearId } },
            update: {},
            create: sem,
        });
        // Save references for Module creation
        // We know Year 3 Semester 1 is important
        if (sem.name === 'Semester 1' && sem.yearId === year3.id) createdSemesters.year3sem1 = created;
        if (sem.name === 'Semester 2' && sem.yearId === year3.id) createdSemesters.year3sem2 = created;
        if (sem.name === 'Semester 1' && sem.yearId === year1.id) createdSemesters.year1sem1 = created;
        if (sem.name === 'Semester 1' && sem.yearId === year2.id) createdSemesters.year2sem1 = created;
    }

    const semester1 = createdSemesters.year3sem1;
    const semester2 = createdSemesters.year3sem2;

    // 4. Create Modules for Semester 1
    const modules = [
        // Year 1
        { code: 'IT1010', name: 'Introduction to Programming', semesterId: createdSemesters.year1sem1.id },
        { code: 'IT1020', name: 'Mathematics for Computing', semesterId: createdSemesters.year1sem1.id },
        { code: 'IT1030', name: 'Computer Systems Architecture', semesterId: createdSemesters.year1sem1.id },

        // Year 2
        { code: 'IT2010', name: 'Object Oriented Programming', semesterId: createdSemesters.year2sem1.id },
        { code: 'IT2020', name: 'Database Management Systems', semesterId: createdSemesters.year2sem1.id },
        { code: 'IT2030', name: 'Data Structures and Algorithms', semesterId: createdSemesters.year2sem1.id },

        // Year 3
        { code: 'SE3040', name: 'Software Architecture and Design', semesterId: semester1.id },
        { code: 'SE3010', name: 'Software Project Management', semesterId: semester1.id },
        { code: 'SE3080', name: 'Artificial Intelligence', semesterId: semester1.id },
        { code: 'SE3020', name: 'Web Technologies', semesterId: semester1.id },
    ];

    for (const mod of modules) {
        const createdMod = await prisma.module.upsert({
            where: { code: mod.code },
            update: {},
            create: mod,
        });
        console.log(`Created module: ${createdMod.code} - ${createdMod.name}`);
    }

    // 5. Create Modules for Semester 2 (Year 3)
    const modsSem2 = [
        { code: 'SE3050', name: 'Cloud Computing Architecture', semesterId: semester2.id },
        { code: 'SE3060', name: 'Distributed Systems', semesterId: semester2.id },
        { code: 'SE3070', name: 'Mobile Application Development', semesterId: semester2.id },
        { code: 'SE3090', name: 'Human Computer Interaction', semesterId: semester2.id },
    ];

    for (const mod of modsSem2) {
        const createdMod = await prisma.module.upsert({
            where: { code: mod.code },
            update: {},
            create: mod,
        });
        console.log(`Created module: ${createdMod.code} - ${createdMod.name}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
