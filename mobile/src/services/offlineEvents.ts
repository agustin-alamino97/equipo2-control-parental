import axios from 'axios';
import * as Crypto from 'expo-crypto';
import { useAuthStore } from '../store/authStore';
import type { QueuedEvent } from '../types';
import { enqueueEvent, readQueuedEvents, removeQueuedEvents } from './localDatabase';

const baseURL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://10.0.2.2:3000';
const deviceApi = axios.create({ baseURL, timeout: 15000 });

export async function queueProtectionEvent(
  event: Omit<QueuedEvent, 'id' | 'event_time'> & { event_time?: string },
): Promise<void> {
  await enqueueEvent({
    ...event,
    id: Crypto.randomUUID(),
    event_time: event.event_time ?? new Date().toISOString(),
  });
}

let syncInProgress: Promise<number> | null = null;

async function flushQueue(): Promise<number> {
  const { deviceToken, deviceUuid } = useAuthStore.getState();
  if (!deviceToken || !deviceUuid) return 0;
  const queued = await readQueuedEvents();
  if (queued.length === 0) return 0;
  if (queued.some((event) => event.device_uuid !== deviceUuid)) {
    throw new Error('Hay eventos pendientes asociados a otra credencial de dispositivo.');
  }
  await deviceApi.post(
    '/events',
    queued,
    { headers: { Authorization: `Bearer ${deviceToken}` } },
  );
  await removeQueuedEvents(queued.map((event) => event.id));
  return queued.length;
}

export function syncOfflineQueue(): Promise<number> {
  if (syncInProgress) return syncInProgress;
  syncInProgress = flushQueue().finally(() => {
    syncInProgress = null;
  });
  return syncInProgress;
}
