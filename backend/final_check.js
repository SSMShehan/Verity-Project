const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { 
      email: {
        in: ['student@sliit.lk', 'lecturer@sliit.lk']
      }
    }
  });
  console.log('---BEGIN---');
  users.forEach(u => {
    console.log(`Email: ${u.email}, Name: ${u.name}, Role: ${u.role}`);
  });
  console.log('---END---');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
