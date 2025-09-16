'use client';

import Link from 'next/link';
export const dynamic = 'force-dynamic';

export default function ClinicHome() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Clinic Section</h1>
      <p className="mb-6 text-center max-w-md">
        Welcome to the Clinic section. This placeholder page restores the previous route so that
        /en/clinic no longer returns a 404. You can customise this content later.
      </p>
      <Link href="/en" className="underline text-[#ffd15c]">← Back to Home</Link>
    </main>
  );
}
