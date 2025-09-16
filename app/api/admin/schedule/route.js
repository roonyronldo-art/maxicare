import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const schedules = await prisma.schedule.findMany({ orderBy: { dayOfWeek: 'asc' } });
  return NextResponse.json({ schedules });
}

export async function PUT(req) {
  let data;
  try { data = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const { id, startHour, endHour, slotMinutes = 30 } = data || {};
  if (!id || startHour == null || endHour == null) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const updated = await prisma.schedule.update({
    where: { id },
    data: { startHour, endHour, slotMinutes },
  });
  return NextResponse.json({ schedule: updated });
}
