import {
  clearStoredSession,
  getProtectedDeviceSession,
  getStoredSession,
  storeProtectedDeviceSession,
  storeSession,
} from './tokenStorage';

export interface ApiUser {
  id: string;
  name?: string | null;
  surname?: string | null;
  email: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: ApiUser;
}

export interface ApiDevice {
  id: string;
  device_uuid: string;
  alias_name: string;
  os_model?: string | null;
  protection_status: boolean;
  status: string;
  last_ping?: string | null;
  creation_time?: string | null;
}

export interface ApiEvent {
  id: string;
  alias_name?: string | null;
  value: string;
  action?: string | null;
  event_type: string;
  event_time: string;
}

export interface ApiAlert {
  id: string;
  event_type: string;
  value: string;
  device_name: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  read: boolean;
  alert_time: string;
}

export interface ApiRule {
  id: string;
  value: string;
  rule_type: 'domain' | 'keyword';
}

export interface PairingCode {
  code: string;
  expiresAt: string;
}

export interface ProtectedDeviceSession {
  deviceToken: string;
  deviceUuid: string;
  aliasName: string;
  localAccessCode?: string;
  protectionSetupComplete?: boolean;
}

export interface SystemBlocklist {
  status: 'RESET' | 'UP_TO_DATE';
  current_version?: number;
  checksum?: string;
  data?: {
    total: number;
    domain: string[];
    keyword: string[];
    regex: string[];
  };
}

export interface ProtectedRulesSync {
  status: 'RESET' | 'UP_TO_DATE';
  current_timestamp?: number;
  checksum?: string;
  data?: {
    total: number;
    domain: string[];
    keyword: string[];
    syncedAt: string;
  };
}

interface PairingPayload {
  code: string;
  alias_name: string;
  device_uuid: string;
  os_model: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getApiBaseUrl(): string {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '');
  if (!baseUrl) {
    throw new Error('Falta configurar EXPO_PUBLIC_API_URL en el archivo .env.');
  }
  return baseUrl;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let payload: Record<string, unknown> = {};

  if (text) {
    try {
      payload = JSON.parse(text) as Record<string, unknown>;
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    const message =
      (typeof payload.error === 'string' && payload.error) ||
      (typeof payload.message === 'string' && payload.message) ||
      `Error del servidor (${response.status}).`;
    throw new ApiError(message, response.status);
  }

  return payload as T;
}

async function refreshSession(session: AuthSession): Promise<AuthSession | null> {
  const response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: session.refreshToken }),
  });

  if (!response.ok) {
    await clearStoredSession();
    return null;
  }

  const refreshed = await parseResponse<{ JWT: string }>(response);
  const nextSession = { ...session, accessToken: refreshed.JWT };
  await storeSession(nextSession);
  return nextSession;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  authMode: 'user' | 'device' | 'none' = 'user',
  retryAfterRefresh = true
): Promise<T> {
  const session = authMode === 'user' ? await getStoredSession() : null;
  const protectedDevice =
    authMode === 'device' ? await getProtectedDeviceSession() : null;
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  } else if (protectedDevice?.deviceToken) {
    headers.set('Authorization', `Bearer ${protectedDevice.deviceToken}`);
  }

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisá la URL y la conexión.');
  }

  if (
    response.status === 401 &&
    session?.refreshToken &&
    retryAfterRefresh
  ) {
    const refreshedSession = await refreshSession(session);
    if (refreshedSession) {
      return request<T>(path, options, authMode, false);
    }
  }

  return parseResponse<T>(response);
}

function jsonBody(value: unknown): string {
  return JSON.stringify(value);
}

export async function register(input: {
  name: string;
  surname: string;
  email: string;
  password: string;
}): Promise<ApiUser> {
  const response = await request<{ user: ApiUser }>(
    '/auth/register',
    { method: 'POST', body: jsonBody(input) },
    'none'
  );
  return response.user;
}

export async function login(
  email: string,
  password: string,
  profile?: Partial<ApiUser>
): Promise<AuthSession> {
  const response = await request<{
    JWT: string;
    refresh_token: string;
    user: ApiUser;
  }>(
    '/auth/login',
    { method: 'POST', body: jsonBody({ email, password }) },
    'none'
  );
  const session: AuthSession = {
    accessToken: response.JWT,
    refreshToken: response.refresh_token,
    user: { ...profile, ...response.user },
  };
  await storeSession(session);
  return session;
}

