# Instrucciones de Despliegue

## Backend (Railway)

1. **Crear una cuenta en Railway**:
   - Ve a [Railway.app](https://railway.app/) y crea una cuenta

2. **Instala Railway CLI** (opcional):
   ```
   npm i -g @railway/cli
   railway login
   ```

3. **Inicio rápido**:
   - Crea un nuevo proyecto en Railway
   - Añade un servicio de base de datos PostgreSQL:
     - En el dashboard, haz clic en "New" y selecciona "Database" -> "PostgreSQL"
   - Conecta tu repositorio de GitHub o sube manualmente:
     ```
     railway init
     railway up
     ```

4. **Configura variables de entorno**:
   - `DJANGO_SECRET_KEY` (obligatorio)
   - `DEBUG` (establecer a "False")
   - `DATABASE_URL` (configurado automáticamente por Railway al añadir PostgreSQL)
   - `MERCADOPAGO_ACCESS_VENDEDOR_TOKEN` (si es necesario)
   - `BASE_URL` (tu URL de Railway)

5. **Configuración de la base de datos en Railway**:
   - Railway proporcionará automáticamente una base de datos PostgreSQL
   - La configuración ajustada utilizará automáticamente la variable `DATABASE_URL` de Railway
   - Para realizar migraciones iniciales después del despliegue:
     ```
     railway run python manage.py migrate
     ```
   
   - Si encuentras errores de migraciones inconsistentes:
     ```
     # Ejecutar migraciones con --fake para marcar como completadas
     railway run python manage.py migrate --fake
     
     # Luego ejecutar migraciones normales
     railway run python manage.py migrate
     ```

6. **Comandos útiles**:
   - Para ejecutar migraciones:
     ```
     railway run python manage.py migrate
     ```
   - Para crear un superusuario:
     ```
     railway run python manage.py createsuperuser
     ```

## Frontend (Firebase)

1. **Compilar el frontend**:
   ```
   cd frontend
   npm install
   npm run build
   ```

2. **Instalar Firebase CLI**:
   ```
   npm install -g firebase-tools
   ```

3. **Iniciar sesión en Firebase**:
   ```
   firebase login
   ```

4. **Inicializar el proyecto** (ya está configurado con firebase.json):
   ```
   firebase use predictor-online
   ```

5. **Desplegar a Firebase**:
   ```
   firebase deploy --only hosting
   ```

## Configuración adicional

1. Asegúrate de que el frontend esté configurado para usar la URL del backend de Railway en producción.

2. Si usas autenticación con Firebase, verifica que las reglas de seguridad estén configuradas correctamente.

3. Asegúrate de que CORS esté configurado para permitir solicitudes entre tu frontend en Firebase y tu backend en Railway.
