import numpy as np
import tensorflow as tf
import os
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
from collections import defaultdict





def calcular_frecuencia(numeros, rango=36):
    """Calcula la frecuencia de aparición de números en una secuencia."""
    if len(numeros) <= 1:
        return [0] * len(numeros)
    
    frecuencias = []
    for i in range(len(numeros)):
        if i < rango:
            frecuencias.append(0)
        else:
            # Contar apariciones en la ventana previa
            ventana = numeros[i-rango:i]
            contador = {}
            for num in ventana:
                contador[num] = contador.get(num, 0) + 1
            frecuencias.append(contador.get(numeros[i], 0))
    
    # Normalizar frecuencias
    if max(frecuencias) > 0:  # Evitar división por cero
        frecuencias = [f / max(frecuencias) for f in frecuencias]
    
    return frecuencias


def calcular_estadisticas_avanzadas(numeros, rango=36):
    """Calcula estadísticas avanzadas para una secuencia de números."""
    if len(numeros) <= rango:
        # Si no hay suficientes datos, devolver valores por defecto
        return {
            'media_ponderada': [0] * len(numeros),
            'velocidad_cambio': [0] * len(numeros),
            'aceleracion': [0] * len(numeros),
            'volatilidad': [0] * len(numeros),
            'momento': [0] * len(numeros)
        }
    
    df = pd.DataFrame({'Salidos': numeros})
    
    # Media móvil ponderada
    weights = np.array([1.2**i for i in range(rango)])
    weights = weights / weights.sum()
    media_ponderada = []
    
    for i in range(len(numeros)):
        if i < rango:
            media_ponderada.append(0)
        else:
            ventana = np.array(numeros[i-rango:i])
            media_ponderada.append(np.sum(weights[-len(ventana):] * ventana))
    
    # Velocidad de cambio (diferencia)
    velocidad_cambio = [0]
    for i in range(1, len(numeros)):
        velocidad_cambio.append(numeros[i] - numeros[i-1])
    
    # Aceleración (segunda derivada)
    aceleracion = [0, 0]
    for i in range(2, len(numeros)):
        aceleracion.append(velocidad_cambio[i] - velocidad_cambio[i-1])
    
    # Volatilidad (desviación estándar móvil)
    volatilidad = []
    for i in range(len(numeros)):
        if i < rango:
            volatilidad.append(0)
        else:
            ventana = numeros[i-rango:i]
            volatilidad.append(np.std(ventana))
    
    # Momento (diferencia entre medias móviles)
    ma_corta = []
    for i in range(len(numeros)):
        if i < 5:
            ma_corta.append(0)
        else:
            ma_corta.append(np.mean(numeros[i-5:i]))
    
    ma_larga = []
    for i in range(len(numeros)):
        if i < rango:
            ma_larga.append(0)
        else:
            ma_larga.append(np.mean(numeros[i-rango:i]))
    
    momento = [m1 - m2 for m1, m2 in zip(ma_corta, ma_larga)]
    
    # Normalizar todas las características
    estadisticas = {
        'media_ponderada': media_ponderada,
        'velocidad_cambio': velocidad_cambio,
        'aceleracion': aceleracion,
        'volatilidad': volatilidad,
        'momento': momento
    }
    
    # Normalizar si es posible (evitar división por cero)
    for key, values in estadisticas.items():
        max_val = max(abs(v) for v in values) if values else 1
        if max_val > 0:
            estadisticas[key] = [v / max_val for v in values]
    
    return estadisticas


class Predictor:    
    
    def __init__(self, model_path, numeros_anteriores=10):
        self.model_path = model_path
        self.numeros_anteriores = numeros_anteriores
        self.model = tf.keras.models.load_model(model_path)
        self.label_encoder = LabelEncoder()
        
        # Preparar el codificador de sectores
        
    def predecir(self, numeros):
        # Verificar que tengamos suficientes números
        if len(numeros) < self.numeros_anteriores:
            raise ValueError(f"Se requieren al menos {self.numeros_anteriores} números para predecir.")
          # Calcular características adicionales
        frecuencias = calcular_frecuencia(numeros, rango=self.numeros_anteriores)
        estadisticas = calcular_estadisticas_avanzadas(numeros, rango=self.numeros_anteriores)
        
        # Preparar la secuencia de entrada con todas las características
        secuencia = []
        for j in range(1, self.numeros_anteriores + 1):
            idx = len(numeros) - j
            
            # Obtener sector y codificarlo
            
            # Verificar si el número está en sus vecinos
            
            # Construir información para cada número en la secuencia (en orden inverso)
            numero_info = [
                numeros[idx],                           # Número actual
                frecuencias[idx],                       # Frecuencia
                estadisticas['media_ponderada'][idx],   # Media ponderada
                estadisticas['velocidad_cambio'][idx],  # Velocidad de cambio
                estadisticas['aceleracion'][idx],       # Aceleración
                estadisticas['volatilidad'][idx],       # Volatilidad
                estadisticas['momento'][idx]            # Momento
            ]
            secuencia.extend(numero_info)
        
        # Invertir la secuencia para que coincida con el orden del modelo
        secuencia = secuencia[::-1]
        
        # Preprocesar y hacer la predicción
        secuencia_entrada = np.array([secuencia])
        predicciones = self.model.predict(secuencia_entrada, verbose=0)
        
        # Devuelve una lista de probabilidades por número (37 clases)
        return predicciones[0].tolist()
