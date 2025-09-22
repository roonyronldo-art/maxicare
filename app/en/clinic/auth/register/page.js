'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClinicRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !age || !address) {
      setError('Please fill all fields');
      return;
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, age, address }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || data.detail || 'Registration failed');
        return;
      }
      router.push('/en/clinic/auth/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-gray-900 p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Clinic Register</h1>
        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        <label className="block mb-3 text-sm">
          Name
          <input
            type="text"
            className="mt-1 w-full px-3 py-2 rounded bg-gray-800 border border-gray-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block mb-3 text-sm">
          Email
          <input
            type="email"
            className="mt-1 w-full px-3 py-2 rounded bg-gray-800 border border-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block mb-3 text-sm">
          Age
          <input
            type="number"
            min="0"
            className="mt-1 w-full px-3 py-2 rounded bg-gray-800 border border-gray-700"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </label>
        <label className="block mb-3 text-sm">
          Address
          <textarea
            className="mt-1 w-full px-3 py-2 rounded bg-gray-800 border border-gray-700"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <label className="block mb-4 text-sm">
          Password
          <input
            type="password"
            className="mt-1 w-full px-3 py-2 rounded bg-gray-800 border border-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="w-full bg-[#ffd15c] text-black font-bold py-2 rounded">
          Register
        </button>
        <p className="text-xs text-center mt-3">
          Already have an account?{' '}
          <a href="/en/clinic/auth/login" className="underline text-[#ffd15c]">
            Login
          </a>
        </p>
      </form>
    </main>
  );
}
