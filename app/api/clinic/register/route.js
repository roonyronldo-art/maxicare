import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { name, email, password, age, address } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const existing = await prisma.labUser.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: 'Email exists' }, { status: 409 });

    const hashed = await hashPassword(password);
    const user = await prisma.labUser.create({
      data: {
        email,
        password: hashed,
        name,
        age: age ? Number(age) : null,
        address,
        role: 'user',
      },
    });

    const token = signToken({ id: user.id, role: user.role });
    const res = NextResponse.json({ id: user.id });
    res.cookies.set('token', token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
