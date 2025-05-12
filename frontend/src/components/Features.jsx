// src/components/Features.jsx
import React from "react";
import backgroundImage from "../assets/promo1.webp"; // Asegúrate de ajustar la ruta según la ubicación de tu imagen
import monedas from "../assets/monedas.webp";
import crupiers from "../assets/crupiers.webp";

const Features = () => {
  const features = [
    {
      title: "Accurate Predictions",
      title_es: "Predicciones precisas",
      description: "Our AI provides the most accurate predictions.",
      description_es: "Nuestra IA ofrece las predicciones más precisas.",
      image: backgroundImage,
    },
    {
      title: "Easy to Use",
      title_es: "Fácil de usar",
      description: "User-friendly interface designed for everyone.",
      description_es: "Interfaz amigable diseñada para todos.",
      image: monedas,
    },
    {
      title: "24/7 Support",
      title_es: "Soporte 24/7",
      description: "Get support whenever you need it.",
      description_es: "Obtén soporte cuando lo necesites.",
      image: crupiers,
    },
  ];

  return (
    <section id="features" className="py-20 text-white border border-green-700 shadow-2xl bg-gradient-to-br from-gray-900 to-green-900 rounded-xl">
      <div className="container mx-auto text-center">
        <h2 className="mb-8 text-3xl font-bold">Características</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-6 overflow-hidden border border-green-700 shadow-xl bg-gradient-to-br from-green-800 to-green-900 rounded-xl"
            >
              {/* Pseudoelemento para la imagen de fondo con filtro */}
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{
                  backgroundImage: `url(${feature.image})`,
                  filter: "brightness(0.7) blur(4px)",
                }}
              ></div>
              {/* Capa de superposición para evitar que el texto se vea afectado */}
              <div className="relative z-10">
                <h3 className="mb-4 text-2xl font-bold">{feature.title_es || feature.title}</h3>
                <p>{feature.description_es || feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
