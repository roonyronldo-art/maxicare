'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    setLoading(false);
    if (res.ok) router.push('/en/clinic');
    else alert('Registration failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form onSubmit={submit} className="bg-black border-2 border-[#ffd15c] p-8 rounded-lg w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-[#ffd15c] text-center">Register</h1>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full p-2 rounded bg-gray-800 text-white" />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full p-2 rounded bg-gray-800 text-white" />
        <button disabled={loading} className="w-full bg-[#ffd15c] text-black py-2 rounded font-bold hover:bg-yellow-400">{loading?'...':'Register'}</button>
      </form>
    </div>
  );
}
