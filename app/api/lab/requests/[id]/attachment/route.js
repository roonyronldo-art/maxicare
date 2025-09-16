import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'lab');

export async function POST(req, { params }) {
  const { id } = params;
  try {
    const token = req.cookies.get('token')?.value || '';
    const user = verifyToken(token);
    const isAdmin = user?.role === 'admin' || req.cookies.get('labAdmin')?.value === '1';
    // allow request owner
    const existing = await prisma.labRequest.findUnique({ where: { id } });
    const isOwner = user && existing && existing.userId === user.id;
    if (!isAdmin && !isOwner) return NextResponse.json({ error: 'Unauth' }, { status: 401 });

    const ct = req.headers.get('content-type') || '';
    if (!ct.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'FormData required' }, { status: 400 });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const fd = await req.formData();
    const file = fd.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'File missing' }, { status: 400 });
    }
    const ext = path.extname(file.name);
    const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(filepath, Buffer.from(arrayBuffer));
    const relPath = `a:/lab/${filename}`;

    // append to attachments field (comma separated)
    const combined = (existing.attachments ? `${existing.attachments},` : '') + relPath;
    await prisma.labRequest.update({ where: { id }, data: { attachments: combined } });

    return NextResponse.json({ success: true, path: relPath });
  } catch (err) {
    console.error('upload error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
