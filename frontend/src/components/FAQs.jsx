// src/components/FAQs.jsx
import React from "react";

const FAQs = () => {
  const faqs = [
    {
      question: "¿Cómo funciona la app?",
      answer: "Nuestra app utiliza algoritmos avanzados de Deep Learning (aprendizaje profundo) para analizar patrones en los resultados de la ruleta y generar predicciones con mayor precisión que los métodos tradicionales.",
    },
    {
      question: "¿En qué se basa la tecnología de predicción?",
      answer: "Utilizamos redes neuronales profundas entrenadas con miles de resultados reales de ruleta. Nuestro sistema identifica patrones imperceptibles para el ojo humano, lo que nos permite ofrecer predicciones más precisas.",
    },
    {
      question: "¿Hay prueba gratuita?",
      answer: "Sí, ofrecemos una prueba gratuita de 24 horas para que puedas experimentar la potencia de nuestra tecnología antes de suscribirte.",
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos todas las tarjetas de crédito principales, transferencias bancarias y métodos de pago locales a través de MercadoPago.",
    },
    {
      question: "¿Funciona en todos los casinos?",
      answer: "Nuestro predictor está diseñado para funcionar con la mayoría de los sistemas de ruleta física y online. Los resultados pueden variar dependiendo del tipo de ruleta y casino.",
    },
    {
      question: "¿Puedo usar la app en mi dispositivo móvil?",
      answer: "Sí, nuestra aplicación está optimizada para funcionar perfectamente tanto en dispositivos móviles como en ordenadores de escritorio.",
    },
  ];
  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-gray-900 to-green-900 text-white rounded-xl shadow-2xl border border-green-700">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-10 text-3xl font-extrabold text-highlight drop-shadow-lg text-center bg-black/60 px-6 py-2 rounded-full border-2 border-highlight inline-block mx-auto">Preguntas Frecuentes</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {faqs.map((faq, index) => (
            <div key={index} className="p-6 bg-gradient-to-br from-black via-green-900 to-green-800 rounded-xl shadow-xl border-2 border-green-700 flex flex-col gap-3 transition-transform hover:scale-105 hover:shadow-2xl">
              <h3 className="text-lg font-bold text-highlight drop-shadow bg-black/60 px-4 py-2 rounded-full border border-highlight inline-block mx-auto text-center">{faq.question}</h3>
              <p className="text-white/90 text-base text-center bg-black/30 px-4 py-3 rounded-lg">{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="inline-block px-6 py-3 text-lg bg-black/50 rounded-xl border border-green-700 shadow-lg">
            ¿Tienes más preguntas? <a href="/contact" className="font-bold text-highlight hover:underline">Contáctanos</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
