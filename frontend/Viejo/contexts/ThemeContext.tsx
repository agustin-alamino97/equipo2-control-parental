import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { getSettings, saveSettings } from '../utils/settings';
import { DARK, LIGHT, Theme } from '../constants/theme';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: LIGHT, mode: 'system', isDark: false, setMode: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    (async () => {
      const s = await getSettings();
      setModeState(s.theme);
    })();
  }, []);

  const isDark = mode === 'dark' || (mode === 'system' && system === 'dark');
  const theme = isDark ? DARK : LIGHT;

  const setMode = useCallback(async (next: ThemeMode) => {
    setModeState(next);
    await saveSettings({ theme: next });
  }, []);

  const value = useMemo(() => ({ theme, mode, isDark, setMode }), [theme, mode, isDark, setMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);