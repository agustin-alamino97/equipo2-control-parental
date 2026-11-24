/**
 * Genera los headers x-timestamp y x-signature y devuelve el rawBody
 * para enviarlo exactamente igual en la petición HTTP.
 *
 * Fórmula esperada por el backend:
 * `${timestamp}:${METHOD}:${pathWithQuery}:${bodyString}`
 */
export async function createHmacHeaders({
  secret,
  method = 'GET',
  pathWithQuery,
  body,
  timestampSeconds,
}) {
  if (!secret || typeof secret !== 'string') {
    throw new Error('Falta secret para generar la firma HMAC.');
  }

  if (!pathWithQuery || !pathWithQuery.startsWith('/')) {
    throw new Error('pathWithQuery debe empezar con "/" (ej. "/events?limit=10").');
  }

  const timestamp = String(
    timestampSeconds ?? Math.floor(Date.now() / 1000)
  );
  const upperMethod = method.toUpperCase();

  const hasBody =
    body !== undefined &&
    body !== null &&
    !(typeof body === 'object' && Object.keys(body).length === 0);

  const rawBody = hasBody ? JSON.stringify(body) : '';
  const payloadToSign = `${timestamp}:${upperMethod}:${pathWithQuery}:${rawBody}`;

  const signature = await signHmacSha256Hex(secret, payloadToSign);

  return {
    headers: {
      'x-timestamp': timestamp,
      'x-signature': signature,
    },
    rawBody,
  };
}

/**
 * Calcula HMAC-SHA256 en hex usando Web Crypto API (navegadores modernos).
 */
async function signHmacSha256Hex(secret, message) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('Web Crypto API (crypto.subtle) no disponible en este entorno.');
  }

  const encoder = new TextEncoder();
  const key = await subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await subtle.sign(
    'HMAC',
    key,
    encoder.encode(message)
  );

  return Array.from(new Uint8Array(signatureBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Wrapper listo para hacer peticiones JSON firmadas con fetch.
 * Envía exactamente el mismo rawBody que se usó para calcular la firma.
 */
export async function signedFetch({
  baseUrl,
  secret,
  method = 'GET',
  pathWithQuery,
  body,
  headers = {},
  timeoutMs = 70000,
}) {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  const { headers: hmacHeaders, rawBody } = await createHmacHeaders({
    secret,
    method,
    pathWithQuery,
    body,
  });

  const mergedHeaders = {
    ...hmacHeaders,
    ...headers,
  };

  if (rawBody) {
    mergedHeaders['Content-Type'] =
      mergedHeaders['Content-Type'] || 'application/json';
  }

  const signal =
    typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
      ? AbortSignal.timeout(timeoutMs)
      : undefined;

  return fetch(`${cleanBaseUrl}${pathWithQuery}`, {
    method: method.toUpperCase(),
    headers: mergedHeaders,
    body: rawBody || undefined,
    signal,
  });
}

// Cómo lo usa Frontend en la práctica
/* import { signedFetch } from './hmacClient';

const res = await signedFetch({
  baseUrl: import.meta.env.VITE_API_URL,
  secret: import.meta.env.VITE_HMAC_SECRET,
  method: 'POST',
  pathWithQuery: '/events?priority=high',
  body: { type: 'alert', note: 'Prueba desde front' },
});

const data = await res.json(); */