import { NextResponse } from 'next/server';
import PocketBase from 'pocketbase';
import ensureLabAdmin from '../../../../../../lib/initLabAdmin';

export async function POST(request, contextPromise) {
  try {
    await ensureLabAdmin().catch(() => {});

    const pathname = new URL(request.url).pathname;
    const userId = pathname.split('/').at(-2);
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    // generate random 10-char password
    const newPass = Math.random().toString(36).slice(-10);

    const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090');
    // admin auth
    try {
      const aEmail = process.env.PB_ADMIN_EMAIL || 'adminlab@lab.com';
      const aPass = process.env.PB_ADMIN_PASS || '12345678';
      await pb.admins.authWithPassword(aEmail, aPass);
    } catch (e) {
      console.warn('admin auth failed', e?.message);
    }

    await pb.collection('lab_users').update(userId, {
      password: newPass,
      passwordConfirm: newPass,
    });

    return NextResponse.json({ newPassword: newPass });
  } catch (err) {
    console.error('reset password error', err?.response?.data || err);
    return NextResponse.json({ error: 'Failed', detail: err?.response?.data || err?.message }, { status: 500 });
  }
}
