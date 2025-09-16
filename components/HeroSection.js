"use client";
import Image from "next/image";
import useConfig from '@/lib/useConfig';
import { pb } from '@/lib/pocketbase';
import { useTranslation } from "react-i18next";
import Link from "next/link";
import ImageCarousel from "./ImageCarousel";

export default function HeroSection() {
  const { config } = useConfig();
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden min-h-[50vh] flex flex-col items-start justify-start pt-32">
      {/* Background image */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
      <Image quality={100} data-field="hero_image" style={{ objectPosition: 'center 0px' }}
        src={
          config?.hero_image
            ? (config.hero_image.startsWith('http') || config.hero_image.startsWith('/')
                ? config.hero_image
                : pb.files.getURL(config, config.hero_image))
            : "/hero-new-home.jpg"
        }
        alt="Hero"
        fill
        priority
        className="object-cover w-full h-full animate-slow-zoom "
      />
      </div>

      {/* Carousel on right */}
      <div className="absolute top-8 right-32 w-96 md:w-[32rem] lg:w-[36rem] z-30">
        <ImageCarousel />
      </div>
      {/* Dim overlay */}
      
      <div className="relative z-20 container mx-auto px-4 text-center">
        <h1 data-field="hero_title"
          className="mb-4 text-4xl font-extrabold md:text-5xl lg:text-6xl"
          suppressHydrationWarning
        >
          {config?.hero_title ?? ''}
        </h1>
        <p data-field="hero_subtitle" className="mb-8 text-lg opacity-80" suppressHydrationWarning>
          {config?.hero_subtitle ?? ''}
        </p>
        <Link data-field="hero_btn"
          href={config?.hero_button_url ?? "#sections"}
          className="btn btn-primary"
          suppressHydrationWarning
        >
          {config?.hero_button_text ?? ''}
        </Link>
      </div>
    </section>
  );
}
