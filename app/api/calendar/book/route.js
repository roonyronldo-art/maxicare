import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const { datetimeISO } = data || {};
  if (!datetimeISO) {
    return NextResponse.json({ error: 'Missing datetimeISO' }, { status: 400 });
  }
  const slot = new Date(datetimeISO);
  if (isNaN(slot)) {
    return NextResponse.json({ error: 'Invalid datetimeISO' }, { status: 400 });
  }

  // identify user
  const token = req.cookies.get('token')?.value || '';
  const user = verifyToken(token);
  if(!user) return NextResponse.json({ error: 'Unauthenticated'},{status:401});

  // Check if slot already booked
  const existing = await prisma.appointment.findUnique({ where: { start: slot } });
  if (existing) {
    return NextResponse.json({ error: 'Slot already booked' }, { status: 409 });
  }

  // Find schedule for the day
  const schedule = await prisma.schedule.findUnique({ where: { dayOfWeek: slot.getDay() } });
  if (!schedule) {
    return NextResponse.json({ error: 'Clinic closed that day' }, { status: 400 });
  }
  const hour = slot.getHours();
  if (hour < schedule.startHour || hour >= schedule.endHour) {
    return NextResponse.json({ error: 'Outside working hours' }, { status: 400 });
  }

  // create appointment
  await prisma.appointment.create({ data: { start: slot, scheduleId: schedule.id, userId: user.id } });
  return NextResponse.json({ success: true });
}
