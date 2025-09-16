import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const exists = await prisma.labUser.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: 'Email exists' }, { status: 409 });

    const hashed = await hashPassword(password);
    const user = await prisma.labUser.create({ data: { email, password: hashed } });
    const token = signToken({ id: user.id, role: 'user' });
    const res = NextResponse.json({ ok: true });
    res.cookies.set('token', token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 });
    // check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: { name, email, password, phone },
    });

    // issue JWT
    const token = jwt.sign({ uid: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    const res = NextResponse.json({ success: true, user });
    res.cookies.set('token', token, { httpOnly: true, sameSite: 'lax', path: '/' });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
