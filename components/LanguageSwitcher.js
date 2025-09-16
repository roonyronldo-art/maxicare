'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams() || {};

  const toggleLang = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    // Set cookie so that SSR picks correct locale on next load
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/`;
    // Rebuild path with new locale
    const pathParts = pathname.split('/');
    if (pathParts[1] === 'ar' || pathParts[1] === 'en') {
      pathParts[1] = nextLocale;
    } else {
      pathParts.splice(1, 0, nextLocale);
    }
    router.push(pathParts.join('/'));
  };

  return (
    <button onClick={toggleLang} className="px-6 py-2 text-sm font-extrabold border border-[#ffd15c] rounded text-[#ffd15c]">
      {locale === 'ar' ? 'English' : 'العربية'}
    </button>
  );
}
