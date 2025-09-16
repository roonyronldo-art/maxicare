export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '../../../lib/auth';

async function isAdmin() {
  const token = (await cookies()).get('admin_token')?.value;
  if (!token) return false;
  const payload = verifyToken(token);
  return payload && payload.role === 'admin';
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }
  try {
    let users = await prisma.user.findMany({
      include: {
        bookings: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    if (!users.length) {
      try {
        const PocketBase = (await import('pocketbase')).default;
        const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090');
        // fetch clinicUsers with expanded latest booking
        const records = await pb.collection('clinicUsers').getFullList({
          sort: '-created',
          expand: 'bookings',
        });
        // map to the shape expected by dashboard
        users = records.map(r => ({
          id: r.id,
          name: r.name,
          email: r.email,
          bookings: r.expand?.bookings || [],
        }));
      } catch (e) {
        console.error('PocketBase fetch failed', e);
      }
    }
    return NextResponse.json(users);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
