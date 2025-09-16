import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { subDays } from 'date-fns';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const token = req.cookies.get('token')?.value || '';
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const timeMin = subDays(new Date(), 30);
  const visits = await prisma.appointment.findMany({
    where: {
      userId: user.id,
      start: { gte: timeMin },
      status: { not: 'cancelled' },
    },
    orderBy: { start: 'desc' },
  });
  return NextResponse.json({ visits });
}
