import { NextResponse } from 'next/server';
import { getCalendar } from '@/lib/googleCalendar';
import { addDays, formatISO, set } from 'date-fns';

const CAL_ID = process.env.GOOGLE_CALENDAR_ID;
const WORK_START_HOUR = 15; // 15:00
const WORK_END_HOUR = 21;  // 21:00
const SLOT_MINUTES = 30;   // 30-minute slots

export async function GET() {
  if (!CAL_ID) {
    return NextResponse.json({ error: 'Calendar not configured' }, { status: 500 });
  }
  const now = new Date();
  const endRange = addDays(now, 7); // show slots for a full week
  const calendar = getCalendar();
  const eventsRes = await calendar.events.list({
    calendarId: CAL_ID,
    timeMin: now.toISOString(),
    timeMax: endRange.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });
  const busy = eventsRes.data.items?.map(e => new Date(e.start.dateTime || e.start.date)) || [];

  const slots = [];
  for (let d = new Date(now); d < endRange; d.setDate(d.getDate() + 1)) {
    const day = d.getDay(); // 0=Sun in JS locale? Actually 0=Sun, 6=Sat
    if (day === 5) continue; // skip Friday (day 5 if week starts Sun)

    for (let hour = WORK_START_HOUR; hour < WORK_END_HOUR; hour++) {
      for (let min = 0; min < 60; min += SLOT_MINUTES) {
        const slot = set(new Date(d), { hours: hour, minutes: min, seconds: 0, milliseconds: 0 });
        if (slot < now) continue;
        const clash = busy.find(b => Math.abs(b - slot) < SLOT_MINUTES * 60000);
        if (!clash) slots.push(formatISO(slot));
      }
    }
  }
  return NextResponse.json({ slots });
}
