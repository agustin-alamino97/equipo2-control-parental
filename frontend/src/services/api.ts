import { tokenStorage } from './tokenStorage';

// Asegurate de tener EXPO_PUBLIC_API_URL en tu archivo .env
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.104:3000';

export type CustomRule = {
    id: string;
    value: string;
    rule_type: string;
    created_at?: string;
};

export type Device = {
    id: string;
    device_uuid: string;
    name: string;
    platform?: string;
    protection_status: boolean;
    linked_at?: string;
    last_seen?: string;
};

type RawCustomRule = {
    id: string;
    value: string;
    rule_type: string;
    creation_time?: string;
    created_at?: string;
};

type LoginResponse = {
    JWT: string;
    refresh_token: string;
    user: { id: string; email: string };
};

function extractRules(payload: any): CustomRule[] {
    const data = payload?.data ?? payload;
    if (!data) return [];

    // Caso A: array directo
    if (Array.isArray(data)) {
        return data.map((r: RawCustomRule) => ({
            id: r.id,
            value: r.value,
            rule_type: r.rule_type,
            created_at: r.creation_time ?? r.created_at,
        }));
    }

    // Caso B: { total, domain: [], keyword: [], updatedAt }
    const rules: CustomRule[] = [];

    if (Array.isArray(data.domain)) {
        data.domain.forEach((r: RawCustomRule) => {
            rules.push({
                id: r.id,
                value: r.value,
                rule_type: 'domain',
                created_at: r.creation_time ?? r.created_at,
            });
        });
    }

    if (Array.isArray(data.keyword)) {
        data.keyword.forEach((r: RawCustomRule) => {
            rules.push({
                id: r.id,
                value: r.value,
                rule_type: 'keyword',
                created_at: r.creation_time ?? r.created_at,
            });
        });
    }

    return rules;
}

async function persistTokens(data: LoginResponse) {
    await tokenStorage.setAccessToken(data.JWT);
    await tokenStorage.setRefreshToken(data.refresh_token);
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = await tokenStorage.getAccessToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // El backend devuelve 403 (no 401) cuando el token expiró.
    if (response.status === 401 || response.status === 403) {
        throw new Error('Sesión expirada. Volvé a iniciar sesión.');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Error en la petición');
    }

    if (response.status === 204) return null;

    return response.json();
}

export const api = {
    // --- LISTA NEGRA / REGLAS PERSONALIZADAS ---
    getCustomRules: async (): Promise<CustomRule[]> => {
        const res = await fetchWithAuth('/sync/custom/user');
        return extractRules(res);
    },

    addCustomRule: async (domain: string): Promise<CustomRule> => {
        const res = await fetchWithAuth('/sync/custom/user', {
            method: 'POST',
            body: JSON.stringify({
                value: domain,
                rule_type: 'domain',
            }),
        });
        const rule = res?.data ?? res;
        return {
            id: rule.id,
            value: rule.value,
            rule_type: rule.rule_type,
            created_at: rule.creation_time ?? rule.created_at,
        };
    },

    deleteCustomRule: async (ruleId: string): Promise<void> => {
        await fetchWithAuth(`/sync/custom/user/${ruleId}`, {
            method: 'DELETE',
        });
    },

    // --- DISPOSITIVOS ---
    getDevices: async (): Promise<Device[]> => {
        const res = await fetchWithAuth('/devices');
        const data = res?.data ?? res;
        return Array.isArray(data) ? data : [];
    },

    // --- REGISTRO + LOGIN AUTOMÁTICO ---
    register: async (
        name: string,
        surname: string,
        email: string,
        password: string
    ) => {
        const registerRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, surname, email, password }),
        });

        if (!registerRes.ok) {
            const errorData = await registerRes.json().catch(() => ({}));
            throw new Error(
                errorData.message || errorData.error || 'Error al registrar usuario'
            );
        }

        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!loginRes.ok) {
            throw new Error(
                'Usuario creado, pero no se pudo iniciar sesión. Probá iniciar sesión manualmente.'
            );
        }

        const loginData: LoginResponse = await loginRes.json();
        await persistTokens(loginData);
        return loginData;
    },

    // --- LOGIN ---
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(
                errorData.message || errorData.error || 'Credenciales incorrectas'
            );
        }

        const data: LoginResponse = await res.json();
        await persistTokens(data);
        return data;
    },

    // --- LOGOUT ---
    logout: async () => {
        await tokenStorage.clear();
    },
};