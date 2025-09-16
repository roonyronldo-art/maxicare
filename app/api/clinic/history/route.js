import { NextResponse } from 'next/server';
import { getCalendar } from '@/lib/googleCalendar';
import { subDays } from 'date-fns';

const CAL_ID = process.env.GOOGLE_CALENDAR_ID;

export async function GET() {
  if (!CAL_ID) return NextResponse.json({ error: 'Calendar ID missing' }, { status: 500 });
  const calendar = getCalendar();
  const timeMin = subDays(new Date(), 30).toISOString();
  const res = await calendar.events.list({
    calendarId: CAL_ID,
    timeMin,
    maxResults: 50,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const visits = res.data.items?.map(ev => ({
    id: ev.id,
    summary: ev.summary,
    start: ev.start.dateTime || ev.start.date,
    status: ev.status,
  })) || [];
  return NextResponse.json({ visits });
}
