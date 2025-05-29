// src/components/Pricing.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/subscriptions/plans/");
        console.log("Planes de suscripción:", response.data);
        // Si la respuesta es un array, úsala. Si es un objeto, busca la clave correcta.
        if (Array.isArray(response.data)) {
          setPlans(response.data);
        } else if (response.data && Array.isArray(response.data.results)) {
          setPlans(response.data.results);
        } else if (response.data && Array.isArray(response.data.plans)) {
          setPlans(response.data.plans);
        } else {
          setPlans([]);
        }
        setError(null);
      } catch (err) {
        setError("Error al cargar los planes de suscripción.");
        console.error("Error fetching subscription plans:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black">
        <div className="w-16 h-16 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black">
        <div className="p-4 text-center text-white bg-red-600 rounded-lg">{error}</div>
      </div>
    );
  }

  // Si no hay planes, muestra un mensaje amigable
  if (!plans || plans.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black">
        <div className="p-4 text-center text-white bg-yellow-600 rounded-lg">No hay planes disponibles.</div>
      </div>
    );
  }

  return (
    <section id="precios" className="py-20 text-white border border-green-700 shadow-2xl bg-gradient-to-br from-gray-900 to-green-900 rounded-xl">
      <div className="container mx-auto text-center">
        <h2 className="inline-block px-6 py-2 mb-8 text-3xl font-extrabold border-2 rounded-full text-highlight drop-shadow-lg bg-black/60 border-highlight">Precios</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, index) => {
            const planName = plan.name === 'weekly'
              ? 'Semanal'
              : plan.name === 'monthly'
                ? 'Mensual'
                : plan.name === 'annual'
                  ? 'Anual'
                  : plan.name;
            const features = [
              "Acceso a predicciones",
              "Estadísticas en tiempo real",
              "Soporte técnico"
            ];
            return (
              <div key={plan.id || index} className="relative p-6 overflow-hidden border-2 shadow-2xl border-highlight bg-gradient-to-br from-black via-green-900 to-green-800 rounded-2xl">
                <div className="absolute inset-0 pointer-events-none bg-black/40 rounded-2xl"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <h3 className="inline-block px-4 py-1 mb-4 text-2xl font-extrabold tracking-wide border rounded-full text-highlight drop-shadow bg-black/60 border-highlight">{planName}</h3>
                  <p className="inline-block px-4 py-1 mb-4 text-4xl font-extrabold text-yellow-400 border border-yellow-400 rounded-full drop-shadow bg-black/60">{formatPrice(plan.price)}</p>
                  <ul className="mb-4 text-base font-semibold text-white/90">
                    {features.map((feature, i) => (
                      <li key={i} className="px-2 py-1 mb-2 border border-green-700 rounded shadow bg-green-900/60 text-white/90">{feature}</li>
                    ))}
                  </ul>
                  <button
                    className="px-6 py-2 mt-2 text-lg font-extrabold tracking-wide transition-colors border-2 rounded-full shadow-xl bg-highlight text-primary hover:bg-white hover:text-secondary border-highlight"
                    onClick={() => navigate(`/subscribe?plan=${plan.id}`)}
                  >
                    Elegir plan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
