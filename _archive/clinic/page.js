'use client';
import ClinicInfoCarousel from '../../../components/ClinicInfoCarousel';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function ClinicPage() {
  const { t, i18n } = useTranslation();

  const carouselItems = [
    { video: "/clinic/clinic1.mp4" },
    { img: "/carousel-clinic-img1.jpg", alt: "Clinic service 1" },
    { img: "/carousel-clinic-img2.jpg", alt: "Clinic service 2" },
    { img: "/carousel-clinic-img3.jpg", alt: "Clinic service 3" },
  ];

  return (
    <main className="clinic-bg min-h-screen">

      {/* Intro */}
            <section className="w-full px-6 pt-4 space-y-6 flex flex-col items-end">
        {/* Info Carousel */}
        <ClinicInfoCarousel items={carouselItems} />

                <div className="flex items-center gap-1 flex-wrap mt-4 -mr-4">
          <span className="text-[#ffd15c] text-lg font-bold flex items-center">
            To book, you must
            <svg className="w-10 h-10 -ml-5 animate-[wiggle_1s_ease-in-out_infinite]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#ffd15c" />
      <stop offset="100%" stopColor="#ff9f1c" />
    </linearGradient>
    <style>{`@keyframes wiggle{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}`}</style>
  </defs>
  <path d="M5 24H43" stroke="url(#grad)" strokeWidth="4" strokeLinecap="round"/>
  <path d="M32 12L44 24L32 36" stroke="url(#grad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
          </span>
          <Link
            href={`/${i18n.language}/clinic/register`}
            className="bg-black border-2 border-black text-[#ffd15c] font-extrabold px-8 py-3 text-lg rounded-lg shadow-lg hover:bg-[#ffd15c] hover:text-black"
            suppressHydrationWarning
          >
            {t('register', 'Register')}
          </Link>
          <span className="text-[#ffd15c] text-lg font-bold flex items-center ml-1">
            and then
            <svg className="w-10 h-10 -ml-5 animate-[wiggle_1s_ease-in-out_infinite]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffd15c" />
                  <stop offset="100%" stopColor="#ff9f1c" />
                </linearGradient>
              </defs>
              <path d="M5 24H43" stroke="url(#grad2)" strokeWidth="4" strokeLinecap="round"/>
              <path d="M32 12L44 24L32 36" stroke="url(#grad2)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <Link
            href={`/${i18n.language}/clinic/login`}
            className="bg-black border-2 border-black text-[#ffd15c] font-extrabold px-8 py-3 text-lg rounded-lg shadow-lg hover:bg-[#ffd15c] hover:text-black"
            suppressHydrationWarning
          >
            {t('login', 'Login')}
          </Link>
          <span className="text-[#ffd15c] text-lg font-bold ml-1">to complete the booking.</span>
        </div>
      </section>

    </main>
  );
}