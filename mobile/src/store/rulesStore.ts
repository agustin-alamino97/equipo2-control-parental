import { create } from 'zustand';
import axios from 'axios';
import { api } from '../services/api';
import {
  enqueueRule,
  readPendingRules,
  readSnapshot,
  removePendingRule,
  saveSnapshot,
} from '../services/localDatabase';
import type { RuleSnapshot } from '../types';

interface RulesState {
  official: RuleSnapshot | null;
  customDomains: string[];
  isLoading: boolean;
  syncPending: boolean;
  error: string | null;
  load: () => Promise<void>;
  addCustomDomain: (domain: string) => Promise<void>;
  syncPendingRules: () => Promise<void>;
}

interface SystemRulesResponse {
  status: 'UP_TO_DATE' | 'RESET';
  current_version: number;
  checksum: number;
  syncedAt?: string;
  data?: { lotba?: string[]; syncedAt?: string };
}

interface CustomRulesResponse {
  data: { domain?: string[] };
}

export const useRulesStore = create<RulesState>((set, get) => ({
  official: null,
  customDomains: [],
  isLoading: false,
  syncPending: false,
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });
    const [cachedOfficial, cachedCustom] = await Promise.all([
      readSnapshot<RuleSnapshot>('official-rules'),
      readSnapshot<string[]>('custom-rules'),
    ]);
    if (cachedOfficial || cachedCustom) {
      set({
        official: cachedOfficial,
        customDomains: cachedCustom ?? [],
        syncPending: (await readPendingRules()).length > 0,
      });
    }

    try {
      const current = get().official;
      const params = current
        ? { version: current.version, checksum: current.checksum }
        : undefined;
      const [systemResponse, customResponse] = await Promise.all([
        api.get<SystemRulesResponse>('/sync/system', { params }),
        api.get<CustomRulesResponse>('/sync/custom/user'),
      ]);

      const system = systemResponse.data;
      const official: RuleSnapshot = system.status === 'RESET'
        ? {
          domains: system.data?.lotba ?? [],
          version: system.current_version,
          checksum: system.checksum,
          syncedAt: system.data?.syncedAt ?? system.syncedAt ?? new Date().toISOString(),
        }
        : {
          domains: current?.domains ?? [],
          version: system.current_version,
          checksum: system.checksum,
          syncedAt: system.syncedAt ?? new Date().toISOString(),
        };
      const pendingDomains = await readPendingRules();
      const customDomains = [...new Set([
        ...(customResponse.data.data.domain ?? []),
        ...pendingDomains,
      ])];

      await Promise.all([
        saveSnapshot('official-rules', official),
        saveSnapshot('custom-rules', customDomains),
      ]);
      set({
        official,
        customDomains,
        isLoading: false,
        syncPending: pendingDomains.length > 0,
      });
    } catch (error) {
      set({
        isLoading: false,
        syncPending: true,
        error: error instanceof Error ? error.message : 'No se pudieron sincronizar las reglas.',
      });
      if (!cachedOfficial && !cachedCustom) throw error;
    }
  },

  addCustomDomain: async (domain) => {
    try {
      await api.post('/sync/custom/user', { domain, rule_type: 'domain' });
      await get().load();
    } catch (error) {
      if (!axios.isAxiosError(error) || error.response) throw error;
      await enqueueRule(domain);
      const customDomains = [...new Set([...get().customDomains, domain])];
      await saveSnapshot('custom-rules', customDomains);
      set({ customDomains, syncPending: true, error: 'Dominio guardado en este dispositivo. Se sincronizará al recuperar la conexión.' });
    }
  },

  syncPendingRules: async () => {
    const pendingDomains = await readPendingRules();
    if (pendingDomains.length === 0) return;

    for (const domain of pendingDomains) {
      await api.post('/sync/custom/user', { domain, rule_type: 'domain' });
      await removePendingRule(domain);
    }
    await get().load();
  },
}));
