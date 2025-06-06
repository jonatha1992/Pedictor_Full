// PaymentTest.jsx
import React from 'react';
import PaymentTester from '../components/PaymentTester';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const PaymentTest = () => {
    const { isAuthenticated, isAdmin } = useAuth();

    // Solo permitir acceso a administradores o en modo de desarrollo
    const isDev = import.meta.env.DEV;
    const hasAccess = isAuthenticated && (isAdmin || isDev);

    if (!hasAccess) {
        return <Navigate to="/" />;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Herramientas de Prueba de Pagos</h1>

            <div className="mb-8">
                <PaymentTester />
            </div>

            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                <p className="font-bold">⚠️ Importante</p>
                <p>Esta página es solo para pruebas. No uses tarjetas reales aquí.</p>
            </div>
        </div>
    );
};

export default PaymentTest;
