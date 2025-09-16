'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push('/clinic/admin/dashboard');
    } else {
      const data = await res.json();
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/hero-new-home.jpg')] bg-cover p-4" style={{backgroundPosition:'center -320px'}}>
      <form
        onSubmit={handleSubmit}
        className="bg-black border-2 border-[#ffd15c] shadow-lg rounded px-8 pt-6 pb-8 w-full max-w-sm mt-24 text-[#ffd15c]"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
        {error && (
          <p className="mb-4 text-red-600 text-center text-sm">{error}</p>
        )}
        <div className="mb-4">
          <label className="block text-[#ffd15c] text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border-2 border-[#ffd15c] rounded w-full py-2 px-3 bg-black text-[#ffd15c] placeholder-[#ffd15c]/70 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-black hover:bg-black/80 text-[#ffd15c] font-extrabold border-2 border-[#ffd15c] py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Login
        </button>
      </form>
    </div>
  );
}
