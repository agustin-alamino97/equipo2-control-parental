import * as Crypto from 'expo-crypto';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const DEVICE_UUID_KEY = 'protected-device-uuid';

export interface DeviceIdentity {
  device_uuid: string;
  os_model: string;
}

export async function getDeviceIdentity(): Promise<DeviceIdentity> {
  let deviceUuid = await SecureStore.getItemAsync(DEVICE_UUID_KEY);
  if (!deviceUuid) {
    deviceUuid = Crypto.randomUUID();
    await SecureStore.setItemAsync(DEVICE_UUID_KEY, deviceUuid);
  }
  const model = Device.modelName ?? Device.deviceName ?? 'Dispositivo móvil';
  const osVersion = Device.osVersion ?? 'versión desconocida';
  return {
    device_uuid: deviceUuid,
    os_model: `${model} · ${Platform.OS} ${osVersion}`,
  };
}
