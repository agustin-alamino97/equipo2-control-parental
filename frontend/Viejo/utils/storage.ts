import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ONBOARDED: '@baprotege:onboarded',
  USER: '@baprotege:user',
} as const;

export type User = {
  name: string;
  email: string;
  mode: 'responsable' | 'protegido';
};

export async function getOnboarded(): Promise<boolean> {
  return (await AsyncStorage.getItem(KEYS.ONBOARDED)) === 'true';
}

export async function setOnboarded(value = true): Promise<void> {
  if (value) await AsyncStorage.setItem(KEYS.ONBOARDED, 'true');
  else await AsyncStorage.removeItem(KEYS.ONBOARDED);
}

export async function getUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(KEYS.USER);
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function setUser(user: User): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.ONBOARDED, KEYS.USER]);
}
