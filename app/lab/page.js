'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { pb } from '@/lib/pocketbase';
import useConfig from '@/lib/useConfig';

export default function Home() {
  const { locale } = useParams() || {};
  const isAr = locale === 'ar';

  const { config, isLoading, error } = useConfig();
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        فشل تحميل الإعدادات: {error.message}
      </div>
    );
  if (isLoading || !config)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading…
      </div>
    );

  const imgUrl = (file, fallback) =>
    file ? pb.files.getUrl(config, file) : fallback;

  const cards = [
    {
      en: 'Clinic',
      ar: 'العيادة',
      img: imgUrl(config.homeClinicImg, '/images/clinic.jpg'),
      href: '/en/clinic',
    },
    {
      en: 'Lab',
      ar: 'المعمل',
      img: imgUrl(config.homeLabImg, '/images/lab.jpg'),
      href: '/en/lab',
    },
    {
      en: 'Education',
      ar: 'التعليم',
      img: imgUrl(config.homeEduImg, '/images/education.jpg'),
      href: '/en/education',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="grid gap-6 w-full max-w-6xl md:grid-cols-3 px-4">
        {cards.map(({ en, ar, img, href }) => (
          <Link
            key={href}
            href={href}
            className="relative h-64 w-full group overflow-hidden rounded-lg shadow-lg"
          >
            <Image
              src={img}
              alt={en}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
            {/* غطاء داكن + النص */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-2xl font-bold tracking-wide">
                {isAr ? ar : en}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}