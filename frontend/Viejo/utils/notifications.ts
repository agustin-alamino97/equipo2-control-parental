import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@baprotege:notifications';

export type Alert = {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
  createdAt: number;
};

const DEFAULT_ALERTS: Alert[] = [
  { id: '1', title: 'Nuevo dispositivo vinculado', body: 'Se vinculó "Tablet de Niño".', type: 'success', read: false, createdAt: Date.now() - 60000 * 5 },
  { id: '2', title: 'Sitio bloqueado', body: 'Se bloqueó "lutixa-apuestas.com".', type: 'warning', read: false, createdAt: Date.now() - 60000 * 60 * 2 },
  { id: '3', title: 'Intento de desinstalación', body: 'Alguien intentó desinstalar BA Protege+.', type: 'warning', read: false, createdAt: Date.now() - 60000 * 60 * 24 },
  { id: '4', title: 'PIN actualizado', body: 'El PIN del dispositivo fue cambiado.', type: 'info', read: true, createdAt: Date.now() - 60000 * 60 * 48 },
];

export async function getAlerts(): Promise<Alert[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) {
    await AsyncStorage.setItem(KEY, JSON.stringify(DEFAULT_ALERTS));
    return DEFAULT_ALERTS;
  }
  return JSON.parse(raw);
}

export async function markAsRead(id: string): Promise<Alert[]> {
  const alerts = await getAlerts();
  const updated = alerts.map(a => (a.id === id ? { ...a, read: true } : a));
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export async function markAllAsRead(): Promise<Alert[]> {
  const alerts = await getAlerts();
  const updated = alerts.map(a => ({ ...a, read: true }));
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export async function getUnreadCount(): Promise<number> {
  return (await getAlerts()).filter(a => !a.read).length;
}