import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const config = { api: { bodyParser: false } };

export async function GET(req) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const admin = req.nextUrl.searchParams.get('admin') === '1';
    const where = admin ? {} : { userId };
    const tickets = await prisma.ticket.findMany({
      where,
      include: { attachments: true }
    });
    return NextResponse.json({ tickets });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const title = form.get('title');
    const description = form.get('description') || '';
    const file = form.get('file');
    // TODO: replace with real user id from session
    const userId = form.get('userId') || 'guest';
    if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

    const ticket = await prisma.ticket.create({ data: { title, description, userId } });

    let attachment;
    if (file && typeof file.name === 'string') {
      const uploadDir = path.join(process.cwd(), 'public', 'tickets', String(ticket.id));
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, file.name);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      const url = `/tickets/${ticket.id}/${file.name}`;
      attachment = await prisma.ticketAttachment.create({ data: { url, ticketId: ticket.id } });
    }

    return NextResponse.json({ ticket, attachment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
