import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import type { ApiError } from '../types';

const baseURL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://10.0.2.2:3000';

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
      await useAuthStore.getState().clearSession();
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    if (error.response?.status === 429) {
      return 'Hay muchas solicitudes en poco tiempo. Esperá un momento e intentá nuevamente.';
    }
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return 'La solicitud tardó demasiado. Revisá la conexión e intentá nuevamente.';
    }
    if (!error.response && error.request) {
      return 'No se pudo conectar con el servidor. Revisá la conexión e intentá nuevamente.';
    }
    return error.response?.data?.error
      ?? error.response?.data?.message
      ?? error.message
      ?? 'No se pudo completar la solicitud.';
  }
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
}
