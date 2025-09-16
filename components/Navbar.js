'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useConfig from '@/lib/useConfig';
import LanguageSwitcher from './LanguageSwitcher';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

console.log('ENV_KEY', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

export default function Navbar() {
  const router = useRouter();
  const { config } = useConfig();
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const c = document.cookie;
      setAuth(c.includes('token=') || c.includes('loggedIn=1') || c.includes('labAdmin=1'));
    }
  }, []);
  const { t } = useTranslation();
  const params = useParams();
  const locale = params?.locale || 'en';
  const base = `/${locale}`;

  const links = ['home', 'clinic', 'lab', 'education', 'contact'];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-stretch justify-between h-10 px-4 shadow bg-black shadow-lg">
      <div className="flex space-x-4 items-stretch">
        {links.map((key) => (
          <Link key={key} href={`${base}/${key === 'home' ? '' : key}`} className="h-full flex items-center px-4 border-2 border-transparent transition hover:border-[#ffd15c] hover:bg-black/10">
            <span data-field={`nav_${key}`} className="text-[#ffd15c] font-extrabold" suppressHydrationWarning>{config[`nav_${key}`] || key.charAt(0).toUpperCase()+key.slice(1)}</span>
          </Link>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        {auth && (
          <button
            onClick={() => {
              document.cookie = 'token=; Max-Age=0; path=/';
              document.cookie = 'labAdmin=; Max-Age=0; path=/';
              document.cookie = 'loggedIn=; Max-Age=0; path=/';
              localStorage.removeItem('labUser');
              localStorage.removeItem('labToken');
              router.replace(base + '/');
            }}
            className="text-[#ffd15c] border-2 border-[#ffd15c] px-3 py-1 rounded hover:bg-[#ffd15c]/20"
          >
            Logout
          </button>
        )}
        <LanguageSwitcher />
      </div>
    </nav>
  );
}