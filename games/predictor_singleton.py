# games/predictor_singleton.py
from .predictor import Predictor

_predictor_cache = {}

def get_predictor(model_path, numeros_anteriores):
    key = (model_path , numeros_anteriores)
    if key not in _predictor_cache:
        _predictor_cache[key] = Predictor(model_path, numeros_anteriores=numeros_anteriores)
    return _predictor_cache[key]
