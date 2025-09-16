import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { email, password, name, phone, address, age } = await req.json();

    // validate required fields
    if (!email || !password || !phone || !address) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const exists = await prisma.labUser.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: 'Email exists' }, { status: 409 });

    const hashed = await hashPassword(password);

    const user = await prisma.labUser.create({
      data: {
        email,
        password: hashed,
        name: name || '',
        phone,
        address,
        age: age ? Number(age) : null,
      },
    });

    // issue token cookie so user is logged in after registration
    const token = signToken({ id: user.id, role: 'user' });
    const res = NextResponse.json({ id: user.id }, { status: 201 });
    res.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    });
    return res;
  } catch (err) {
    console.error('request error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}