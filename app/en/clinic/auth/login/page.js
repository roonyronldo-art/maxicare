'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Clinic Login Page (EN)
export default function ClinicLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Login failed');
      }
      // Redirect to booking page after login
      router.replace('/en/clinic/book');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-[#ffd15c] p-4">
      <div className="w-full max-w-md border-2 border-[#ffd15c] rounded p-6 bg-black">
        <h1 className="text-2xl font-bold mb-4 text-center">Clinic Login</h1>

        {error && (
          <div className="mb-3 text-red-400 text-sm" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-[#ffd15c] bg-black text-[#ffd15c] px-3 py-2"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-[#ffd15c] bg-black text-[#ffd15c] px-3 py-2"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-black border-2 border-[#ffd15c] text-[#ffd15c] font-extrabold px-4 py-2 rounded disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <a href="/en/clinic/auth/register" className="underline">Create an account</a>
        </div>
      </div>
    </div>
  );
}