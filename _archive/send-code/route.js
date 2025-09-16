export const runtime = 'nodejs';
import { NextResponse } from 'next/server';

// This endpoint has been deprecated. Email/SMS verification removed.
export async function POST() {
  return NextResponse.json({ error: 'Endpoint removed' }, { status: 404 });
}


// Deprecated endpoint: email/SMS verification removed.
// Always respond 404.

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'Endpoint removed' }, { status: 404 });
}
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    : null;

// legacy code removed
// (no implementation)
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // save to DB (replace any previous unverified codes for same phone)
    await prisma.emailCode.deleteMany({ where: { email } }).catch(() => {});
    await prisma.emailCode.create({ data: { email, code, expiresAt } });

    // send Email (or fallback)
    if (transport) {
      await transport.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Your verification code',
        text: `Your verification code is ${code}`,
      });
    } else {
      console.log(`DEBUG EMAIL to ${email}: ${code}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