export async function logout(): Promise<void> {
  try {
    await request('/auth/logout', { method: 'POST' });
  } finally {
    await clearStoredSession();
  }
}

export async function getDevices(): Promise<ApiDevice[]> {
  const response = await request<{ devices: ApiDevice[] }>('/devices');
  return response.devices;
}

export async function requestDeviceUnlink(deviceId: string): Promise<void> {
  await request(`/devices/${encodeURIComponent(deviceId)}/unlink`, {
    method: 'POST',
  });
}

export async function generatePairingCode(): Promise<PairingCode> {
  return request('/pairing/generate', { method: 'POST' });
}

export async function consumePairingCode(
  payload: PairingPayload
): Promise<ProtectedDeviceSession> {
  const response = await request<{
    device: ApiDevice;
    device_token: string;
  }>(
    '/pairing/consume',
    { method: 'POST', body: jsonBody(payload) },
    'none'
  );
  const session: ProtectedDeviceSession = {
    deviceToken: response.device_token,
    deviceUuid: response.device.device_uuid,
    aliasName: response.device.alias_name,
  };
  await storeProtectedDeviceSession(session);
  return session;
}

export async function getProtectedDeviceDetails(): Promise<ProtectedDeviceSession | null> {
  return getProtectedDeviceSession();
}

export async function completeProtectedDeviceSetup(
  localAccessCode: string
): Promise<void> {
  const session = await getProtectedDeviceSession();
  if (!session) {
    throw new Error('Este dispositivo todavía no está vinculado.');
  }
  await storeProtectedDeviceSession({
    ...session,
    localAccessCode,
    protectionSetupComplete: true,
  });
}

export async function getEvents(): Promise<ApiEvent[]> {
  const response = await request<{ events: ApiEvent[] }>('/events');
  return response.events;
}

export async function getAlerts(): Promise<ApiAlert[]> {
  const response = await request<{ alerts: ApiAlert[] }>('/events/alerts');
  return response.alerts;
}

export async function markAlertRead(alertId: string): Promise<void> {
  await request(`/events/alerts/${encodeURIComponent(alertId)}/read`, {
    method: 'PATCH',
  });
}

export async function getCustomRules(): Promise<ApiRule[]> {
  const response = await request<{
    data: { domain: ApiRule[]; keyword: ApiRule[] };
  }>('/sync/custom/user');
  return [...response.data.domain, ...response.data.keyword];
}

export async function syncProtectedRules(): Promise<ProtectedRulesSync> {
  const device = await getProtectedDeviceSession();
  if (!device) {
    throw new Error('Este dispositivo todavía no está vinculado.');
  }
  const query = new URLSearchParams({
    device_uuid: device.deviceUuid,
    client_timestamp: '0',
    client_checksum: '0',
  });
  const response = await request<{ data: ProtectedRulesSync }>(
    `/sync/custom/device?${query.toString()}`,
    {},
    'device'
  );
  return response.data;
}

export async function addCustomRule(
  value: string,
  ruleType: ApiRule['rule_type']
): Promise<ApiRule> {
  const response = await request<{ data: ApiRule }>('/sync/custom/user', {
    method: 'POST',
    body: jsonBody({ value, rule_type: ruleType }),
  });
  return response.data;
}

export async function deleteCustomRule(ruleId: string): Promise<void> {
  await request(`/sync/custom/user/${encodeURIComponent(ruleId)}`, {
    method: 'DELETE',
  });
}

export async function getSystemBlocklist(): Promise<{
  status: 'RESET' | 'UP_TO_DATE';
  current_version?: number;
  checksum?: string;
  total: number;
  domain: string[];
  keyword: string[];
  regex: string[];
}> {
  const response = await request<SystemBlocklist>('/sync/system', {}, 'none');
  return {
    status: response.status,
    current_version: response.current_version,
    checksum: response.checksum,
    total: response.data?.total ?? 0,
    domain: response.data?.domain ?? [],
    keyword: response.data?.keyword ?? [],
    regex: response.data?.regex ?? [],
  };
}
