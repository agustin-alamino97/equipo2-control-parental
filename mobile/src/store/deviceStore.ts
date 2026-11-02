import { create } from 'zustand';
import { api } from '../services/api';
import type { Device } from '../types';

interface DeviceResponse {
  id?: string | number;
  alias_name?: string;
  os_model?: string;
  device_model?: string;
  operating_system?: string;
  linked?: boolean;
  protection_status?: boolean;
  last_seen?: string | null;
  last_connection?: string | null;
}

interface PairingCode {
  code: string;
  expiresAt: string;
}

interface DeviceState {
  devices: Device[];
  pairingCode: PairingCode | null;
  isLoading: boolean;
  error: string | null;
  fetchDevices: () => Promise<void>;
  generatePairingCode: () => Promise<void>;
  unlinkDevice: (id: string) => Promise<void>;
}

function mapDevice(device: DeviceResponse): Device {
  return {
    id: String(device.id ?? ''),
    alias: device.alias_name ?? 'Dispositivo sin nombre',
    model: device.device_model ?? device.os_model ?? 'Modelo no informado',
    os: device.operating_system ?? 'Sistema no informado',
    linked: Boolean(device.linked),
    protected: Boolean(device.protection_status),
    lastSeen: device.last_seen ?? device.last_connection ?? null,
  };
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  devices: [],
  pairingCode: null,
  isLoading: false,
  error: null,

  fetchDevices: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<{ devices: DeviceResponse[] }>('/devices');
      set({ devices: data.devices.map(mapDevice), isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error instanceof Error ? error.message : 'No se pudieron cargar los dispositivos.' });
      throw error;
    }
  },

  generatePairingCode: async () => {
    set({ error: null });
    const { data } = await api.post<PairingCode>('/pairing/generate');
    if (!/^\d{6}$/.test(data.code) || !data.expiresAt) {
      throw new Error('El servidor devolvió un código de vinculación inválido.');
    }
    set({ pairingCode: { code: data.code, expiresAt: data.expiresAt } });
  },

  unlinkDevice: async (id) => {
    await api.patch(`/devices/${encodeURIComponent(id)}/unlink`);
    set({ devices: get().devices.filter((device) => device.id !== id) });
  },
}));
