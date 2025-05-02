import numpy as np
import tensorflow as tf
import os

class Predictor:
    def __init__(self, model_path, numeros_anteriores=8):
        self.model_path = model_path
        self.numeros_anteriores = numeros_anteriores
        self.model = tf.keras.models.load_model(model_path)

    def predecir(self, numeros):
        # Prepara la secuencia de entrada
        if len(numeros) < self.numeros_anteriores:
            raise ValueError(f"Se requieren al menos {self.numeros_anteriores} números para predecir.")
        secuencia_entrada = np.array(numeros[-self.numeros_anteriores:]).reshape(1, self.numeros_anteriores, 1)
        predicciones = self.model.predict(secuencia_entrada, verbose=0)
        # Devuelve una lista de probabilidades por número
        return predicciones[0].tolist()
