import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  clearStoredSession,
  getStoredSession,
  storeSession,
} from '../services/tokenStorage';
import type { ApiUser, AuthSession } from '../services/api';

interface AuthContextValue {
  user: ApiUser | null;
  isReady: boolean;
  storageError: string | null;
  setAuthSession: (session: AuthSession) => Promise<void>;
  clearAuthSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getStoredSession()
      .then(session => {
        if (active) setUser(session?.user ?? null);
      })
      .catch(error => {
        if (active) {
          setStorageError(
            error instanceof Error ? error.message : 'No se pudo leer la sesión.'
          );
        }
      })
      .finally(() => {
        if (active) setIsReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const setAuthSession = useCallback(async (session: AuthSession) => {
    await storeSession(session);
    setUser(session.user);
    setStorageError(null);
  }, []);

  const clearAuthSession = useCallback(async () => {
    await clearStoredSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isReady, storageError, setAuthSession, clearAuthSession }),
    [user, isReady, storageError, setAuthSession, clearAuthSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.');
  }
  return context;
}
