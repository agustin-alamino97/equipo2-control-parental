import { tokenStorage } from './tokenStorage';

// Asegurate de tener EXPO_PUBLIC_API_URL en tu archivo .env
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.104:3000';
const API_KEY = process.env.EXPO_PUBLIC_API_KEY || '';

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
    user: { id: string; email: string, name?: string | null };
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
    if (data.user) await tokenStorage.setUser(data.user);
}

// --- Refresh automático de JWT ---
let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        try {
            const rt = await tokenStorage.getRefreshToken();
            if (!rt) return false;

            const res = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 
                            'x-api-key': API_KEY, },
                body: JSON.stringify({ refresh_token: rt }),
            });

            if (!res.ok) {
                await tokenStorage.clearAll();
                return false;
            }

            const data = await res.json();

            // Ajustar si el back devuelve otro nombre (ver paso siguiente)
            const newAccess = data.JWT ?? data.access_token;
            const newRefresh = data.refresh_token;

            if (!newAccess) {
                console.warn('[tryRefresh] Respuesta sin token:', data);
                return false;
            }

            await tokenStorage.setAccessToken(newAccess);
            if (newRefresh) await tokenStorage.setRefreshToken(newRefresh);
            if (data.user) await tokenStorage.setUser(data.user);

            return true;
        } catch (e) {
            console.warn('[tryRefresh] Error:', e);
            return false;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}, _retry = false) {
    const token = await tokenStorage.getAccessToken();

    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // El backend devuelve 403 (no 401) cuando el token expiró.
    if (response.status === 401 || response.status === 403) {
        if (_retry) throw new Error('Sesión expirada. Volvé a iniciar sesión.');
        const refreshed = await tryRefresh();
        if (refreshed) return fetchWithAuth(endpoint, options, true);   // ← solo 1 reintento
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
            headers: { 'Content-Type': 'application/json', 
                'x-api-key': API_KEY, },
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
            headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, },
            body: JSON.stringify({ email, password }),
        });

        if (!loginRes.ok) {
            // ⬇️ NUEVO: capturar status y body reales
            const errorBody = await loginRes.json().catch(() => ({}));
            console.warn('[register] login automático falló', {
                status: loginRes.status,
                body: errorBody,
                email,
            });
            throw new Error(
                `Usuario creado, pero no se pudo iniciar sesión (${loginRes.status}: ${errorBody.error ?? errorBody.message ?? 'sin detalle'}). Probá iniciar sesión manualmente.`
            );
        }

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
            headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY,},
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
        await tokenStorage.clearAll();
    },
};