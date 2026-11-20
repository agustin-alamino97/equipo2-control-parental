# BAProtege API

Standalone Express API for authentication, device pairing and management, event history, alerts, and blocklist synchronization.

## Local setup

1. Use Node.js 18.11 or newer.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and a private `JWT_SECRET`. Keep real credentials out of source control.
3. Ensure the PostgreSQL database has the tables expected by the services. This backend source does not include schema migrations.
4. Run `npm install`, then `npm run dev`.

The API listens on `PORT` (3000 by default). `CORS_ORIGINS` is a comma-separated allowlist of exact browser origins. The example allows Expo Web on localhost; if opening Expo Web from another computer or a phone browser, add its exact origin (for example `http://192.168.1.25:8081`). Native React Native/Expo Go requests do not send a browser origin, so CORS does not block them. Set the frontend's `EXPO_PUBLIC_API_URL` to the computer's LAN IP for physical-device testing.

## Routes

- `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
- `GET /devices`, `POST /devices/:deviceId/unlink`
- `POST /pairing/generate`, `POST /pairing/consume`
- `GET /events`, `GET /events/alerts`, `PATCH /events/alerts/:id/read`
- `GET /sync/system`
- `GET|POST /sync/custom/user`, `PUT|DELETE /sync/custom/user/:id`
- `GET /sync/custom/device`

The API does not currently implement email confirmation/password recovery, profile read/update, or mode/preference persistence endpoints. Pairing generates six-digit codes. The protected-mode form supplies the device alias, a locally generated device UUID, and the platform/version string required by `/pairing/consume`. Its separate five-digit access PIN is stored locally and is never sent as the pairing code.

The Expo screens guide users through Android permission setup but cannot verify that native permissions are actually enabled. VPN-based filtering, offline event queuing, and continuous background protection are not implemented by this frontend integration.
