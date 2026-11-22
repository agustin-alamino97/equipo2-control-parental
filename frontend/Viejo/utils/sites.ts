import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  PERSONALIZADOS: '@baprotege:sites:personalizados',
  LISTA_NEGRA: '@baprotege:sites:lista-negra',
} as const;

export async function getSitiosPersonalizados(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEYS.PERSONALIZADOS);
  return raw ? JSON.parse(raw) : [];
}

export async function addSitioPersonalizado(site: string): Promise<string[]> {
  const current = await getSitiosPersonalizados();
  const clean = site.trim().toLowerCase();
  if (!clean || current.includes(clean)) return current;
  const updated = [...current, clean];
  await AsyncStorage.setItem(KEYS.PERSONALIZADOS, JSON.stringify(updated));
  return updated;
}

export async function removeSitioPersonalizado(site: string): Promise<string[]> {
  const current = await getSitiosPersonalizados();
  const updated = current.filter(s => s !== site);
  await AsyncStorage.setItem(KEYS.PERSONALIZADOS, JSON.stringify(updated));
  return updated;
}

const DEFAULT_BLACKLIST = [
  'lutixa-streaming.com', 'lutixa-juegos.com', 'lutixa-adult.com',
  'lutixa-apuestas.com', 'lutixa-chat.com', 'lutixa-redes.com', 'lutixa-compras.com',
];

export async function getListaNegra(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEYS.LISTA_NEGRA);
  return raw ? JSON.parse(raw) : DEFAULT_BLACKLIST;
}

export async function addSitioListaNegra(site: string): Promise<string[]> {
  const current = await getListaNegra();
  const clean = site.trim().toLowerCase();
  if (!clean || current.includes(clean)) return current;
  const updated = [...current, clean];
  await AsyncStorage.setItem(KEYS.LISTA_NEGRA, JSON.stringify(updated));
  return updated;
}

export async function removeSitioListaNegra(site: string): Promise<string[]> {
  const current = await getListaNegra();
  const updated = current.filter(s => s !== site);
  await AsyncStorage.setItem(KEYS.LISTA_NEGRA, JSON.stringify(updated));
  return updated;
}

export async function resetSites(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.PERSONALIZADOS, KEYS.LISTA_NEGRA]);
}