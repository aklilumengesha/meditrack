import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@meditrack.com';
  const password = 'Admin@123';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin already exists');
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, password: hashed, role: 'ADMIN' },
  });

  console.log('Admin created: admin@meditrack.com / Admin@123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
