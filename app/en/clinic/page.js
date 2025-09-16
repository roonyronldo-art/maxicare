'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const slides = [
  { type: 'video', src: '/clinic/slide1.mp4' },
  { type: 'image', src: '/clinic/slide2.jpg' },
  { type: 'image', src: '/clinic/slide3.jpg' },
];

export default function ClinicPage() {
  const [idx, setIdx] = useState(0);
  const [muted, setMuted] = useState(true);

  const next = () => setIdx((idx + 1) % slides.length);
  const prev = () => setIdx((idx - 1 + slides.length) % slides.length);

  return (
    <div className="relative min-h-screen text-white overflow-hidden pt-16 bg-[url('/lab/bg.jpg')] bg-cover bg-center bg-no-repeat">

      <div className="relative z-10 flex flex-col items-end gap-8 py-0 px-4 w-auto ml-auto">
        {/* سلايدر يدوي – نفس تقسيمة lab */}
        <div className="relative w-full lg:w-1/2 h-64 sm:h-80 lg:h-96 overflow-hidden shadow-lg rounded-lg lg:ml-auto">
          {slides[idx].type === 'image' ? (
            <Image src={slides[idx].src} alt="Clinic" fill className="object-cover" />
          ) : (
            <video
              src={slides[idx].src}
              muted={muted}
              autoPlay
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-contain bg-black"
            />
          )}

          {/* أسهم تنقّل */}
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60">‹</button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60">›</button>

          {/* زر كتم الفيديو */}
          {slides[idx].type === 'video' && (
            <button onClick={() => setMuted(!muted)} className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
              {muted ? '🔇' : '🔊'}
            </button>
          )}

          {/* نقاط (dots) */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {slides.map((_, i) => (
              <span key={i} className={`h-2 w-2 rounded-full ${i === idx ? 'bg-[#ffd15c]' : 'bg-white/60'}`} />
            ))}
          </div>
        </div>

        {/* أزرار Register / Login */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-1/2 lg:mr-64 justify-end">
          <Link href="/en/clinic/auth/register" className="bg-black border-2 border-black text-[#ffd15c] font-extrabold px-8 py-3 text-lg rounded-lg shadow-lg hover:bg-[#ffd15c] hover:text-black">
            Register
          </Link>
          <Link href="/en/clinic/auth/login" className="bg-black border-2 border-black text-[#ffd15c] font-extrabold px-8 py-3 text-lg rounded-lg shadow-lg hover:bg-[#ffd15c] hover:text-black">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}