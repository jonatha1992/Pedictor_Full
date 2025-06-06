// Archivo: frontend/src/utils/paymentChecker.js
import axiosInstance from './axios';

/**
 * Verifica si el backend está disponible
 * @returns {Promise<boolean>}
 */
export const isBackendAvailable = async () => {
    try {
        const response = await fetch('/api/health-check/', {
            method: 'HEAD',
            timeout: 2000
        });
        return response.ok;
    } catch (error) {
        console.error('Error verificando disponibilidad del backend:', error);
        return false;
    }
};

/**
 * Probar conectividad con el backend
 */
export const testBackendConnection = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, error: 'No hay token de autenticación' };
        }

        const response = await axiosInstance.get('/payments/test/');

        console.log('🔌 Test backend - Status:', response.status);
        console.log('🔌 Test backend - Data:', response.data);

        return { success: true, data: response.data };
    } catch (error) {
        console.error('🔌 Test backend - Exception:', error);
        return {
            success: false,
            error: error.response?.data || error.message
        };
    }
};

/**
 * Verificar automáticamente el estado de los pagos cuando el usuario regresa
 */
export const checkPaymentStatus = async () => {
    try {
        // Verificar primero si el backend está disponible
        const backendAvailable = await isBackendAvailable();
        if (!backendAvailable) {
            console.error('El backend no está disponible');
            return {
                success: false,
                error: 'El servidor no está disponible en este momento. Por favor intenta más tarde.'
            };
        }

        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, error: 'No hay token de autenticación' };
        }

        try {
            const response = await axiosInstance.get('/payments/auto-check/');

            console.log('Verificación de pagos completa:', response.data);

            // Si hay pagos aprobados, devolver éxito
            const approvedPayments = response.data.payments?.filter(p => p.status === 'approved');
            if (approvedPayments?.length > 0) {
                return { success: true, approvedPayments };
            }

            return { success: true, approvedPayments: [] };
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                console.error('Timeout al verificar pagos');
                return { success: false, error: 'La solicitud tomó demasiado tiempo. Verifica tu conexión.' };
            }

            console.error('Error verificando pagos:', error);
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    } catch (error) {
        console.error('Error crítico verificando pagos:', error);
        return {
            success: false,
            error: 'Error inesperado al verificar pagos. Por favor intenta más tarde.'
        };
    }
};

/**
 * Verificar un pago específico por preference_id
 */
export const checkSpecificPayment = async (preferenceId) => {
    try {
        const response = await axiosInstance.post('/payments/check-payment/', {
            preference_id: preferenceId
        });

        console.log('Estado del pago:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error verificando pago específico:', error);
        throw error;
    }
};
