import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user');
    const where = userId ? { userId } : {};
    const requests = await prisma.labRequest.findMany({
      include: { user: { select: { name: true, email: true } } },
      where,
      orderBy: { created: 'desc' },
    });
    const mapped = requests.map(r => ({
      ...r,
      userName: r.user?.name || '',
      userEmail: r.user?.email || '',
      files: (r.attachments || '').split(',').filter(p=>p.startsWith('u:') || (!p.startsWith('a:') && !p.startsWith('u:'))).map(p=> p.startsWith('u:') ? p.slice(2) : p),
      adminReply: r.reply || '',
      replyFiles: (r.attachments || '').split(',').filter(p=>p.startsWith('a:')).map(p=>p.slice(2))
    }));
    return NextResponse.json({ requests: mapped });
  } catch (err) {
    console.error('lab requests GET error', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value || '';
    const user = verifyToken(token);
    let requester = user;
    let providedUserId = '';
    

    const ct = request.headers.get('content-type') || '';
    let title = '', description = '', uploadFiles = [];
    if (ct.includes('application/json')) {
      const body = await request.json();
      providedUserId = body.user || '';
      title = (body.title || '').trim();
      description = (body.description || '').trim();
    } else {
      const fd = await request.formData();
      providedUserId = (fd.get('user') || '').toString();
      uploadFiles = fd.getAll('files');
      title = (fd.get('title') || '').toString().trim();
      description = (fd.get('description') || '').toString().trim();
    }
    if (!title && !description) {
      return NextResponse.json({ error: 'Missing content' }, { status: 400 });
    }

    if (!requester && !providedUserId) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }
    // handle file saving if any
    let attachmentsStr = '';
    if (uploadFiles.length) {
      const pathMod = await import('path');
      const fsMod = await import('fs/promises');
      const path = pathMod.default;
      const fs = fsMod.default;
      const UPLOAD_DIR = path.join(process.cwd(), 'public', 'lab');
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      const saved = [];
      for (const f of uploadFiles) {
        if (typeof f === 'string') continue;
        const ext = path.extname(f.name);
        const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
        const filepath = path.join(UPLOAD_DIR, filename);
        const buf = Buffer.from(await f.arrayBuffer());
        await fs.writeFile(filepath, buf);
        saved.push(`u:/lab/${filename}`);
      }
      attachmentsStr = saved.join(',');
    }

    const rec = await prisma.labRequest.create({
      data: {
        description,
        userId: requester ? requester.id : providedUserId,
        attachments: attachmentsStr || undefined,
      },
    });
    return NextResponse.json({ id: rec.id });
  } catch (err) {
    console.error('lab requests POST error', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
