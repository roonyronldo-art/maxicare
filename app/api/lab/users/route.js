// GET /api/lab/users – list lab_users for admin dashboard
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET() {
  try {
    const users = await prisma.labUser.findMany({
      orderBy: { id: 'desc' },
      select: { id: true, email: true, name: true, role: true },
    });
    return NextResponse.json({ users });
  } catch (err) {
    console.error('lab users list error', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
