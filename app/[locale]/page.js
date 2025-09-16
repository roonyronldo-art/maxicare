'use client';
import { useTranslation } from 'react-i18next';
import HeroSection from '../../components/HeroSection';
import ImageCarousel from '../../components/ImageCarousel';
import SectionCards from '../../components/SectionCards';
import Footer from '../../components/Footer';

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <>
      <HeroSection />
      <SectionCards />
      <Footer />
    </>
  );
}
