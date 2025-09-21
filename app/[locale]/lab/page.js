'use client';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

export default function LabPage() {
    const { t } = useTranslation();
  const registerLabel = 'Register';
  const loginLabel = 'Login';
  const { locale } = useParams();

  // Use existing assets from /public to avoid 404s in production
  const slides = [
    { type: 'image', src: '/carousel-clinic-img1.jpg' },
    { type: 'image', src: '/carousel-clinic-img2.jpg' },
    { type: 'image', src: '/carousel-clinic-img3.jpg' },
    { type: 'image', src: '/lab_new.jpg' },
  ];
  const [idx, setIdx] = useState(0);
  const [muted, setMuted] = useState(true);

  const next = () => setIdx((idx + 1) % slides.length);
  const prev = () => setIdx((idx - 1 + slides.length) % slides.length);

  return (
    <div className="flex flex-col items-end gap-8 py-10 px-4 w-auto ml-auto">
      {/* Carousel */}
      <div className="relative w-full lg:w-1/2 h-64 sm:h-80 lg:h-96 overflow-hidden shadow-lg rounded-lg lg:ml-auto">
        {slides[idx].type === 'image' ? (
          <Image src={slides[idx].src} alt="Lab" fill className="object-cover" />
        ) : (
          <video
            src={slides[idx].src}
            muted={muted}
            autoPlay
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {/* Arrows */}
        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60">‹</button>
        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60">›</button>
        {/* Mute toggle for video */}
        {slides[idx].type === 'video' && (
          <button
            onClick={() => setMuted(!muted)}
            className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            {muted ? '🔇' : '🔊'}
          </button>
        )}
        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {slides.map((_, i) => (
            <span key={i} className={`h-2 w-2 rounded-full ${i===idx?'bg-[#ffd15c]':'bg-white/60'}`} />
          ))}
        </div>
      </div>
      {/* Login/Register Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-1/2 lg:mr-64 justify-end text-right">
        <Link
          href={`/${locale}/lab/auth/register`}
          className="bg-black border-2 border-black text-[#ffd15c] font-extrabold px-8 py-3 text-lg rounded-lg shadow-lg hover:bg-[#ffd15c] hover:text-black"
        >
          {registerLabel}
        </Link>
        <Link
          href={`/${locale}/lab/auth/login`}
          className="bg-black border-2 border-black text-[#ffd15c] font-extrabold px-8 py-3 text-lg rounded-lg shadow-lg hover:bg-[#ffd15c] hover:text-black"
        >
          {loginLabel}
        </Link>
      </div>
    </div>
  );
}
