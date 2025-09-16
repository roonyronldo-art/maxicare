import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';
const ALLOWED = ['pending', 'in-progress', 'closed'];

export async function POST(req, { params }) {
  const { id } = params;
  try {
    const token = req.cookies.get('token')?.value || '';
    const user = token ? verifyToken(token) : null;
    const isAdmin = user?.role === 'admin' || req.cookies.get('labAdmin')?.value === '1';
    if (!isAdmin) return NextResponse.json({ error: 'Unauth' }, { status: 401 });

    const { status } = await req.json();
    if (!ALLOWED.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await prisma.labRequest.update({ where: { id }, data: { status } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('status error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
