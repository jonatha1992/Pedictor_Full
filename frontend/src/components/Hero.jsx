// src/components/Hero.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import backgroundImage from "../assets/hero.webp"; // Asegúrate de ajustar la ruta según la ubicación de tu imagen

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section
      className="py-20 text-center text-white bg-center bg-cover border border-green-700 shadow-2xl rounded-xl bg-gradient-to-br from-green-800 to-green-900"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h1 className="inline-block px-6 py-2 mb-4 text-5xl font-extrabold border-2 rounded-full shadow-md drop-shadow-lg text-highlight bg-black/40 border-highlight" style={{ letterSpacing: '0.08em' }}>¡Predice y Gana!</h1>
      <p className="inline-block px-4 py-2 mb-8 text-xl rounded-lg drop-shadow text-white/90 bg-black/30">Únete a nuestra app para obtener las mejores predicciones para la ruleta.</p>
      <a
        href="#precios"
        onClick={e => {
          e.preventDefault();
          const el = document.getElementById('precios');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        className="inline-flex items-center justify-center px-6 py-2 mx-auto mt-4 text-base font-bold tracking-wide transition-colors bg-white border-2 rounded-full shadow-lg text-primary hover:bg-highlight hover:text-white border-highlight"
        style={{ boxShadow: '0 2px 12px 0 #f7d43180' }}
      >
        <span className="drop-shadow">Suscribirse Ahora</span>
      </a>
    </section>
  );
};

export default Hero;
