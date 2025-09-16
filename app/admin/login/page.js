'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/pocketbase';
import Head from 'next/head';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { record } = await pb
        .collection('users')
        .authWithPassword(form.email.trim(), form.password.trim());
      if (record.role !== 'admin') {
        throw new Error('ليست لديك صلاحيات المشرف');
      }
      router.replace('/admin/design');
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول');
      pb.authStore.clear();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login | Maxicare</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white shadow-md rounded px-8 py-6 space-y-4"
        >
          <h1 className="text-xl font-bold text-center mb-4">Admin Login</h1>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {loading ? 'Logging in…' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </>
  );
}
