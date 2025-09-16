// Clinic Login – LabUser + JWT cookie
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import jwt from 'jsonwebtoken';
import { comparePassword } from '@/lib/auth';

const JWT_SECRET  = process.env.JWT_SECRET || 'dev-secret';
const ADMIN_EMAIL = 'admin2563@clinic.com';
const ADMIN_PASS  = 'clinicadmin123';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // fetch user
    let user = await prisma.labUser.findUnique({ where: { email } });

    // auto-create admin once
    if (!user && email === ADMIN_EMAIL && password === ADMIN_PASS) {
      user = await prisma.labUser.create({
        data: { name: 'Clinic Admin', email: ADMIN_EMAIL, password: ADMIN_PASS },
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // validate password (bcrypt or plain)
    let ok = false;
    try { ok = await comparePassword(password, user.password); } catch {}
    if (!ok && password === user.password) ok = true;
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const payload = email === ADMIN_EMAIL ? { role: 'admin' } : { id: user.id, role: 'user' };
    const token   = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    const res = NextResponse.json({ success: true, user });
    if (payload.role === 'admin') {
      res.cookies.set('admin_token', token, { httpOnly: true, sameSite: 'lax', path: '/' });
    } else {
      res.cookies.set('token', token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 });
      res.cookies.set('loggedIn', '1', { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 8 });
    }
    return res;
  } catch (err) {
    console.error('login error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}