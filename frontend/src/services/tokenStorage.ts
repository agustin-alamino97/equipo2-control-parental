import * as SecureStore from 'expo-secure-store';

const USER_KEY = 'auth_user';
const TOKEN_KEY = 'lotba_access_token';
const REFRESH_TOKEN_KEY = 'lotba_refresh_token';

export const tokenStorage = {
    getAccessToken: async (): Promise<string | null> => {
        return await SecureStore.getItemAsync(TOKEN_KEY);
    },
    setAccessToken: async (token: string): Promise<void> => {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    },
    getRefreshToken: async (): Promise<string | null> => {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    },
    setRefreshToken: async (token: string): Promise<void> => {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    },
    clear: async (): Promise<void> => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    },

    getUser: async (): Promise<{ id: string; email: string; name?: string } | null> => {
    const raw = await SecureStore.getItemAsync(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    },
    setUser: async (user: object): Promise<void> => {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    },
    clearAll: async (): Promise<void> => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
    },
};