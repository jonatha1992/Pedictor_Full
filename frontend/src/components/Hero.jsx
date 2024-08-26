// src/components/Hero.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import backgroundImage from "../assets/hero.webp"; // Asegúrate de ajustar la ruta según la ubicación de tu imagen

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section
      className="text-center py-20 text-white bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h1 className="text-5xl font-bold mb-4">{t("title")}</h1>
      <p className="text-xl mb-8">{t("description")}</p>
      <button className="bg-highlight text-primary px-6 py-3 rounded-full font-bold hover:bg-white hover:text-secondary">
        {t("subscribeButton")}
      </button>
    </section>
  );
};

export default Hero;
