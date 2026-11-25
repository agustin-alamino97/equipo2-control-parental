import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const isWeb = Platform.OS === 'web';

/**
 * Wrapper de almacenamiento seguro.
 * - En nativo (iOS/Android): usa expo-secure-store (Keychain/Keystore, cifrado).
 * - En web: usa localStorage (NO cifrado, pero necesario para que funcione en navegador).
 *
 * - En web, los tokens quedan visibles en DevTools. Para producción real,
 *   considerar cookies httpOnly para el refresh token.
 */
export const secureStorage = {
    getItem: async (key: string): Promise<string | null> => {
        if (isWeb) {
            try {
                return localStorage.getItem(key);
            } catch {
                return null;
            }
        }
        return SecureStore.getItemAsync(key);
    },

    setItem: async (key: string, value: string): Promise<void> => {
        if (isWeb) {
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                console.warn('[secureStorage] localStorage.setItem falló:', e);
            }
            return;
        }
        await SecureStore.setItemAsync(key, value);
    },

    deleteItem: async (key: string): Promise<void> => {
        if (isWeb) {
            try {
                localStorage.removeItem(key);
            } catch {
                // ignorar
            }
            return;
        }
        await SecureStore.deleteItemAsync(key);
    },
};