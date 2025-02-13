import os
import logging
import numpy as np
import tensorflow as tf
from .utils import get_relative_path
from .parametro import HiperParametros, Parametro_Juego

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


class Predictor:
    _instance = None
    _models = {}

    def __new__(cls, filename: str, parametro_juego: Parametro_Juego, hiperparametros: HiperParametros, **kwargs):
        if cls._instance is None:
            cls._instance = super(Predictor, cls).__new__(cls)
        return cls._instance

    def __init__(self, filename: str, parametro_juego: Parametro_Juego, hiperparametros: HiperParametros, **kwargs):
        # Evita reejecutar la inicialización en futuras invocaciones
        if getattr(self, "_initialized", False):
            return

        self.filename = filename
        self.parametro_juego = parametro_juego
        self.hiperparametros = hiperparametros
        self.filebasename = os.path.splitext(os.path.basename(filename))[0]
        self._initialized = True

        # Cargar el modelo (solo una vez)
        self.model = self.load_model()

    def load_model(self):
        modelo_nombre = f"Model_{self.filebasename}_N{self.hiperparametros.numerosAnteriores}"
        modelo_path = get_relative_path(f"./Models/{modelo_nombre}.keras")
        if not os.path.exists(modelo_path):
            raise FileNotFoundError(f"Modelo no encontrado en: {modelo_path}")
        if modelo_nombre not in self._models:
            logging.debug(f"Cargando modelo desde {modelo_path}")
            self._models[modelo_nombre] = tf.keras.models.load_model(modelo_path)
        else:
            logging.debug(f"Usando modelo cacheado: {modelo_nombre}")
        return self._models[modelo_nombre]

    def predict_simple(self, data: dict):
        """
        Realiza una predicción simple usando el modelo.
        Se espera que 'data' contenga dos llaves:
          - number_before: lista de 10 números
          - history: lista de diccionarios con 'numero' y 'probabilidad'
        """
        numbers = data.get("number_before")
        if not isinstance(numbers, list) or len(numbers) != 10:
            return {"error": "Se requiere un array de 10 números en 'number_before'"}

        input_data = np.array(numbers).reshape(1, -1)
        prediction = self.model.predict(input_data, verbose=0)
        pred_num = int(prediction.argmax())

        # Se retorna la entrada, la predicción y el historial recibido sin modificación
        return {"entrada": numbers, "prediccion": pred_num, "history": data.get("history", [])}
