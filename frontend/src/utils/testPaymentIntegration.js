// testPaymentIntegration.js
// Este script verifica la integración con Mercado Pago paso a paso
import axiosInstance from './axios';

/**
 * Función para verificar todos los componentes del flujo de pagos
 */
export const testPaymentIntegration = async () => {
    const results = {
        backend: false,
        plans: false,
        preference: false,
        checkStatus: false,
        webhook: null, // No podemos probar webhooks directamente desde el frontend
        overall: false,
    };

    try {
        // PASO 1: Verificar conectividad con backend
        console.log('🔍 PASO 1: Verificando conectividad con backend...');
        try {
            const backendResponse = await axiosInstance.get('/payments/test/');
            console.log('✅ Backend responde:', backendResponse.data);
            results.backend = true;
        } catch (error) {
            console.error('❌ Error conectando con backend:', error.response?.data || error.message);
            return { ...results, error: 'Fallo de conectividad con backend' };
        }

        // PASO 2: Verificar acceso a planes de suscripción
        console.log('🔍 PASO 2: Verificando planes de suscripción...');
        let plan;
        try {
            const plansResponse = await axiosInstance.get('/subscriptions/plans/');
            if (plansResponse.data && plansResponse.data.length > 0) {
                plan = plansResponse.data[0];
                console.log('✅ Planes disponibles:', plansResponse.data.length);
                console.log('   Usando plan:', plan.name, `(ID: ${plan.id})`);
                results.plans = true;
            } else {
                console.error('❌ No se encontraron planes de suscripción');
                return { ...results, error: 'No hay planes disponibles' };
            }
        } catch (error) {
            console.error('❌ Error obteniendo planes:', error.response?.data || error.message);
            return { ...results, error: 'Error obteniendo planes de suscripción' };
        }

        // PASO 3: Crear preferencia de pago (simulación)
        console.log('🔍 PASO 3: Creando preferencia de pago...');
        let preferenceId;
        try {
            const preferenceResponse = await axiosInstance.post('/payments/create-payment/', {
                plan_id: plan.id
            });

            const { preference_id, init_point, sandbox_init_point } = preferenceResponse.data;
            preferenceId = preference_id;

            console.log('✅ Preferencia creada exitosamente');
            console.log('   ID:', preference_id);
            console.log('   URL de pago:', sandbox_init_point || init_point);
            results.preference = true;
        } catch (error) {
            console.error('❌ Error creando preferencia:', error.response?.data || error.message);
            return { ...results, error: 'Error creando preferencia de pago' };
        }

        // PASO 4: Verificar estado de un pago específico
        console.log('🔍 PASO 4: Verificando estado de pago...');
        try {
            const statusResponse = await axiosInstance.post('/payments/check-payment/', {
                preference_id: preferenceId
            });

            console.log('✅ Verificación de estado exitosa');
            console.log('   Estado:', statusResponse.data.status);
            results.checkStatus = true;
        } catch (error) {
            console.error('❌ Error verificando estado:', error.response?.data || error.message);
            // No fallamos aquí ya que el estado podría ser desconocido pero la API funciona
            results.checkStatus = false;
        }

        // PASO 5: Verificar pagos pendientes (auto-check)
        console.log('🔍 PASO 5: Verificando pagos pendientes...');
        try {
            const autoCheckResponse = await axiosInstance.get('/payments/auto-check/');
            console.log('✅ Auto-check exitoso');
            console.log('   Pagos pendientes:', autoCheckResponse.data.total_pending);
            console.log('   Pagos actualizados:', autoCheckResponse.data.payments?.length || 0);
        } catch (error) {
            console.error('❌ Error en auto-check:', error.response?.data || error.message);
            // Este paso es informativo, no afecta el resultado
        }

        // Evaluación final
        results.overall = results.backend && results.plans && results.preference;

        console.log('=== RESULTADO FINAL ===');
        console.log('🔌 Backend:', results.backend ? '✅ CONECTADO' : '❌ ERROR');
        console.log('📋 Planes:', results.plans ? '✅ DISPONIBLES' : '❌ ERROR');
        console.log('💰 Preferencia:', results.preference ? '✅ FUNCIONA' : '❌ ERROR');
        console.log('🔍 Verificación:', results.checkStatus ? '✅ FUNCIONA' : '⚠️ REVISAR');
        console.log('🚀 Integración general:', results.overall ? '✅ LISTA' : '❌ CON PROBLEMAS');

        return results;
    } catch (error) {
        console.error('❌ Error general en prueba:', error);
        return { ...results, error: error.message };
    }
};

// Función para realizar una prueba simple de MercadoPago
export const quickTestMercadoPago = async () => {
    try {
        // 1. Obtener el primer plan
        const plansResponse = await axiosInstance.get('/subscriptions/plans/');
        const plan = plansResponse.data[0];

        if (!plan) {
            return { success: false, message: 'No hay planes disponibles' };
        }

        // 2. Crear preferencia
        const preferenceResponse = await axiosInstance.post('/payments/create-payment/', {
            plan_id: plan.id
        });

        const { preference_id, init_point, sandbox_init_point } = preferenceResponse.data;
        const checkoutUrl = sandbox_init_point || init_point;

        return {
            success: true,
            plan: plan.name,
            planId: plan.id,
            preferenceId: preference_id,
            checkoutUrl,
            message: 'La integración con Mercado Pago está funcionando correctamente',
            testData: {
                cardSuccess: '5031 7557 3453 0604', // Tarjeta que aprueba
                cardFailure: '4169 7420 0000 0000', // Tarjeta que rechaza
                cvv: '123',
                expiry: '12/25',
                name: 'APRO'
            }
        };
    } catch (error) {
        return {
            success: false,
            message: 'Error en la integración con Mercado Pago',
            error: error.response?.data || error.message
        };
    }
};
