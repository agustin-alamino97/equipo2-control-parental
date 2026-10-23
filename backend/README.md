# 🛠️ Backend - Sistema de Control Parental (Equipo 2)

Este directorio contiene la API REST encargada de la autenticación de usuarios, vinculación de dispositivos, reporte y consulta de eventos/alertas, así como la sincronización de reglas de bloqueo (`system_blocklist` y `custom_blocklist`).

---

## 🚀 Guía de Instalación y Ejecución

Sigue estos pasos para levantar el servidor de desarrollo localmente:

### Prerrequisitos

**Node.js**: Asegúrate de tener instalado Node.js (versión 18 o superior recomendada). Puedes descargarlo desde [nodejs.org](https://nodejs.org/).


### Pasos para ejecutar:

1. **Abrir la terminal o PowerShell** en la carpeta `backend`:
   ```bash
   cd backend
   ```

2. **Instalar dependencias** (*Nota: Este paso se ejecuta **únicamente la primera vez** o cuando se añadan nuevos paquetes al proyecto*):
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env` en la raíz de la carpeta `backend/` configurando las variables necesarias (ej. `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`).

4. **Iniciar el servidor**:
   * En modo desarrollo (con auto-reload vía nodemon):
     ```bash
     npm run dev
     ```
   * Ejecución directa con Node:
     ```bash
     node src/index.js
     ```

---

## 📡 Documentación Completa de Endpoints HTTP

A continuación se detallan todas las peticiones que forman el ciclo completo de la aplicación.

---

### 🔑 1. Autenticación de Usuarios (Tutor)

Maneja el registro y la sesión de los tutores.

#### A. Registro de Usuario (Tutor)
Crea una nueva cuenta de tutor en el sistema.
* **Método**: `POST`
* **Ruta**: `localhost:3000/auth/register`
* **Headers**: `Content-Type: application/json`
* **Body (JSON)**:
  ```json
  {
    "name": "Tutor",
    "surname": "Ejemplo",
    "email": "tutor@ejemplo.com",
    "password": "Password123!"
  }
  ```
* **Respuesta Exitosa (201)**:
  ```json
  {
    "message": "Usuario registrado exitosamente",
    "user": {
      "id": "4502f842-25d7-4de5-bd54-83b5078fa7da",
      "name": "Tutor",
      "surname": "Ejemplo",
      "email": "tutor@ejemplo.com",
      "creation_time": "2026-10-19T23:34:28.607Z"
    }
  }
  ```

#### B. Iniciar Sesión (Login)
Autentica al tutor y le provee un token JWT.
* **Método**: `POST`
* **Ruta**: `localhost:3000/auth/login`
* **Headers**: `Content-Type: application/json`
* **Body (JSON)**:
  ```json
  {
    "email": "tutor@ejemplo.com",
    "password": "Password123!",
    "push_token": "tokenPush123454321"
  }
  ```
* **Respuesta Exitosa (200)**:
  ```json
  {
    "message": "Login exitoso",
    "user": {
      "id": "4502f842-25d7-4de5-bd54-83b5078fa7da",
      "email": "tutor@ejemplo.com",
      "name": "Tutor"
    },
    "JWT": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ1MDJmODQyLTI1ZDctNGRlNS1iZDU0LTgzYjUwNzhmYTdkYSIsImVtYWlsIjoidHV0b3JAZWplbXBsby5jb20iLCJpYXQiOjE3OTI0NTI5ODAsImV4cCI6MTc5MjUzOTM4MH0.9o1iUFsG8CrBOktiDHsK4LNqlt4Adp5Ic3tGiYLRjSQ",
    "refresh_token": "2aa8b8ac7ab50de97429a0030b8c31356e6fcc2029836c3f1714d7712298c5f99b1c8f69f377c5d6"
  }
  ```

#### C. Refresh (Tutor)
Obtiene un nuevo JWT (24h) presentando su refresh token.
* **Método**: `POST`
* **Ruta**: `localhost:3000/auth/refresh`
* **Headers**: `Content-Type: application/json`
* **Body (JSON)**:
  ```json
  {
    "refresh_token": "2aa8b8ac7ab50de97429a0030b8c31356e6fcc2029836c3f1714d7712298c5f99b1c8f69f377c5d6"
  }
  ```
* **Respuesta Exitosa (201)**:
  ```json
  {
  "message": "Token refrescado con éxito",
  "JWT": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZDUxOGQwLTFkZGItNDIxZS1hODFhLWQ5OGFjYTRmNGFmOCIsImlhdCI6MTc5MjY5NzU3MSwiZXhwIjoxNzkyNzgzOTcxfQ.8i_kT4iRfNmcJtIyIMg8zqnE4-0XHzfwcuvPkCeT81A"
   }
  ```

#### D. Logout (Tutor)
Crea una nueva cuenta de tutor en el sistema.
* **Método**: `POST`
* **Ruta**: `localhost:3000/auth/logout`
* **Headers**: `Authorization: Bearer <JWT_DEL_TUTOR>`
* **Respuesta Exitosa (201)**:
  ```json
  {
  "message": "Sesión cerrada exitosamente en este dispositivo."
   }
  ```

---

### 📲 2. Vinculación y Gestión de Dispositivos

Gestión del enlace entre la cuenta del tutor y los dispositivos protegidos.

#### A. Generar Código de Vinculación (Tutor)
El tutor genera un código temporal (ej. de 6 dígitos) para ingresar en el dispositivo del menor.
* **Método**: `POST`
* **Ruta**: `localhost:3000/pairing/generate`
* **Headers**: `Authorization: Bearer <JWT_DEL_TUTOR>`
* **Respuesta Exitosa (201)**:
  ```json
  {
    "message": "Código de vinculación generado con éxito",
    "code": "341946",
    "expiresAt": "2026-10-19T23:52:07.861Z"
  }
  ```

#### B. Consumir Código de Vinculación (Dispositivo Protegido)
El dispositivo protegido envía el código generado para vincularse y obtener su `device_token`.
* **Método**: `POST`
* **Ruta**: `localhost:3000/pairing/consume`
* **Headers**: `Content-Type: application/json`
* **Body (JSON)**:
  ```json
  {
    "code": "341946",
    "alias_name": "Ana",
    "birth_date": "2014-08-21",
    "gender": "Femenino",
    "device_uuid": "android-device-pairing-12345",
    "os_model": "Galaxy s10",
    "push_token": "pushToken_abc23454321"
  }
  ```
* **Respuesta Exitosa (200)**:
  ```json
  {
    "message": "Dispositivo vinculado con éxito",
    "device": {
      "id": "8bd693c0-1b9a-4b07-a059-72986a29b594",
      "id_user": "4502f842-25d7-4de5-bd54-83b5078fa7da",
      "alias_name": "Ana",
      "birth_date": "2014-08-21T03:00:00.000Z",
      "gender": "Femenino",
      "device_uuid": "android-device-pairing-12345",
      "os_model": "Galaxy s10",
      "protection_status": true,
      "linked": true,
      "push_token": "pushToken_abc23454321",
      "last_ping": "2026-10-19T23:39:08.849Z",
      "creation_time": "2026-10-19T12:38:23.445Z",
      "device_token": "dev_ak_8ce3d754ee8042908352ef6f3f03c4fcc7f1a9e395a5c3526c1eb3fd8328b237"
    }
  }
  ```

#### C. Consultar Dispositivos Vinculados (Tutor)
Lista todos los dispositivos asociados a la cuenta del tutor.
* **Método**: `GET`
* **Ruta**: `localhost:3000/devices`
* **Headers**: `Authorization: Bearer <JWT_DEL_TUTOR>`
* **Respuesta Exitosa (200)**:
  ```json
  {
     "devices": [
       {
         "id": "132ccd04-277f-4702-b349-72794d20cdf2",
         "device_uuid": "android-device-pairing-12345",
         "alias_name": "Ana",
         "os_model": "Android 13",
         "protection_status": true,
         "linked": true,
         "last_ping": "2026-10-23T22:49:29.108Z",
         "creation_time": "2026-10-23T22:49:29.108Z"
       }
     ]
   }
  ```

#### D. Desvincular Dispositivo (Tutor)
Desvincula un dispositivo de la cuenta del tutor (`linked = false`).
* **Método**: `PATCH`
* **Ruta**: `localhost:3000/devices/:id/unlink`
* **Headers**: `Authorization: Bearer <JWT_DEL_TUTOR>`
* **Respuesta Exitosa (200)**:
  ```json
  {
     "message": "Dispositivo desvinculado y credencial revocada con éxito",
     "device": {
       "id": "8bd693c0-1b9a-4b07-a059-72986a29b594",
       "alias_name": "Ana",
       "linked": false,
       "protection_status": false
     }
   }
  ```

---

### 📊 3. Eventos y Alertas

Manejo del historial de actividad e incidentes reportados por el dispositivo.

#### A. Generar Evento (Dispositivo Protegido)
Registra un evento de actividad o intento de acceso bloqueado desde el dispositivo.
* **Método**: `POST`
* **Ruta**: `localhost:3000/events`
* **Headers**: 
  * `Authorization: Bearer <DEVICE_TOKEN>`
  * `Content-Type: application/json`
* **Body (JSON)**:
  ```json
  {
    "device_uuid": "android-device-pairing-12345",
    "event_type": "domain",
    "value": "https://www.bet365.com/index"
  }
  ```
* **Respuesta Exitosa (201)**:
  ```json
  {
     "message": "Evento registrado con éxito",
     "event": {
       "id": "17eaf8bf-a03b-440d-bbe2-cb0784f2be38",
       "event_type": "domain",
       "value": "bet365.com",
       "category": "LOTBA Oficial",
       "action": "block",
       "event_time": "2026-10-23T22:59:08.374Z",
       "alert_generated": true
     }
   }
  ```

#### B. Consultar Eventos (Tutor)
Permite al tutor consultar el historial de eventos con opción a filtrado por dispositivo.
* **Método**: `GET`
* **Ruta**: `localhost:3000/events
* **Headers**: `Authorization: Bearer <JWT_DEL_TUTOR>`
* **Respuesta Exitosa (200)**:
  ```json
  {
  "count": 1,
  "events": [
      {
         "id": "17eaf8bf-a03b-440d-bbe2-cb0784f2be38",
         "id_device": "132ccd04-277f-4702-b349-72794d20cdf2",
         "alias_name": "Ana",
         "os_model": "Android 13",
         "event_type": "domain",
         "value": "bet365.com",
         "category": "LOTBA Oficial",
         "action": "block",
         "event_time": "2026-10-23T22:59:08.374Z",
         "es_critico": true
       }
    ]
  }
  ```

#### C. Consultar Alertas (Tutor)
Obtiene las alertas críticas que requieren atención prioritaria.
* **Método**: `GET`
* **Ruta**: `localhost:3000/alerts`
* **Headers**: `Authorization: Bearer <JWT_DEL_TUTOR>`
* **Respuesta Exitosa (200)**:
  ```json
  {
    "count": 1,
    "alerts": [
       {
         "id": "8bcb9638-6082-4ab2-9642-fd4564ea238b",
         "id_event": "17eaf8bf-a03b-440d-bbe2-cb0784f2be38",
         "event_type": "domain",
         "value": "bet365.com",
         "device_name": "Ana",
         "severity": "critical",
         "message": "Infracción detectada (domain) en bet365.com para el dispositivo Ana",
         "read": false,
         "alert_time": "2026-10-23T22:59:08.374Z"
       }
     ]
  }
  ```

---

### 🛡️ 4. Blocklist del Sistema (`system_blocklist`)

Listas globales de dominios y palabras clave administradas por el sistema.

#### A. Sincronización de System Blocklist (Dispositivo Protegido)
Sincroniza la lista global de categorías de bloqueo predefinidas.
(El **checksum** es un algoritmo md5, ver sync.services.js)
* **Método**: `GET`
* **Ruta**: `localhost:3000/sync/system`
* **Headers**: `Authorization: Bearer <DEVICE_TOKEN>`
* **Query Parameters**:
  * `version` 
  * `checksum`
* **Ejemplo de URL**:
  `GET localhost:3000/sync/system?version=1&checksum=2128`
* **Requiere actualización**:
  ```json
  {
     "success": true,
     "status": "RESET",
     "current_version": 1,
     "checksum": "6ba4cd8106123e8c5e607498b11eabe1",
     "data": {
       "total": 2129,
       "domain": [
        "bplay.org",
        "betway.com",
        ...
      ],
      "keyword": [],
      "regex": [
        "^https?://(?:www\\.)?casino\\-x\\.com/en$",
        "^https?://(?:www\\.)?casinobordeaux\\.com/\\?lang=en$",
        ...
      ],
      "syncedAt": "2026-10-19T23:54:50.287Z"
    }
  }
  ```
  **Está al día**:
  ```json
  {
     "success": true,
     "status": "UP_TO_DATE",
     "current_version": 1,
     "checksum": "6ba4cd8106123e8c5e607498b11eabe1",
     "syncedAt": "2026-10-23T23:02:09.403Z"
   }
  ```

---

### ✏️ 5. Blocklist Personalizada (`custom_blocklist`)

Listas de dominios y palabras clave configuradas individualmente por cada tutor.

#### A. Crear / Actualizar Regla Personalizada (Tutor)
Agrega o modifica una regla personalizada. Se dispara notificación Push silenciosa a los dispositivos vinculados.
* **Método**: `POST`
* **Ruta**: `localhost:3000/sync/custom/user`
* **Headers**: 
  * `Authorization: Bearer <JWT_DEL_TUTOR>`
  * `Content-Type: application/json`
* **Query 
* **Body (JSON)**:
  ```json
  {
    "value": "instagram.com",
    "rule_type": "domain"
  }
  ```
  *(Tipos permitidos para `rule_type`: `"domain"` o `"keyword"`)*
* **Respuesta Exitosa (200 / 201)**:
  ```json
  {
     "success": true,
     "message": "Regla agregada o actualizada correctamente",
     "data": {
       "id": "c097d78f-09f2-44dd-a31e-ce95b4de2e7e",
       "value": "http://instagram.com",
       "rule_type": "domain",
       "creation_time": "2026-10-23T23:08:06.104Z"
     },
     "notifiedDevicesCount": 1
   }
  ```

#### B. Obtener Reglas Personalizadas del Tutor (Tutor)
* **Método**: `GET`
* **Ruta**: `localhost:3000/sync/custom/user`
* **Headers**: `Authorization: Bearer <JWT_DEL_TUTOR>`
* **Respuesta Exitosa (200)**:
  ```json
  {
    "success": true,
    "data": {
      "total": 1,
      "domain": [
        "instagram.com"
      ],
      "keyword": [],
      "updatedAt": "2026-10-20T00:08:00.154Z"
    }
  }
  ```

#### C. Sincronización de Custom Blocklist (Dispositivo Protegido)
Sincroniza las reglas personalizadas activas del tutor asociado al dispositivo.
(Acá el **checksum** también es resultado de un algoritmo md5, ver sync.services.js)
* **Método**: `GET`
* **Ruta**: `localhost:3000/sync/custom/device`
* **Headers**: `Authorization: Bearer <DEVICE_TOKEN>`
* **Query Parameters**:
  * `device_uuid` (requerido)
  * `client_timestamp` (requerido)
  * `client_checksum` (requerido)
* **Ejemplo de URL**:
  `GET localhost:3000/sync/custom/device?device_uuid=android-device-pairing-12345&client_timestamp=0&client_checksum=0`
* **Respuestas del Servidor**:

  **1. Requiere actualización (Estado `RESET`):**
  ```json
  {
     "success": true,
     "data": {
       "status": "RESET",
       "current_timestamp": 1792797782838,
       "checksum": "38c54b3905da654071a415d62454d7dd",
       "data": {
         "total": 1,
         "domain": [
           "instagram.com"
         ],
         "keyword": [],
         "syncedAt": "2026-10-23T23:28:25.151Z"
       }
     }
   }
  ```

  **2. Dispositivo al día (Estado `UP_TO_DATE`):**
  ```json
  {
     "success": true,
     "data": {
       "status": "UP_TO_DATE",
       "current_timestamp": 1792797782838,
       "checksum": "38c54b3905da654071a415d62454d7dd",
       "syncedAt": "2026-10-23T23:29:48.506Z"
     }
   }

---

## 🔒 Middlewares de Seguridad

1. **`authMiddleware`**: Aplicado en las rutas del Tutor. Requiere un token JWT válido expedido en `/login`.
2. **`deviceAuthMiddleware`**: Aplicado en las rutas del Dispositivo Protegido.
   * Valida la presencia de `Bearer <DEVICE_TOKEN>` en la cabecera `Authorization`.
   * Realiza **validación cruzada** verificando que el `device_uuid` recibido (vía `req.query` en `GET` o `req.body` en `POST`) coincida con el registrado en la base de datos y que `linked === true`.
