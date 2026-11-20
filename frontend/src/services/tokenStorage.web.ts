import type { AuthSession, ProtectedDeviceSession } from './api';

let session: AuthSession | null = null;
let protectedDeviceSession: ProtectedDeviceSession | null = null;

export async function getStoredSession(): Promise<AuthSession | null> {
  return session;
}

export async function storeSession(value: AuthSession): Promise<void> {
  session = value;
}

export async function clearStoredSession(): Promise<void> {
  session = null;
}

export async function getProtectedDeviceSession(): Promise<ProtectedDeviceSession | null> {
  return protectedDeviceSession;
}

export async function storeProtectedDeviceSession(
  value: ProtectedDeviceSession
): Promise<void> {
  protectedDeviceSession = value;
}
