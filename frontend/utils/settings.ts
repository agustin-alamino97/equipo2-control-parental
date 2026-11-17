import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@baprotege:settings';

export type Settings = {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  vibrateEnabled: boolean;
  language: 'es' | 'en';
  theme: 'light' | 'dark' | 'system';
};

export const DEFAULT_SETTINGS: Settings = {
  notificationsEnabled: true,
  soundEnabled: true,
  vibrateEnabled: true,
  language: 'es',
  theme: 'system',
};

export async function getSettings(): Promise<Settings> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}