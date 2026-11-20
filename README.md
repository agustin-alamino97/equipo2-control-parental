# BAProtege

Aplicación Expo y API Express en proyectos independientes: `frontend/` y `backend/`.

## Requisitos

- Node.js 22.13 o superior
- PostgreSQL con las tablas requeridas por el backend (este repositorio no incluye migraciones)

## Ejecutar localmente

Iniciá cada proceso en una terminal distinta.

### Backend

```powershell
cd C:\_dev\BAProtege-main\backend
if (!(Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
npm install
npm run dev
```

En `backend/.env`, configura `DATABASE_URL`, `DB_SSL=false` para PostgreSQL local y un `JWT_SECRET` privado. La API escucha en el puerto `3000`.

### Frontend

```powershell
cd C:\_dev\BAProtege-main\frontend
if (!(Test-Path .env)) { Copy-Item .env.example .env }
npm install
npx expo start
```

`frontend/.env` usa `EXPO_PUBLIC_API_URL=http://localhost:3000` para web y simuladores locales. Para Expo Go en un teléfono físico, usa `http://<IPv4-de-la-PC>:3000` (obtené la IP con `ipconfig`). Para Android Emulator, usa `http://10.0.2.2:3000`.

Para Expo Web en una IP LAN, agrega el origen exacto del frontend a `CORS_ORIGINS` en `backend/.env` (por ejemplo, `http://192.168.1.25:8081`). Las llamadas nativas de React Native no envían `Origin`; CORS solo aplica al navegador. Ver [backend/README.md](./backend/README.md).

La app muestra estados de carga, error, desconexión, código vencido y actualización pendiente. La validación efectiva de permisos Android, la VPN de filtrado y la cola de eventos offline requieren implementación nativa adicional.
