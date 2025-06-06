// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkPaymentStatus, testBackendConnection } from "./utils/paymentChecker";

import Navbar from "./components/Navbar";
import Home from "./views/Home";
import Footer from "./components/Footer";
import Login from "./views/Login";
import Register from "./views/Register";
import Predict from "./views/Predict";
import Subscribe from "./views/Subscribe";
import Contact from "./views/Contact";
import Config from "./views/Config";
import Terminos from "./views/Terminos";
import PaymentTest from "./views/PaymentTest";

const App = () => {
  const [paymentNotification, setPaymentNotification] = useState(null);

  useEffect(() => {    // Verificar pagos cuando la app se carga
    const checkPayments = async () => {
      // Solo verificar si hay usuario logueado
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Primero probar conectividad
          console.log('🔌 Probando conectividad con backend...');
          const connectionTest = await testBackendConnection();
          if (!connectionTest.success) {
            console.error('❌ Error de conectividad:', connectionTest.error);
            setPaymentNotification({
              type: 'error',
              message: 'Error de conexión con el servidor'
            });
            return;
          }
          console.log('✅ Backend conectado correctamente');

          // Ahora verificar pagos
          console.log('🔍 Verificando pagos...');
          const result = await checkPaymentStatus();
          if (result.success && result.approvedPayments?.length > 0) {
            // Mostrar notificación de éxito
            setPaymentNotification({
              type: 'success',
              message: '¡Pago aprobado! Tu suscripción ha sido activada.'
            });

            // Ocultar notificación después de 5 segundos
            setTimeout(() => setPaymentNotification(null), 5000);
          } else if (result.error) {
            console.error('❌ Error verificando pagos:', result.error);
            setPaymentNotification({
              type: 'error',
              message: 'Error verificando el estado del pago'
            });
          } else {
            console.log('ℹ️ No hay pagos nuevos aprobados');
          }
        } catch (error) {
          console.error('❌ Error general:', error);
          setPaymentNotification({
            type: 'error',
            message: 'Error inesperado'
          });
        }
      }
    };

    // Verificar parámetros de URL para ver si el usuario regresa de MercadoPago
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const paymentId = urlParams.get('payment_id');
    const status = urlParams.get('status');
    const preferenceId = urlParams.get('preference_id'); if (paymentStatus || paymentId) {
      // Usuario regresa de MercadoPago
      console.log('🔙 Usuario regresa de MercadoPago con parámetros:', {
        paymentStatus,
        paymentId,
        status,
        preferenceId
      });

      // Mostrar notificación temporal de procesamiento
      setPaymentNotification({
        type: 'info',
        message: 'Verificando el estado de tu pago...'
      });

      // Limpiar URL de parámetros
      window.history.replaceState({}, document.title, window.location.pathname);

      // Esperar un poco para que el pago se procese
      setTimeout(async () => {
        console.log('🔍 Iniciando verificación de pagos...');
        await checkPayments();
      }, 3000);
    } else {
      // Verificación normal al cargar la app
      checkPayments();
    }
  }, []);
  return (
    <Router>
      <div className="mx-auto">
        {/* Notificación de pago */}        {paymentNotification && (<div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${paymentNotification.type === 'success'
          ? 'bg-green-500 text-white'
          : paymentNotification.type === 'info'
            ? 'bg-blue-500 text-white'
            : paymentNotification.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
          <div className="flex items-center">
            <span>{paymentNotification.message}</span>
            <button
              onClick={() => setPaymentNotification(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
        )}

        <Navbar />        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/config" element={<Config />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/payment-test" element={<PaymentTest />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
