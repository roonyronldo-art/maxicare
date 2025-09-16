'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function LabLoginLocale() {
  const { t } = useTranslation();
  const loginLabel = t('login', { defaultValue: 'Login' });
  const params = useParams();
  const locale = params?.locale;
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/lab/login', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      // save creds
      if (data?.token) localStorage.setItem('labToken', data.token);
      if (data?.user) localStorage.setItem('labUser', JSON.stringify(data.user));
      // role-based redirect
      if (data?.user?.role === 'admin') {
        router.push(locale ? `/${locale}/lab/admin` : '/lab/admin');
      } else {
        router.push(locale ? `/${locale}/lab/dashboard` : '/lab/dashboard');
      }
    } catch (err) {
      setError(err.message || 'خطأ في تسجيل الدخول');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#ffd15c]" suppressHydrationWarning>
          {t('login', { defaultValue: 'Login' })}
        </h1>
        <form onSubmit={handleSubmit} className="bg-black border-2 border-[#ffd15c] shadow-lg rounded p-6 space-y-4 text-[#ffd15c]">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t('email', { defaultValue: 'Email' })}
            className="input input-bordered w-full bg-black border-2 border-[#ffd15c] text-[#ffd15c] placeholder-[#ffd15c]/70"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={t('password', { defaultValue: 'Password' })}
            className="input input-bordered w-full bg-black border-2 border-[#ffd15c] text-[#ffd15c] placeholder-[#ffd15c]/70"
          />
          {error && <p className="text-error" suppressHydrationWarning>{error}</p>}
          <button type="submit" className="bg-black border-2 border-[#ffd15c] text-[#ffd15c] hover:bg-black/80 font-extrabold py-2 px-4 rounded w-full" suppressHydrationWarning>
            {t('submit', { defaultValue: 'Submit' })}
          </button>
        </form>
      </div>
    </main>
  );
}
