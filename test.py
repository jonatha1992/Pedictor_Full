import requests

BASE_URL = 'http://127.0.0.1:8000'  # Ajusta esto a la URL de tu API Django
FIREBASE_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImNjNWU0MTg0M2M1ZDUyZTY4ZWY1M2UyYmVjOTgxNDNkYTE0NDkwNWUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcHJlZGljdG9yLTQzMzcwMSIsImF1ZCI6InByZWRpY3Rvci00MzM3MDEiLCJhdXRoX3RpbWUiOjE3MjUzNzIwNTEsInVzZXJfaWQiOiJsUmVhWllneFlaTUJQdEw3cE1NMk9XQlRYY0IzIiwic3ViIjoibFJlYVpZZ3hZWk1CUHRMN3BNTTJPV0JUWGNCMyIsImlhdCI6MTcyNTM3MjA1MSwiZXhwIjoxNzI1Mzc1NjUxLCJlbWFpbCI6InVzdWFyaW9AZWplbXBsby5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidXN1YXJpb0BlamVtcGxvLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.YeRluLNGSo5wM6ieoRDUecZAfl0elOQgQLaTn6j - XUzDbcwatbxzz1wGZvaWg1jM18W8bm66vEWKzLvXwk0ZwG7uMTBg - jJHZQQGTrXAEMTX4nSkSRPwTZEpIaaveB91tUHqz4Vm8wXqGRxWcbizuhulAbJdETmYCV7Auo0liD - 69T1S_1cYwgn_g1ZSBcSaFF1qrE - 0725hg06B2flkh_NoSxRKbXVAcBeMJnluNboWFvnZ5S551_x7CuQdzjzU2j6_pCYRv9Ed4zmAltfnfIx1Ah - ifSnJv5o1sEfRLmaIEn1 - KJVOZ3XSupwQNkUtfYjZSK3LE2uJX1cQdmZtMg'  # Reemplaza con el token generado

headers = {
    'Authorization': f'Bearer {FIREBASE_TOKEN}',
    'Content-Type': 'application/json'
}


def test_get_users():
    response = requests.get(f'{BASE_URL}/api/v1/users/1', headers=headers)
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
    response = requests.post(f'{BASE_URL}/api/v1/reports/', json=data, headers=headers)
    print('Create Report:', response.status_code, response.json())


if __name__ == '__main__':
    test_get_users()
    test_create_report()
