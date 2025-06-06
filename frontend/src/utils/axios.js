// src/utils/axios.js
import axios from 'axios';

// Crear instancia de axios con configuración base
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // Usa la variable de entorno o '/api' por defecto
    timeout: 15000, // 15 segundos
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor de solicitud para agregar el token de autenticación
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor de respuesta para manejar errores comunes
axiosInstance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response) {
        // El servidor respondió con un código de error
        if (error.response.status === 401) {
            console.log('Error de autenticación - redirigiendo...');
            // Puedes redirigir al login o disparar un evento
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }

        if (error.response.status === 403) {
            console.log('Acceso prohibido');
        }
    } else if (error.request) {
        // La solicitud se hizo pero no se recibió respuesta
        console.log('Error de conectividad con el servidor');
        // Puedes mostrar un mensaje genérico
    } else {
        // Algo sucedió en la configuración de la solicitud
        console.log('Error en la configuración de la solicitud', error.message);
    }

    return Promise.reject(error);
});

export default axiosInstance;
