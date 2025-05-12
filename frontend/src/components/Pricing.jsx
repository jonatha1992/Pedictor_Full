// src/components/Pricing.jsx
import React from "react";

const Pricing = () => {
  const plans = [
    {
      name: "Básico",
      price: "$10/mes",
      features: ["Predicciones estándar", "Soporte por email", "Acceso web"],
    },
    {
      name: "Pro",
      price: "$20/mes",
      features: ["Predicciones avanzadas", "Soporte prioritario", "Acceso móvil y web"],
    },
    {
      name: "Empresarial",
      price: "$30/mes",
      features: ["Predicciones personalizadas", "Soporte dedicado", "Integraciones API"],
    },
  ];

  return (
    <section id="precios" className="py-20 text-white border border-green-700 shadow-2xl bg-gradient-to-br from-gray-900 to-green-900 rounded-xl">
      <div className="container mx-auto text-center">
        <h2 className="mb-8 text-3xl font-extrabold text-highlight drop-shadow-lg bg-black/60 px-6 py-2 rounded-full border-2 border-highlight inline-block">Precios</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div key={index} className="p-6 border-2 border-highlight shadow-2xl bg-gradient-to-br from-black via-green-900 to-green-800 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-black/40 rounded-2xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col items-center">
                <h3 className="mb-4 text-2xl font-extrabold text-highlight drop-shadow bg-black/60 px-4 py-1 rounded-full border border-highlight inline-block tracking-wide">{plan.name}</h3>
                <p className="mb-4 text-4xl font-extrabold text-yellow-400 drop-shadow bg-black/60 px-4 py-1 rounded-full border border-yellow-400 inline-block">{plan.price}</p>
                <ul className="mb-4 text-base font-semibold text-white/90">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="mb-2 px-2 py-1 rounded bg-green-900/60 border border-green-700 shadow text-white/90">{feature}</li>
                  ))}
                </ul>
                <button className="px-6 py-2 font-extrabold rounded-full shadow-xl bg-highlight text-primary hover:bg-white hover:text-secondary border-2 border-highlight transition-colors text-lg tracking-wide mt-2">
                  Elegir plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
