import requests

BASE_URL = 'http://localhost:8000'  # Ajusta esto a la URL de tu API Django
FIREBASE_TOKEN = 'YOUR_FIREBASE_TOKEN_HERE'  # Reemplaza con el token generado

headers = {
    'Authorization': f'Bearer {FIREBASE_TOKEN}',
    'Content-Type': 'application/json'
}


def test_get_users():
    response = requests.get(f'{BASE_URL}/users/', headers=headers)
    print('Get Users:', response.status_code, response.json())


def test_create_report():
    data = {
        "user": 1,  # Asegúrate de que este ID de usuario exista
        "game": "test_game",
        "predicted": 5,
        "total_hits": 10,
        "predicted_hits": 3,
        "v1l": 1,
        "v2l": 2,
        "v3l": 3,
        "v4l": 4,
        "numbers_to_predict": 5,
        "previous_numbers": 10,
        "neighbor_count": 2,
        "game_limit": 100,
        "probability": 0.5,
        "effectiveness": 0.6,
        "roulette": "test_roulette"
    }
    response = requests.post(f'{BASE_URL}/reports/', json=data, headers=headers)
    print('Create Report:', response.status_code, response.json())


if __name__ == '__main__':
    test_get_users()
    test_create_report()
