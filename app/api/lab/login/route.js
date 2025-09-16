// app/api/lab/login/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    let email = '', password = '';
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      try {
        const data = await request.json();
        email = data.email || '';
        password = data.password || '';
      } catch {}
    } else if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
      const fd = await request.formData();
      email = fd.get('email') || '';
      password = fd.get('password') || '';
    }

    // basic validation
    if (!email.trim() || !password.trim()) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    // find user
    const user = await prisma.labUser.findUnique({ where: { email: email.trim() } });
    if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

    // compare hash
    let ok = false;
    if (user.password.startsWith('$2b$')) {
      ok = await bcrypt.compare(password, user.password);
    } else {
      // legacy plaintext password
      ok = password === user.password;
      if (ok) {
        const newHash = await bcrypt.hash(password, 10);
        await prisma.labUser.update({ where: { id: user.id }, data: { password: newHash } });
      }
    }
    if (!ok) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

    // generate simple token (استخدم JWT لاحقاً)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
    const { password: _pw, ...safeUser } = user;
    return NextResponse.json({ user: safeUser, token });
  } catch (err) {
    console.error('login error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}