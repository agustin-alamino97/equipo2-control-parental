import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const MODE_KEY = 'app-mode';
const browserValues = new Map<string, string>();

export function isSecureStorageAvailable(): boolean {
  return Platform.OS !== 'web';
}

export function getSecureItemAsync(key: string): Promise<string | null> {
  if (!isSecureStorageAvailable()) {
    return Promise.resolve(browserValues.get(key) ?? null);
  }
  return SecureStore.getItemAsync(key);
}

export function setSecureItemAsync(key: string, value: string): Promise<void> {
  if (!isSecureStorageAvailable()) {
    if (key !== MODE_KEY) {
      return Promise.reject(new Error('El almacenamiento seguro de credenciales requiere la aplicación móvil.'));
    }
    browserValues.set(key, value);
    return Promise.resolve();
  }
  return SecureStore.setItemAsync(key, value);
}

export function deleteSecureItemAsync(key: string): Promise<void> {
  if (!isSecureStorageAvailable()) {
    browserValues.delete(key);
    return Promise.resolve();
  }
  return SecureStore.deleteItemAsync(key);
}
