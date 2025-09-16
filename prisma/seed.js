import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'adminlab@lab.com';
  const existing = await prisma.labUser.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log('Admin user already exists');
    // Upsert clinic configuration images
    await prisma.clinicConfig.upsert({
      where: { id: 1 },
      update: {},
      create: {
        heroImg: '/hero-new.jpg',
        loginImg: '/hero-new.jpg',
        registerImg: '/hero-new.jpg',
      },
    });
    console.log('ClinicConfig upserted');

    // Seed schedule for Sat-Thu, 15:00-21:00 every 30 min
    const days = [0,1,2,3,4,6]; // Sunday(0) to Thursday(4) and Saturday(6) – skip Friday(5)
    for (const d of days) {
      await prisma.schedule.upsert({
        where: { dayOfWeek: d },
        update: {},
        create: { dayOfWeek: d, startHour: 15, endHour: 21, slotMinutes: 30 },
      });
    }
    console.log('Schedule seeded');
    return;
  }
  const hash = await bcrypt.hash('12345678', 10);
  await prisma.labUser.create({
    data: {
      email: adminEmail,
      password: hash,
      name: 'Lab Admin',
      role: 'admin',
    },
  });
  console.log('Admin user created with password 12345678');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
