import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';
import { fileURLToPath } from 'url';

export const dynamic = 'force-dynamic';

// Disable default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const formData = await req.formData();
  const id = parseInt(formData.get('id'), 10);
  const file = formData.get('file');
  if (!id || !file) {
    return NextResponse.json({ error: 'Missing id or file' }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const ext = path.extname(file.name) || '.jpg';
  const fileName = `${id}-${Date.now()}-${nanoid(6)}${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);

  const relativeUrl = `/uploads/${fileName}`;
  await prisma.appointment.update({ where: { id }, data: { attachment: relativeUrl } });

  return NextResponse.json({ attachment: relativeUrl });
}
