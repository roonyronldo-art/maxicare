import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { subDays } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET() {
  const since = subDays(new Date(), 7);
  const appointments = await prisma.appointment.findMany({
    where: { start: { gte: since } },
    include: { schedule: true, user: { select: { name: true, email: true } } },
    orderBy: { start: 'asc' },
  });
  const mapped = appointments.map(a=>({...a,userName:a.user?.name||'',userEmail:a.user?.email||''}));
  return NextResponse.json({ appointments: mapped });
}

export async function PUT(req) {
  let data;
  try { data = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const { id, action, report } = data || {};
  if (!id || (action && !['cancel', 'confirm'].includes(action))) {
    return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
  }
  const updated = await prisma.appointment.update({
    where: { id },
    data: { 
      status: action ? (action === 'cancel' ? 'cancelled' : 'confirmed') : undefined,
      report: report !== undefined ? report : undefined,
    },
  });
  return NextResponse.json({ appointment: updated });
}
