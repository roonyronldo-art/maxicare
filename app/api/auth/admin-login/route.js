export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { signAdminToken } from '../../../../lib/auth';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'clinicadmin123';

export async function POST(request) {
  try {
    const { password } = await request.json();
    if (!password) {
      return NextResponse.json({ error: 'Missing password' }, { status: 400 });
    }
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const token = signAdminToken();
    const res = NextResponse.json({ success: true });
    res.cookies.set('admin_token', token, { httpOnly: true, sameSite: 'lax', path: '/' });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
