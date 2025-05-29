import json
import pytest
from django.urls import reverse
from rest_framework.test import APIClient
import os
import numpy as np
import pytest
from .predictor import Predictor

@pytest.fixture
def predictor():
    model_path = os.path.join(os.path.dirname(__file__), 'ml', 'Model_Electromecanica_N10.keras')
    numeros_anteriores = 10
    return Predictor(model_path, numeros_anteriores=numeros_anteriores)

def test_prediccion_valida(predictor):
    numeros = [1, 5, 12, 23, 8, 17, 29, 36, 14, 7]  # 10 números
    probabilidades = predictor.predecir(numeros)
    assert len(probabilidades) == 37  # 37 números posibles (0-36)
    assert all(isinstance(p, float) or isinstance(p, np.floating) for p in probabilidades)

def test_prediccion_con_pocos_numeros(predictor):
    numeros = [1, 2, 3]  # Menos de 10
    with pytest.raises(ValueError):
        predictor.predecir(numeros)


def test_predict_endpoint_valido(db):
    client = APIClient()
    url = reverse('game-predict')
    data = {
        "numeros": [1, 5, 12, 23, 8, 17, 29, 36, 14, 7],  # 10 números
        "parametros": {
            "numeros_anteriores": 10,
            "tipo_ruleta": "Electromecanica"
        }
    }
    response = client.post(url, data, format='json')
    assert response.status_code == 200
    assert "probabilidades" in response.data
    assert len(response.data["probabilidades"]) == 37

def test_predict_endpoint_pocos_numeros(db):
    client = APIClient()
    url = reverse('game-predict')
    data = {
        "numeros": [1, 2, 3],
        "parametros": {
            "numeros_anteriores": 10,
            "tipo_ruleta": "Electromecanica"
        }
    }
    response = client.post(url, data, format='json')
    assert response.status_code == 400
    assert "error" in response.data