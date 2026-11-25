import * as Crypto from 'expo-crypto';
import { secureStorage } from './secureStorage';

const DEVICE_UUID_KEY = 'lotba_device_uuid';

/**
 * Recupera el UUID del dispositivo desde el storage seguro.
 * Si no existe, genera uno nuevo con `Crypto.randomUUID()` y lo guarda.
 *
 * El UUID es estable entre navegación, reinicios y nuevas vinculaciones.
 */
export async function getOrCreateDeviceUuid(): Promise<string> {
    try {
        const existing = await secureStorage.getItem(DEVICE_UUID_KEY);
        if (existing) return existing;

        const newUuid = Crypto.randomUUID();
        await secureStorage.setItem(DEVICE_UUID_KEY, newUuid);
        return newUuid;
    } catch (error) {
        console.error('[deviceIdentity] Error:', error);
        throw new Error('No se pudo obtener el UUID del dispositivo');
    }
}

/**
 * Borra el UUID (para testing o reset explícito).
 */
export async function clearDeviceUuid(): Promise<void> {
    await secureStorage.deleteItem(DEVICE_UUID_KEY);
}