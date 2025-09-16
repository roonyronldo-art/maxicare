import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value || '';
    const user  = verifyToken(token);
    if (!user)
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    const ct = request.headers.get('content-type') || '';
    let title = '', description = '';
    if (ct.includes('application/json')) {
      const { title: t = '', description: d = '' } = await request.json();
      title = t.trim();
      description = d.trim();
    } else {
      const fd = await request.formData();
      title       = (fd.get('title') || '').toString().trim();
      description = (fd.get('description') || '').toString().trim();
    }
    if (!title)
      return NextResponse.json({ error: 'Missing title' }, { status: 400 });

    const ticket = await prisma.ticket.create({
      data: { title, description, userId: user.id },
    });

    return NextResponse.json({ id: ticket.id });
  } catch (err) {
    console.error('ticket create error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}