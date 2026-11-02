import { create } from 'zustand';
import { api } from '../services/api';
import {
  deleteSecureItemAsync,
  getSecureItemAsync,
  isSecureStorageAvailable,
  setSecureItemAsync,
} from '../services/secureStorage';
import type { AppMode, User } from '../types';

const SESSION_KEY = 'responsible-session';
const DEVICE_KEY = 'protected-device';
const MODE_KEY = 'app-mode';

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface ProtectedDevice {
  deviceToken: string;
  deviceUuid: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  deviceToken: string | null;
  deviceUuid: string | null;
  mode: AppMode | null;
  isReady: boolean;
  initialize: () => Promise<void>;
  setMode: (mode: AppMode) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    surname: string;
    email: string;
    password: string;
  }) => Promise<void>;
  saveProtectedDevice: (deviceToken: string, deviceUuid: string) => Promise<void>;
  clearSession: () => Promise<void>;
  logout: () => Promise<void>;
  clearProtectedDevice: () => Promise<void>;
}

function isUser(value: unknown): value is User {
  if (!value || typeof value !== 'object') return false;
  const user = value as Record<string, unknown>;
  return (
    (typeof user.id === 'string' || typeof user.id === 'number')
    && typeof user.email === 'string'
    && typeof user.name === 'string'
  );
}

function readAuthResponse(value: unknown): AuthResponse {
  if (!value || typeof value !== 'object') throw new Error('La sesión guardada no es válida.');
  const session = value as Record<string, unknown>;
  if (
    !isUser(session.user)
    || typeof session.token !== 'string'
    || typeof session.refreshToken !== 'string'
  ) {
    throw new Error('La sesión guardada está incompleta.');
  }
  return {
    user: session.user,
    token: session.token,
    refreshToken: session.refreshToken,
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  deviceToken: null,
  deviceUuid: null,
  mode: null,
  isReady: false,

  initialize: async () => {
    const [savedSession, savedDevice, savedMode] = await Promise.all([
      getSecureItemAsync(SESSION_KEY),
      getSecureItemAsync(DEVICE_KEY),
      getSecureItemAsync(MODE_KEY),
    ]);

    const session = savedSession ? readAuthResponse(JSON.parse(savedSession) as unknown) : null;
    let device: ProtectedDevice | null = null;
    if (savedDevice) {
      const parsed: unknown = JSON.parse(savedDevice);
      if (
        parsed
        && typeof parsed === 'object'
        && typeof (parsed as Record<string, unknown>).deviceToken === 'string'
        && typeof (parsed as Record<string, unknown>).deviceUuid === 'string'
      ) {
        device = parsed as ProtectedDevice;
      } else {
        throw new Error('La configuración protegida guardada no es válida.');
      }
    }

    const mode = savedMode === 'responsible' || savedMode === 'protected' ? savedMode : null;
    set({
      user: session?.user ?? null,
      token: session?.token ?? null,
      deviceToken: device?.deviceToken ?? null,
      deviceUuid: device?.deviceUuid ?? null,
      mode,
      isReady: true,
    });
  },

  setMode: async (mode) => {
    await setSecureItemAsync(MODE_KEY, mode);
    set({ mode });
  },

  login: async (email, password) => {
    if (!isSecureStorageAvailable()) {
      throw new Error('Iniciá sesión desde la aplicación móvil para guardar tus credenciales de forma segura.');
    }
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    const session = readAuthResponse(data);
    await setSecureItemAsync(SESSION_KEY, JSON.stringify(session));
    await setSecureItemAsync(MODE_KEY, 'responsible');
    set({ ...session, mode: 'responsible' });
  },

  register: async (data) => {
    if (!isSecureStorageAvailable()) {
      throw new Error('Creá tu cuenta desde la aplicación móvil para mantener protegidas tus credenciales.');
    }
    await api.post('/auth/register', data);
  },

  saveProtectedDevice: async (deviceToken, deviceUuid) => {
    if (!isSecureStorageAvailable()) {
      throw new Error('Vinculá este dispositivo desde la aplicación móvil para proteger sus credenciales.');
    }
    await setSecureItemAsync(DEVICE_KEY, JSON.stringify({ deviceToken, deviceUuid }));
    await setSecureItemAsync(MODE_KEY, 'protected');
    set({ deviceToken, deviceUuid, mode: 'protected' });
  },

  clearSession: async () => {
    await deleteSecureItemAsync(SESSION_KEY);
    set({ user: null, token: null });
  },

  logout: async () => {
    await deleteSecureItemAsync(SESSION_KEY);
    await setSecureItemAsync(MODE_KEY, 'responsible');
    set({ user: null, token: null, mode: 'responsible' });
  },

  clearProtectedDevice: async () => {
    await deleteSecureItemAsync(DEVICE_KEY);
    await deleteSecureItemAsync(MODE_KEY);
    set({ deviceToken: null, deviceUuid: null, mode: null });
  },
}));
