// src/components/FAQs.jsx
import React from "react";

const FAQs = () => {
  const faqs = [
    {
      question: "¿Cómo funciona la app?",
      answer: "Nuestra app utiliza IA para predecir resultados de ruleta.",
    },
    {
      question: "¿Hay prueba gratuita?",
      answer: "Sí, ofrecemos una prueba gratuita de 7 días.",
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos todas las tarjetas de crédito principales.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-gray-900 to-green-900 text-white rounded-xl shadow-2xl border border-green-700">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-8 text-3xl font-extrabold text-highlight drop-shadow-lg text-center bg-black/60 px-6 py-2 rounded-full border-2 border-highlight inline-block">Preguntas Frecuentes</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="p-6 bg-gradient-to-br from-green-800 to-green-900 rounded-xl shadow-xl border border-green-700 flex flex-col gap-2">
              <h3 className="text-lg font-bold text-highlight drop-shadow bg-black/60 px-4 py-2 rounded-full border border-highlight inline-block w-fit mx-auto text-center">{faq.question}</h3>
              <p className="text-white/90 text-base text-center bg-black/30 px-4 py-2 rounded-lg mx-auto w-fit">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
