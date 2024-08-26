// src/components/Features.jsx
import React from "react";
import backgroundImage from "../assets/promo1.webp"; // Asegúrate de ajustar la ruta según la ubicación de tu imagen
import monedas from "../assets/monedas.webp";
import crupiers from "../assets/crupiers.webp";

const Features = () => {
  const features = [
    {
      title: "Accurate Predictions",
      description: "Our AI provides the most accurate predictions.",
      image: backgroundImage,
    },
    {
      title: "Easy to Use",
      description: "User-friendly interface designed for everyone.",
      image: monedas,
    },
    {
      title: "24/7 Support",
      description: "Get support whenever you need it.",
      image: crupiers,
    },
  ];

  return (
    <section id="features" className="py-20 bg-accent text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative bg-white p-6 rounded-lg shadow-lg overflow-hidden"
            >
              {/* Pseudoelemento para la imagen de fondo con filtro */}
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{
                  backgroundImage: `url(${feature.image})`,
                  filter: "brightness(0.7) blur(4px)", // Aplica un filtro de brillo y desenfoque
                }}
              ></div>
              {/* Capa de superposición para evitar que el texto se vea afectado */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
