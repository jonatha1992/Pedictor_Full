# 🎯 Spin Predictor - Sistema de Predicción de Ruleta Online

Un sistema completo de predicción de ruleta online construido con Django REST Framework, React.js, TensorFlow y integración con Mercado Pago para suscripciones.

## 🚀 Características

- **Predicción IA**: Modelo de machine learning usando TensorFlow para predicción de resultados
- **Sistema de Suscripciones**: Integración completa con Mercado Pago (planes semanales, mensuales y anuales)
- **Autenticación Firebase**: Sistema de autenticación robusto con Firebase
- **API REST**: Backend completo con Django REST Framework
- **Frontend Moderno**: Interfaz React.js con Tailwind CSS
- **Base de Datos**: PostgreSQL con migraciones automáticas
- **Testing**: Suite de pruebas con pytest
- **Documentación API**: Swagger/OpenAPI con drf-yasg

## 🛠️ Stack Tecnológico

### Backend
- **Django 5.1** - Framework web
- **Django REST Framework 3.15** - API REST
- **TensorFlow 2.17** - Machine Learning
- **PostgreSQL** - Base de datos
- **Firebase Admin** - Autenticación
- **Mercado Pago SDK** - Procesamiento de pagos
- **Poetry** - Gestión de dependencias

### Frontend
- **React 18.3** - Framework frontend
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Axios** - Cliente HTTP
- **React Router** - Navegación

### ML & Data Science
- **NumPy** - Computación numérica
- **Pandas** - Análisis de datos
- **Scikit-learn** - Machine learning
- **TensorFlow** - Deep learning

## 📋 Prerrequisitos

- Python 3.11
- Node.js 18+
- PostgreSQL 12+
- Poetry
- Git

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd Pedictor_Full
```

### 2. Configurar el Backend

#### Instalar dependencias con Poetry
```bash
# Instalar Poetry si no lo tienes
curl -sSL https://install.python-poetry.org | python3 -

# Instalar dependencias del proyecto
poetry install
```

#### Activar el entorno virtual
```bash
poetry shell
```

#### Configurar variables de entorno
```bash
# Crear archivo .env en la raíz del proyecto
cp .env.example .env

# Editar .env con tus configuraciones:
# - DATABASE_URL
# - FIREBASE_CONFIG
# - MERCADOPAGO_ACCESS_TOKEN
# - SECRET_KEY
```

#### Configurar la base de datos
```bash
# Ejecutar migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser
```

### 3. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu configuración de Firebase
```

## 🚀 Ejecución

### Desarrollo

#### Backend (Puerto 8000)
```bash
# En la raíz del proyecto
poetry shell
python manage.py runserver
```

#### Frontend (Puerto 5173)
```bash
# En el directorio frontend
cd frontend
npm run dev
```

### Producción

#### Backend
```bash
# Recopilar archivos estáticos
python manage.py collectstatic

# Ejecutar con Gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

#### Frontend
```bash
cd frontend
npm run build
```

## 🧪 Testing

### Backend
```bash
# Ejecutar todas las pruebas
poetry run pytest

# Ejecutar pruebas con cobertura
poetry run pytest --cov

# Ejecutar pruebas específicas
poetry run pytest apps/payments/tests_payments.py
```

### Frontend
```bash
cd frontend
npm run test
```

## 📁 Estructura del Proyecto

```
Pedictor_Full/
├── backend_authentication.py      # Autenticación personalizada
├── manage.py                      # Django management
├── pyproject.toml                # Configuración Poetry
├── poetry.lock                   # Lock de dependencias
├── pytest.ini                   # Configuración pytest
├── config/                       # Configuración Django
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── games/                    # Módulo de juegos y predicción
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── ModeloPredictor.py
│   │   └── ml/                   # Modelos de ML
│   ├── payments/                 # Módulo de pagos
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── utils.py
│   │   └── tests_payments.py
│   ├── subscriptions/            # Módulo de suscripciones
│   ├── users/                    # Módulo de usuarios
│   └── reports/                  # Módulo de reportes
├── frontend/                     # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── training_model/               # Scripts de entrenamiento ML
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/register/` - Registrar usuario
- `POST /api/auth/logout/` - Cerrar sesión

### Predicciones
- `POST /api/games/predict/` - Realizar predicción
- `GET /api/games/history/` - Historial de predicciones

### Suscripciones
- `GET /api/subscriptions/plans/` - Listar planes
- `POST /api/payments/create-payment/` - Crear pago
- `GET /api/payments/auto-check/` - Verificar estado de pago

### Documentación
- `/api/docs/` - Documentación Swagger
- `/api/redoc/` - Documentación ReDoc

## 💳 Integración Mercado Pago

### Configuración
1. Crear aplicación en [Mercado Pago Developers](https://www.mercadopago.com.ar/developers/)
2. Obtener credenciales de test y producción
3. Configurar webhooks en el panel de MP
4. Agregar URLs de retorno en la configuración

### Sandbox Testing
- Usar cuentas de test de comprador y vendedor
- URLs de retorno apuntan a `localhost:5173`
- Credenciales de test en variables de entorno

## 🔐 Variables de Entorno

### Backend (.env)
```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/predictor_db
FIREBASE_CREDENTIALS_PATH=path/to/firebase-credentials.json
MERCADOPAGO_ACCESS_TOKEN=your-mp-access-token
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## 🚀 Deployment

### Backend (Railway/Heroku)
1. Configurar variables de entorno
2. Instalar buildpack de Poetry
3. Ejecutar migraciones automáticamente
4. Configurar dominio personalizado

### Frontend (Vercel/Netlify)
1. Conectar repositorio
2. Configurar variables de entorno
3. Build automático desde main branch

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Scripts Útiles

### Poetry
```bash
# Instalar dependencia
poetry add package-name

# Instalar dependencia de desarrollo
poetry add --group dev package-name

# Actualizar dependencias
poetry update

# Exportar requirements.txt
poetry export -f requirements.txt --output requirements.txt
```

### Django
```bash
# Crear nueva migración
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Recopilar archivos estáticos
python manage.py collectstatic
```

## 📊 Monitoreo y Logging

- Logs de Django en `logs/django.log`
- Logs de pagos en consola y archivo
- Métricas de predicción en base de datos
- Webhook de MP con logging detallado

## 🐛 Troubleshooting

### Errores Comunes

1. **Error de conexión a PostgreSQL**
   ```bash
   # Verificar que PostgreSQL esté corriendo
   sudo service postgresql status
   ```

2. **Error de Firebase**
   ```bash
   # Verificar que el archivo de credenciales existe
   ls -la path/to/firebase-credentials.json
   ```

3. **Error de Mercado Pago**
   ```bash
   # Verificar credenciales en .env
   echo $MERCADOPAGO_ACCESS_TOKEN
   ```

## 📞 Soporte

- Email: joni92@gmail.com
- Documentación API: `/api/docs/`
- Issues: GitHub Issues

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

Hecho con ❤️ por Jonathan Escritorio
