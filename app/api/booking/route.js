export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

async function getUserIdFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload.uid;
  } catch (e) {
    return null;
  }
}

export async function GET() {
  try {
    const uid = await getUserIdFromCookie();
    if (!uid) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }
    const bookings = await prisma.booking.findMany({
      where: { userId: uid },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(bookings);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const uid = await getUserIdFromCookie();
    if (!uid) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const { start, end } = await request.json();
    if (!start || !end) {
      return NextResponse.json({ error: 'Missing date' }, { status: 400 });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    const booking = await prisma.booking.create({
      data: {
        userId: uid,
        date: startDate,
        status: 'pending',
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
