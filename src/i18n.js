import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from 'locales/en';
import fr from 'locales/fr';

const options = {
  // order and from where user language should be detected
  order: ['subdomain', 'navigator', 'path', 'querystring', 'cookie', 'localStorage', 'htmlTag'],

  // keys or params to lookup language from
  lookupQuerystring: 'lng',
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,

  // cache user language on
  caches: ['localStorage', 'cookie'],
  excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

  // optional expire and domain for set cookie
  cookieMinutes: 10,
  cookieDomain: 'myDomain',

  // optional htmlTag with lang attribute, the default is:
  htmlTag: document.documentElement,
};

i18n
  .use(LanguageDetector)
  .init({
    detection: options,
    // we init with resources
    resources: { en, fr },
    fallbackLng: 'en',
    debug: false,

    // have a common namespace used around the full app
    nsMode: 'default',
    ns: [
      'error',
      'profileTranslations',
      'profileContactTranslations',
      'headerTranslations',
    ],
    defaultNS: 'profileTranslations',

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ',',
    },

    react: {
      wait: true,
    },
  });

export default i18n;
