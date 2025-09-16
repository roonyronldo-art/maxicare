// app/api/lab/adminCreds/route.js
import ensureLabAdmin from '@/lib/initLabAdmin.js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const creds = await ensureLabAdmin();
    return NextResponse.json({ success: true, ...creds });
  } catch (err) {
    console.error('adminCreds route error', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
