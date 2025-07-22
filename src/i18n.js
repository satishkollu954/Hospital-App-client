import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import hi from "./locales/hi/translation.json";
import te from "./locales/te/translation.json";

i18n
  .use(LanguageDetector) // detects browser or saved language
  .use(initReactI18next) // passes i18n to react-i18next
  .init({
    fallbackLng: "en",
    debug: false,
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      te: { translation: te },
    },
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;
