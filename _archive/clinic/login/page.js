'use client';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';





export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState('');
  

  const ADMIN_EMAIL = 'admin2563@clinic.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    e.preventDefault();
    const form = e.target;
    const email = form.email.value.trim();
    const pwd = form.password.value.trim();
    if (!email || !pwd) {
      setError(t('missing_fields'));
      return;
    }
    
    try {
      const endpoint = '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pwd }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Failed to authenticate');
        return;
      }
      alert(t('login_success'));
      // check if user has previous appointments
      // TODO: query user's appointments from internal DB when implemented
      const hasVisits = false;
      if (email === ADMIN_EMAIL) {
          router.push('/clinic/admin/dashboard');
          return;
        }
      router.push(`/${i18n.language}/clinic/${hasVisits ? 'history' : 'booking'}`);
      return;
    } catch (err) {
      setError(err.message);
      return;
    }
    
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#ffd15c]" suppressHydrationWarning>
          {t('login')}
        </h1>
        <form onSubmit={handleSubmit} className="bg-black border-2 border-[#ffd15c] shadow-lg rounded p-6 space-y-4 text-[#ffd15c]">
          <input suppressHydrationWarning
            type="email"
            name="email"
            placeholder={t('email')}
            className="input input-bordered w-full bg-black border-2 border-[#ffd15c] text-[#ffd15c] placeholder-[#ffd15c]/70"
          />
          
             
             
          <input suppressHydrationWarning
            type="password"
            name="password"
            placeholder={t('password')}
            className="input input-bordered w-full bg-black border-2 border-[#ffd15c] text-[#ffd15c] placeholder-[#ffd15c]/70"
          />
          {error && <p className="text-error" suppressHydrationWarning>{error}</p>}
          <button type="submit" className="bg-black border-2 border-[#ffd15c] text-[#ffd15c] hover:bg-black/80 font-extrabold py-2 px-4 rounded w-full" suppressHydrationWarning>
            {t('submit')}
          </button>
        </form>
      </div>
    </main>
  );
}
