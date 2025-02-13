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

    def predict_simple(self, jugados, history, game):
        """
        Procesa dos listas: 'jugados' y 'history', utilizando parámetros del game.
        Aplica actualización de tardanza, probabilidad y vecinos.
        """
        # Ejemplo: para cada número jugado, se busca actualizar el historial.
        updated_history = []
        for jugado in jugados:
            num = jugado.get("numero")
            # Buscamos si ya existe en el historial
            entry = next((h for h in history if h["numero"] == num), None)
            if entry:
                # Actualizamos incrementando la probabilidad según el valor del jugado y ajustamos "repetido"
                incremento = jugado.get("probabilidad", 0)  # Este ejemplo usa la probabilidad del jugado
                entry["probabilidad"] += incremento
                entry["repetido"] += 1
                # Actualizamos la tardanza (por ejemplo, reduciéndola)
                if jugado.get("tardancia", 1) > 0:
                    jugado["tardancia"] -= 1
            else:
                # Si no existe, lo agregamos al historial
                entry = {
                    "numero": num,
                    "probabilidad": jugado.get("probabilidad", 0),
                    "repetido": 1
                }
                history.append(entry)
            updated_history.append(entry)

        # Se puede incluir lógica adicional basada en parámetros del game (cantidad_vecinos, límite de tardanza, etc.)
        resultado = {
            "jugados": jugados,
            "history": updated_history,
            "game": game  # Se regresa para efectos de verificación o auditoría
        }
        return resultado
