'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const ADMIN_KEY = process.env.NEXT_PUBLIC_LAB_ADMIN_KEY || 'labadmin';

export default function LabAdminLogin() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale;
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (key.trim() === ADMIN_KEY) {
      document.cookie = `labAdmin=1; path=/; max-age=${60 * 60 * 8}`; // 8h
      const dest = locale ? `/${locale}/lab/admin` : '/lab/admin';
      router.push(dest);
    } else {
      setError('Invalid admin key');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-[#ffd15c] p-4">
      <form onSubmit={submit} className="bg-black border-2 border-[#ffd15c] p-8 rounded w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Lab Admin Login</h1>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Admin Key"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button className="w-full bg-[#ffd15c] text-black py-2 rounded font-bold hover:bg-yellow-400">Enter</button>
      </form>
    </main>
  );
}
