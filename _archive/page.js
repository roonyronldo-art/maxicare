'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const metadata = {
  title: 'تسجيل مستخدم معمل | Maxicare',
};

export default function LabRegister() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/lab/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      // auto-login now
      const loginRes = await fetch('/api/lab/login', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (!loginRes.ok) {
        router.push('/lab/auth/login');
      } else {
        const loginData = await loginRes.json().catch(()=>null);
        if (loginData?.token) localStorage.setItem('labToken', loginData.token);
        router.push('/lab/dashboard');
      }
    } catch (err) {
      setError(err.message || 'حدث خطأ');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">تسجيل مستخدم جديد</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'email', 'phone', 'address', 'password'].map((field) => (
          <input
            key={field}
            type={field === 'password' ? 'password' : 'text'}
            name={field}
            required
            placeholder={{
              name: 'الاسم',
              email: 'البريد الإلكتروني',
              phone: 'رقم الهاتف',
              address: 'العنوان',
              password: 'كلمة المرور',
            }[field]}
            value={form[field]}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        ))}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90"
        >
          تسجيل
        </button>
      </form>
    </div>
  );
}
