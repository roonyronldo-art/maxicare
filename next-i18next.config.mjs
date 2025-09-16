/**
 * next-i18next configuration
 * See: https://github.com/i18next/next-i18next#usage-with-app-router
 */

const i18nConfig = {
  defaultNS: "translation",
  ns: ["translation"],
  i18n: {
  debug: false,
  defaultLocale: "en",
  locales: ["en", "ar"],
  localeDetection: true,
  },
};

export default i18nConfig;
