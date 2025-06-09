// src/components/Pricing.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaCrown, FaArrowRight } from 'react-icons/fa';

const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Simplificamos el componente para mostrar solo una referencia a los planes de suscripción
  const handleViewPlans = () => {
    if (!isAuthenticated) {
      console.log("Usuario no autenticado, redirigiendo a login");
      navigate("/login", { state: { from: "/subscribe" } });
    } else {
      navigate("/subscribe");
    }
  };
  return (
    <section id="precios" className="py-16 text-white border border-green-700 shadow-2xl bg-gradient-to-br from-gray-900 to-green-900 rounded-xl">
      <div className="container mx-auto text-center">
        <h2 className="inline-block px-6 py-2 mb-8 text-3xl font-extrabold border-2 rounded-full text-highlight drop-shadow-lg bg-black/60 border-highlight">Suscripciones</h2>

        <div className="max-w-2xl mx-auto mb-10">
          <p className="mb-6 text-xl">
            ¡Optimiza tus ganancias con nuestro predictor premium! Contamos con diferentes planes adaptados a tus necesidades.
          </p>

          <div className="flex flex-col items-center justify-center p-6 mb-8 border-2 rounded-lg shadow-2xl md:flex-row md:space-x-8 md:px-10 border-highlight bg-gradient-to-br from-black to-green-900">
            <FaCrown className="w-16 h-16 mb-4 text-yellow-400 md:mb-0" />

            <div className="flex-1 text-left">
              <h3 className="mb-2 text-2xl font-bold text-highlight">Planes disponibles:</h3>
              <ul className="mb-4 space-y-2 text-lg">
                <li className="flex items-center">
                  <span className="inline-block w-2 h-2 mr-2 bg-yellow-400 rounded-full"></span>
                  Plan Semanal - Acceso a todas las predicciones
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-2 h-2 mr-2 bg-yellow-400 rounded-full"></span>
                  Plan Mensual - Ahorra con mayor duración
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-2 h-2 mr-2 bg-yellow-400 rounded-full"></span>
                  Plan Anual - Máximo ahorro y beneficios exclusivos
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 mb-8 text-lg bg-black/30 rounded-xl">
            <p className="font-medium">Todos nuestros planes incluyen:</p>
            <div className="grid grid-cols-1 gap-2 mt-3 md:grid-cols-2">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-2 bg-green-500 rounded-full"></span>
                Acceso a predicciones precisas
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-2 bg-green-500 rounded-full"></span>
                Estadísticas en tiempo real
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-2 bg-green-500 rounded-full"></span>
                Actualizaciones continuas
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-2 bg-green-500 rounded-full"></span>
                Soporte técnico prioritario
              </div>
            </div>
          </div>

          <button
            onClick={handleViewPlans}
            className="inline-flex items-center px-8 py-3 text-lg font-extrabold tracking-wide transition-colors border-2 rounded-full shadow-xl bg-highlight text-primary hover:bg-white hover:text-secondary border-highlight"
          >
            Ver detalles de los planes
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
