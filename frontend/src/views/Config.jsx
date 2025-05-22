// src/views/Config.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaCalendarAlt, FaCrown, FaEdit, FaKey } from "react-icons/fa";

const Config = () => {
    const { user } = useAuth();

    // Formatear la fecha de creación de la cuenta si está disponible
    const formatDate = (timestamp) => {
        if (!timestamp) return "No disponible";
        const date = new Date(timestamp);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-gray-900 via-green-900 to-black">
            <div className="flex flex-col w-full max-w-2xl p-6 border border-green-700 shadow-2xl rounded-xl bg-gradient-to-br from-green-800 to-green-900">
                <h1 className="mb-6 text-3xl font-extrabold text-center text-highlight drop-shadow-lg">
                    Configuración de Usuario
                </h1>

                {user ? (
                    <div className="space-y-6">
                        {/* Perfil básico */}
                        <div className="p-5 border border-green-600 rounded-lg bg-black/30">
                            <h2 className="flex items-center gap-2 mb-4 text-xl font-bold text-highlight">
                                <FaUser className="text-yellow-300" />
                                Información del Perfil
                            </h2>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <p className="text-sm text-green-300">Nombre de usuario</p>
                                    <p className="p-2 font-medium text-white border border-green-700 rounded bg-green-900/40">
                                        {user.displayName || "No configurado"}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-green-300">Correo electrónico</p>
                                    <p className="flex items-center gap-2 p-2 font-medium text-white border border-green-700 rounded bg-green-900/40">
                                        <FaEnvelope className="text-yellow-300" /> {user.email}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-green-300">Fecha de registro</p>
                                    <p className="flex items-center gap-2 p-2 font-medium text-white border border-green-700 rounded bg-green-900/40">
                                        <FaCalendarAlt className="text-yellow-300" /> {formatDate(user.metadata?.creationTime)}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-green-300">Tipo de cuenta</p>
                                    <p className="flex items-center gap-2 p-2 font-medium text-white border border-green-700 rounded bg-green-900/40">
                                        <FaCrown className="text-yellow-300" /> {user.emailVerified ? "Premium" : "Estándar"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-col gap-4 md:flex-row">
                            <button className="flex items-center justify-center flex-1 gap-2 px-4 py-3 font-bold text-white transition-colors rounded-lg shadow bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900">
                                <FaEdit /> Editar Perfil
                            </button>

                            <button className="flex items-center justify-center flex-1 gap-2 px-4 py-3 font-bold text-white transition-colors rounded-lg shadow bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900">
                                <FaKey /> Cambiar Contraseña
                            </button>
                        </div>

                        {/* Preferencias de juego */}
                        <div className="p-5 border border-green-600 rounded-lg bg-black/30">
                            <h2 className="mb-4 text-xl font-bold text-highlight">Preferencias de Juego</h2>

                            <div className="space-y-3">
                                <p className="text-white/80">
                                    Aquí se mostrarán tus preferencias de juego. Podrás configurar opciones como:
                                </p>
                                <ul className="pl-5 space-y-1 list-disc text-white/80">
                                    <li>Notificaciones</li>
                                    <li>Tema visual</li>
                                    <li>Configuración predeterminada de ruletas</li>
                                </ul>
                                <p className="italic text-yellow-300">Próximamente disponible</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center text-white/80">
                        <p className="text-xl">Inicia sesión para ver tu configuración</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Config;
