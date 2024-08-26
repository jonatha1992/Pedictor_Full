// src/config/i18n.jsx
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector) // Optional: detect user language
  .use(initReactI18next) // Connects React to i18next
  .init({
    supportedLngs: ["en", "es"], // List of supported languages
    fallbackLng: "en", // Fallback language if the user language is not available
    detection: {
      order: [
        "path",
        "cookie",
        "htmlTag",
        "localStorage",
        "sessionStorage",
        "navigator",
        "querystring",
      ],
      caches: ["cookie"],
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Path to your translation files
    },
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    resources: {
      en: {
        translation: {
          title: "Predict and Win!",
          description: "Join our app to get the best predictions for roulette.",
          subscribeButton: "Subscribe Now",
        },
      },
      es: {
        translation: {
          title: "¡Predice y Gana!",
          description:
            "Únete a nuestra app para obtener las mejores predicciones para la ruleta.",
          subscribeButton: "Suscribirse Ahora",
        },
      },
    },
  });

export default i18n;
