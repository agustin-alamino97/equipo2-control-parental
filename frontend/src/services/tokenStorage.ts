import { secureStorage } from './secureStorage';

const USER_KEY = 'auth_user';
const TOKEN_KEY = 'lotba_access_token';
const REFRESH_TOKEN_KEY = 'lotba_refresh_token';

export const tokenStorage = {
    getAccessToken: async (): Promise<string | null> => {
        return await secureStorage.getItem(TOKEN_KEY);
    },
    setAccessToken: async (token: string): Promise<void> => {
        await secureStorage.setItem(TOKEN_KEY, token);
    },
    getRefreshToken: async (): Promise<string | null> => {
        return await secureStorage.getItem(REFRESH_TOKEN_KEY);
    },
    setRefreshToken: async (token: string): Promise<void> => {
        await secureStorage.setItem(REFRESH_TOKEN_KEY, token);
    },
    clear: async (): Promise<void> => {
        await secureStorage.deleteItem(TOKEN_KEY);
        await secureStorage.deleteItem(REFRESH_TOKEN_KEY);
    },
    getUser: async (): Promise<{ id: string; email: string; name?: string } | null> => {
        const raw = await secureStorage.getItem(USER_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    },
    setUser: async (user: object): Promise<void> => {
        await secureStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    clearAll: async (): Promise<void> => {
        await secureStorage.deleteItem(TOKEN_KEY);
        await secureStorage.deleteItem(REFRESH_TOKEN_KEY);
        await secureStorage.deleteItem(USER_KEY);
    },
};