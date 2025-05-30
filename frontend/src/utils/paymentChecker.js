// Archivo: frontend/src/utils/paymentChecker.js

/**
 * Probar conectividad con el backend
 */
export const testBackendConnection = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, error: 'No hay token de autenticación' };
        }

        const response = await fetch('http://localhost:8000/api/payments/test/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('🔌 Test backend - Status:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('🔌 Test backend - Data:', data);
            return { success: true, data };
        } else {
            const errorText = await response.text();
            console.log('🔌 Test backend - Error:', errorText);
            return { success: false, error: errorText };
        }
    } catch (error) {
        console.error('🔌 Test backend - Exception:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Verificar automáticamente el estado de los pagos cuando el usuario regresa
 */
export const checkPaymentStatus = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            return { success: false, error: 'No hay token de autenticación' };
        } const response = await fetch('http://localhost:8000/api/payments/auto-check/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (response.ok) {
            const data = await response.json();
            console.log('Verificación de pagos completa:', data);

            // Si hay pagos aprobados, devolver éxito
            const approvedPayments = data.payments?.filter(p => p.status === 'approved');
            if (approvedPayments?.length > 0) {
                return { success: true, approvedPayments };
            }

            return { success: true, approvedPayments: [] };
        } else {
            console.error('Error en la respuesta:', response.status);
            return { success: false, error: `Error ${response.status}` };
        }
    } catch (error) {
        console.error('Error verificando pagos:', error);
        return { success: false, error };
    }
};

/**
 * Verificar un pago específico por preference_id
 */
export const checkSpecificPayment = async (preferenceId) => {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch('/api/payments/check-payment/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                preference_id: preferenceId
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Estado del pago:', data);
            return data;
        }

        throw new Error('Error verificando el pago');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
