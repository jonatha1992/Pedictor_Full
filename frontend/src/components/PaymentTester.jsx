// PaymentTester.jsx
import React, { useState } from 'react';
import { quickTestMercadoPago } from '../utils/testPaymentIntegration';

const PaymentTester = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const runTest = async () => {
        setLoading(true);
        setError(null);
        try {
            const testResult = await quickTestMercadoPago();
            setResult(testResult);
        } catch (err) {
            setError(err.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const goToCheckout = () => {
        if (result?.checkoutUrl) {
            window.open(result.checkoutUrl, '_blank');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-xl mx-auto my-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Probador de Integración Mercado Pago
            </h2>

            <div className="mb-6">
                <button
                    onClick={runTest}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                    {loading ? 'Probando...' : 'Probar Integración de Pagos'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {result && (
                <div className={`border-l-4 p-4 mb-4 ${result.success ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'}`}>
                    <p className="font-bold mb-2">{result.success ? 'Integración Exitosa' : 'Integración Fallida'}</p>
                    <p className="mb-2">{result.message}</p>

                    {result.success && (
                        <>
                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md my-3">
                                <p><span className="font-semibold">Plan:</span> {result.plan}</p>
                                <p><span className="font-semibold">Plan ID:</span> {result.planId}</p>
                                <p><span className="font-semibold">Preference ID:</span> {result.preferenceId}</p>
                            </div>

                            <div className="mt-4">
                                <button
                                    onClick={goToCheckout}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Ir a Checkout de Mercado Pago
                                </button>
                            </div>

                            <div className="mt-4 bg-blue-100 p-3 rounded border border-blue-300">
                                <p className="font-bold text-blue-800">Datos de prueba:</p>
                                <ul className="list-disc ml-5 text-blue-800">
                                    <li><span className="font-semibold">Tarjeta que aprueba:</span> {result.testData.cardSuccess}</li>
                                    <li><span className="font-semibold">Tarjeta que rechaza:</span> {result.testData.cardFailure}</li>
                                    <li><span className="font-semibold">CVV:</span> {result.testData.cvv}</li>
                                    <li><span className="font-semibold">Vencimiento:</span> {result.testData.expiry}</li>
                                    <li><span className="font-semibold">Nombre:</span> {result.testData.name}</li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className="text-sm text-gray-500 mt-4">
                <p>Esta herramienta verifica la integración con Mercado Pago:</p>
                <ol className="list-decimal ml-5 mt-2">
                    <li>Obtiene los planes disponibles</li>
                    <li>Crea una preferencia de pago</li>
                    <li>Permite probar el flujo completo de checkout</li>
                </ol>
            </div>
        </div>
    );
};

export default PaymentTester;
