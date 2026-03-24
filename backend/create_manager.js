const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const existing = await prisma.user.findFirst({
    where: { role: 'MANAGER' }
  });

  if (existing) {
    console.log('Manager already exists. Email:', existing.email, 'Password: password123');
    return;
  }

  const manager = await prisma.user.create({
    data: {
      name: 'System Manager',
      email: 'manager@verity.edu',
      password: hashedPassword,
      role: 'MANAGER',
    },
  });

  console.log('Created manager. Email:', manager.email, 'Password: password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
