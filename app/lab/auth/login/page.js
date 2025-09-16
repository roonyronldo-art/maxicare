'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LabLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/lab/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('lab_token', data.token);
        }
      }
      router.push('/lab/dashboard');
    } catch (err) {
      setError(err.message || 'خطأ في تسجيل الدخول');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">تسجيل الدخول</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          name="password"
          placeholder="كلمة المرور"
          required
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90"
        >
          دخول
        </button>
      </form>
    </div>
  );
}
