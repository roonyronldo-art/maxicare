import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function POST(request) {
  try {
    const { email, code, name, password } = await request.json();
    if (!email || !code || !name || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const emailCode = await prisma.emailCode.findFirst({ where: { email, code, verified: false } });
    if (!emailCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }
    if (emailCode.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Code expired' }, { status: 400 });
    }

    // mark as verified
    await prisma.emailCode.update({ where: { id: emailCode.id }, data: { verified: true } });

    // create user
    const user = await prisma.user.create({
      data: { name, email, password },
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
