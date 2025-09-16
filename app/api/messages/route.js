export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '../../../lib/auth';
import jwt from 'jsonwebtoken';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';


async function getUser() {
  const cookieStore = await cookies();
  const userToken = cookieStore.get('token')?.value;
  const adminToken = cookieStore.get('admin_token')?.value;

  // Prefer admin token if present so admin pages always authorized
  if (adminToken) {
    try {
      verifyToken(adminToken);
      return { id: 0, role: 'admin' };
    } catch {}
  }

  // fall back to user token
  if (userToken) {
    try {
      const payload = verifyToken(userToken);
      return { id: payload.uid, role: 'user' };
    } catch {}
  }
  return null;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const bookingId = Number(searchParams.get('bookingId'));
  if (!bookingId) {
    return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
  }
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  // basic authorization: admin can view all, user only their own booking
  if (user.role === 'user') {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }
  const unreadOnly = searchParams.get('unreadOnly') === '1';
  let whereClause;
  if (unreadOnly) {
    const senderFilter = user.role === 'admin' ? 'user' : 'admin';
    whereClause = { bookingId, sender: senderFilter, isRead: false };
  } else {
    whereClause = { bookingId };
  }

  let messages;
  try {
    messages = await prisma.message.findMany({
      where: whereClause,
      orderBy: { createdAt: 'asc' },
    });
  } catch (e) {
    // fallback if isRead column not yet migrated
    if (unreadOnly && e.message?.includes('no such column: isRead')) {
      messages = await prisma.message.findMany({
        where: { bookingId, sender: 'admin' },
        orderBy: { createdAt: 'asc' },
      });
    } else {
      console.error(e);
      return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
    }
  }
  return NextResponse.json(messages);
}

export async function PATCH(request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const { bookingId } = await request.json();
  const bId = Number(bookingId);
  if (!bId) return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
  const senderFilter = user.role === 'admin' ? 'user' : 'admin';
  await prisma.message.updateMany({
    where: { bookingId: bId, sender: senderFilter, isRead: false },
    data: { isRead: true },
  });
  return NextResponse.json({ success: true });
}

export async function POST(request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const formData = await request.formData();
  const bookingId = Number(formData.get('bookingId'));
  if (!bookingId) return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });

  const text = formData.get('text');
  const file = formData.get('file');
  let filePath = null;
  if (file && typeof file === 'object') {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    const filename = `${Date.now()}_${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, filename), buffer);
    filePath = `/uploads/${filename}`;
  }
  const message = await prisma.message.create({
    data: {
      bookingId,
      sender: user.role,
      isRead: false,
      text: text || null,
      filePath,
    },
  });
  return NextResponse.json({ success: true, message });
}
