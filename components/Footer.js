"use client";
import { useTranslation } from "react-i18next";
import useConfig from '@/lib/useConfig';

export default function Footer() {
  const { config } = useConfig();
  const { t } = useTranslation();
  return (
    <footer className="bg-base-200 py-8 mt-16">
      <div className="container mx-auto px-4 text-center">
        <h3 className="mb-4 text-xl font-semibold" suppressHydrationWarning>
          {config.contact_title ?? ''}
        </h3>
        <p className="mb-2">📞 +20 100 000 0000</p>
        <p className="mb-4">✉️ info@maxicare.com</p>
        <p className="text-sm opacity-70" suppressHydrationWarning>
          © {new Date().getFullYear()} {config.footer_brand ?? ''} — {config.rights_reserved ?? ''}
        </p>
      </div>
    </footer>
  );
}
