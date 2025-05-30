// src/views/Subscribe.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Subscribe = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Verificar autenticación primero
        if (!isAuthenticated) {
            console.log("Usuario no autenticado, redirigiendo a login");
            navigate("/login", { state: { from: "/subscribe" } });
            return;
        }

        // Obtener el plan_id de la URL si existe
        const planIdFromURL = searchParams.get('plan');
        if (planIdFromURL) {
            setSelectedPlan(planIdFromURL);
        }

        // Cargar los planes
        const fetchPlans = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/api/subscriptions/plans/");
                console.log("Planes de suscripción:", response.data);
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

        // Ya no se procesa automáticamente el pago al entrar, solo se selecciona el plan
    }, [isAuthenticated, navigate, searchParams]);

    const handleSubscribe = async (planId) => {
        if (!isAuthenticated) {
            console.log("Usuario no autenticado, redirigiendo a login");
            navigate("/login", { state: { from: `/subscribe?plan=${planId}` } });
            return;
        }

        try {
            setLoading(true);
            console.log("Creando pago para el plan:", planId);
            const response = await axios.post("/api/payments/create-payment/", {
                plan_id: planId,
            });

            console.log("Respuesta del servidor:", response.data);

            // Redirect to MercadoPago checkout
            const { init_point, sandbox_init_point } = response.data;

            // Use sandbox in development, production checkout in production
            const checkoutUrl = process.env.NODE_ENV === "production"
                ? init_point
                : sandbox_init_point || init_point; // Fallback a init_point si sandbox_init_point no existe

            console.log("Redirigiendo a:", checkoutUrl);
            window.location.href = checkoutUrl;
        } catch (err) {
            if (err.response && err.response.status === 401) {
                console.log("Error de autenticación, redirigiendo a login");
                navigate("/login", { state: { from: `/subscribe?plan=${planId}` } });
            } else {
                setError("Error al procesar el pago: " + (err.response?.data?.error || err.message));
                console.error("Error creating payment:", err);
                setLoading(false);
            }
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(price);
    };

    if (loading && plans.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black">
                <div className="w-16 h-16 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    // Check if user already has an active subscription
    const hasActiveSubscription = user?.has_active_subscription;

    // Si no hay planes, muestra un mensaje amigable
    if (!plans || plans.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black">
                <div className="p-4 text-center text-white bg-yellow-600 rounded-lg">No hay planes disponibles.</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-gray-900 via-green-900 to-black">
            <div className="w-full max-w-4xl">
                <h1 className="mb-10 text-4xl font-extrabold text-center text-white">
                    Planes de Suscripción
                </h1>

                {error && (
                    <div className="p-4 mb-8 text-center text-white bg-red-600 rounded-lg">
                        {error}
                    </div>
                )}

                {hasActiveSubscription && (
                    <div className="p-4 mb-8 text-center text-white bg-green-600 rounded-lg">
                        Ya tienes una suscripción activa hasta {new Date(user.subscription_info.end_date).toLocaleDateString()}
                    </div>
                )}

                <div className="grid gap-8 md:grid-cols-3">
                    {plans.map((plan) => {
                        const planName = plan.name === 'weekly'
                            ? 'Semanal'
                            : plan.name === 'monthly'
                                ? 'Mensual'
                                : 'Anual';

                        const features = [
                            "Acceso a predicciones",
                            "Estadísticas en tiempo real",
                            "Soporte técnico"
                        ];

                        return (
                            <div
                                key={plan.id}
                                className={`rounded-xl shadow-2xl border p-8 flex flex-col ${selectedPlan === plan.id
                                    ? 'border-green-400 bg-gradient-to-br from-green-800 to-green-900'
                                    : 'border-green-800 bg-gradient-to-br from-gray-800 to-gray-900'
                                    }`}
                            >
                                <h2 className="mb-4 text-2xl font-bold text-green-400">
                                    {planName}
                                </h2>
                                <div className="mb-6 text-3xl font-bold text-white">
                                    {formatPrice(plan.price)}
                                </div>

                                <ul className="flex-grow mb-8 space-y-2">
                                    {features.map((feature, index) => (
                                        <li key={index} className="flex items-center text-gray-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleSubscribe(plan.id)}
                                    disabled={loading}
                                    className="w-full px-4 py-3 font-bold text-white transition duration-200 bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                                >
                                    {loading ? "Procesando..." : "Suscribirse"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Subscribe;
