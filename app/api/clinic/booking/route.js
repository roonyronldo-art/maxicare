import { NextResponse } from 'next/server';
import { getCalendar } from '@/lib/googleCalendar';

const CAL_ID = process.env.GOOGLE_CALENDAR_ID;

export async function POST(req) {
  if (!CAL_ID) {
    return NextResponse.json({ error: 'Calendar ID not configured' }, { status: 500 });
  }
  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const { name, email, datetimeISO, duration = 30 } = data || {};
  if (!name || !email || !datetimeISO) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const start = new Date(datetimeISO);
  const end = new Date(start.getTime() + duration * 60000);

  const calendar = getCalendar();
  try {
    await calendar.events.insert({
      calendarId: CAL_ID,
      requestBody: {
        summary: `Clinic Appointment - ${name}`,
        description: `Booked via site for ${name} (${email})`,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
        attendees: [{ email }],
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Calendar API error', err?.errors || err);
    return NextResponse.json({ error: 'Google Calendar error' }, { status: 500 });
  }
}
