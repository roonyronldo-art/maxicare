'use client';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';



export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const pwd = form.password.value;
    const confirm = form.confirmPassword.value;
    if (!phone || !email) {
      setError(t('missing_fields') || 'Missing fields');
      return;
    }
    if (pwd !== confirm) {
      setError(t('password_mismatch'));
      return;
    }
    try {
              const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone,
            name: form.name.value,
            email,
            password: pwd,
          }),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error || 'Registration failed');
          return;
        }
        alert(t('registration_success') || 'تم التسجيل بنجاح، سجِّل الدخول');
        router.push(`/${i18n.language}/clinic/login`);
        return;
    } catch (err) {
      setError(err.message);
      return;
    }
    
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mt-48">
        
        <form onSubmit={handleSubmit} className="bg-black border-2 border-[#ffd15c] shadow-lg rounded px-6 pt-4 pb-6 space-y-4 text-[#ffd15c]">
          <h1 className="text-2xl font-bold text-center mb-4 text-[#ffd15c]" suppressHydrationWarning>
            {t('register')}
          </h1>
          <input suppressHydrationWarning
            type="text"
            name="name"
            placeholder={t('name')}
            className="input input-bordered w-full bg-black border-2 border-[#ffd15c] text-[#ffd15c] placeholder-[#ffd15c]/70"
          />
          
          <input suppressHydrationWarning
            type="number"
            name="age"
            placeholder={t('age')}
            className="input input-bordered w-full bg-black border-2 border-[#ffd15c] text-[#ffd15c] placeholder-[#ffd15c]/70"
          />
          <input suppressHydrationWarning
             type="tel"
             name="phone"
             placeholder={t('mobile', { defaultValue: 'Mobile Number' })}
             className="input input-bordered w-full bg-black border-2 border-[#ffd15c] text-[#ffd15c] placeholder-[#ffd15c]/70"
           />

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
          <input suppressHydrationWarning
            type="password"
            name="confirmPassword"
            placeholder={t('confirm_password')}
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
