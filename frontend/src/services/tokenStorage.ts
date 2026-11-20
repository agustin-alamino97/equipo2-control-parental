import * as SecureStore from 'expo-secure-store';
import type { AuthSession, ProtectedDeviceSession } from './api';

const SESSION_KEY = 'ba-protege-auth-session';
const PROTECTED_DEVICE_KEY = 'ba-protege-protected-device';

export async function getStoredSession(): Promise<AuthSession | null> {
  const value = await SecureStore.getItemAsync(SESSION_KEY);
  return value ? (JSON.parse(value) as AuthSession) : null;
}

export async function storeSession(session: AuthSession): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function clearStoredSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

export async function getProtectedDeviceSession(): Promise<ProtectedDeviceSession | null> {
  const value = await SecureStore.getItemAsync(PROTECTED_DEVICE_KEY);
  return value ? (JSON.parse(value) as ProtectedDeviceSession) : null;
}

export async function storeProtectedDeviceSession(
  session: ProtectedDeviceSession
): Promise<void> {
  await SecureStore.setItemAsync(PROTECTED_DEVICE_KEY, JSON.stringify(session));
}
