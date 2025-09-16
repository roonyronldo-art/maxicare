'use client';
import { appWithTranslation } from 'next-i18next';
import i18nConfig from '../next-i18next.config.mjs';

import { useLayoutEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

function BaseProvider({ children }) {
  const params = useParams();
  const pathname = usePathname();
  const { i18n } = useTranslation();

  // Determine current locale from params or pathname
  const localeFromRoute = params?.locale || pathname.split('/')[1] || 'en';

  // Ensure correct language during SSR & first render
  if (i18n.language !== localeFromRoute) {
    i18n.changeLanguage(localeFromRoute);
  }

  useLayoutEffect(() => {
    if (i18n.language !== localeFromRoute) {
      i18n.changeLanguage(localeFromRoute);
    }
  }, [localeFromRoute, i18n]);
  return children;
}

// Wrap BaseProvider with next-i18next's HOC
const I18nProvider = appWithTranslation(BaseProvider, i18nConfig);

export default I18nProvider;
