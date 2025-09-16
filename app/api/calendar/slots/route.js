import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { addDays, formatISO, set, isBefore } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET() {
  const now = new Date();
  const end = addDays(now, 90); // 3 months ahead

  // Query schedules (dayOfWeek, hours) once
  const schedules = await prisma.schedule.findMany();
  const appts = await prisma.appointment.findMany({
    where: {
      start: {
        gte: now,
        lt: end,
      },
      status: {
        not: 'cancelled',
      },
    },
    select: { start: true },
  });
  const busyTimes = new Set(appts.map((a) => new Date(a.start).toISOString()));

  const slots = [];
  for (let d = new Date(now); d < end; d.setDate(d.getDate() + 1)) {
    const daySchedule = schedules.find((s) => s.dayOfWeek === d.getDay());
    if (!daySchedule) continue;

    const { startHour, endHour, slotMinutes } = daySchedule;
    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += slotMinutes) {
        const slot = set(new Date(d), {
          hours: hour,
          minutes: min,
          seconds: 0,
          milliseconds: 0,
        });
        if (isBefore(slot, now)) continue; // skip past
        const iso = slot.toISOString();
        if (!busyTimes.has(iso)) slots.push(formatISO(slot));
      }
    }
  }

  return NextResponse.json({ slots });
}
