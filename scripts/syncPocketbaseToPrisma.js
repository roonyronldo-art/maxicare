import PocketBase from 'pocketbase';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const PB_URL = process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090';
const pb = new PocketBase(PB_URL);

async function syncUsers() {
  const pbUsers = await pb.collection('clinicUsers').getFullList({ sort: '-created' });
  for (const u of pbUsers) {
    try {
      await prisma.user.upsert({
        where: { email: u.email },
        update: {}, // keep existing data
        create: {
          name: u.name || u.username || 'PocketBase User',
          email: u.email,
          password: u.password || 'changeme',
          phone: u.phone || null,
          role: 'user',
          createdAt: new Date(u.created),
        },
      });
    } catch (e) {
      console.error('User sync error', u.email, e);
    }
  }
  console.log(`Synced ${pbUsers.length} users.`);
}

async function syncBookings() {
  const pbBookings = await pb.collection('bookings').getFullList({ sort: '-created', expand: 'user' });
  for (const b of pbBookings) {
    try {
      let userEmail = b.expand?.user?.email;
      if (!userEmail) continue;
      const user = await prisma.user.findUnique({ where: { email: userEmail } });
      if (!user) continue;
      await prisma.booking.upsert({
        where: { id: b.id },
        update: { status: b.status },
        create: {
          id: typeof b.id === 'number' ? b.id : undefined,
          userId: user.id,
          date: new Date(b.date),
          status: b.status || 'pending',
          createdAt: new Date(b.created),
        },
      });
    } catch (e) {
      console.error('Booking sync error', b.id, e);
    }
  }
  console.log(`Synced ${pbBookings.length} bookings.`);
}

async function syncMessages() {
  const pbMessages = await pb.collection('messages').getFullList({ sort: '-created' });
  for (const m of pbMessages) {
    try {
      const bookingId = parseInt(m.booking);
      if (isNaN(bookingId)) continue;
      await prisma.message.upsert({
        where: { id: m.id },
        update: { isRead: m.isRead },
        create: {
          id: typeof m.id === 'number' ? m.id : undefined,
          bookingId,
          sender: m.sender,
          text: m.text || null,
          filePath: m.filePath || null,
          isRead: m.isRead,
          createdAt: new Date(m.created),
        },
      });
    } catch (e) {
      console.error('Message sync error', m.id, e);
    }
  }
  console.log(`Synced ${pbMessages.length} messages.`);
}

(async () => {
  try {
    await syncUsers();
    await syncBookings();
    await syncMessages();
  } finally {
    await prisma.$disconnect();
    console.log('Sync completed');
  }
})();
