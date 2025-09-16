import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req, { params }) {
  const { id } = params;
  try {
    const token = req.cookies.get('token')?.value || '';
    const user = token ? verifyToken(token) : null;
    const isAdmin = user?.role === 'admin' || req.cookies.get('labAdmin')?.value === '1';
    if (!isAdmin) return NextResponse.json({ error: 'Unauth' }, { status: 401 });

    const { reply = '' } = await req.json();
    if (!reply.trim()) return NextResponse.json({ error: 'Empty reply' }, { status: 400 });

    const updated = await prisma.labRequest.update({ where: { id }, data: { reply } });
    return NextResponse.json({ success: true, id: updated.id });
  } catch (err) {
    console.error('reply error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
