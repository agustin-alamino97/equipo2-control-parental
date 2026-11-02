import NetInfo from '@react-native-community/netinfo';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Button } from '../components/Button';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Screen } from '../components/Screen';
import { syncOfflineQueue } from '../services/offlineEvents';
import { useAuthStore } from '../store/authStore';
import { useRulesStore } from '../store/rulesStore';
import { colors } from '../theme';
import { StyleSheet, Text, View } from 'react-native';

function NetworkSync() {
  const token = useAuthStore((state) => state.token);
  const deviceToken = useAuthStore((state) => state.deviceToken);

  useEffect(() => NetInfo.addEventListener((state) => {
    if (state.isConnected !== true || state.isInternetReachable === false) return;
    if (token) {
      void useRulesStore.getState().syncPendingRules().catch((error: unknown) => {
        console.warn('No se pudieron sincronizar reglas pendientes:', error);
      });
    }
    if (deviceToken) {
      void syncOfflineQueue().catch((error: unknown) => {
        console.warn('No se pudieron sincronizar eventos pendientes:', error);
      });
    }
  }), [deviceToken, token]);

  return null;
}

export default function RootLayout() {
  const isReady = useAuthStore((state) => state.isReady);
  const initialize = useAuthStore((state) => state.initialize);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);

  useEffect(() => {
    void initialize().catch((error: unknown) => {
      setBootstrapError(error instanceof Error ? error.message : 'No se pudo iniciar la aplicación.');
    });
  }, [initialize]);

  const retry = () => {
    setBootstrapError(null);
    void initialize().catch((error: unknown) => {
      setBootstrapError(error instanceof Error ? error.message : 'No se pudo iniciar la aplicación.');
    });
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {bootstrapError ? (
        <Screen scroll={false}>
          <View style={styles.startup}>
            <Text style={styles.title}>No se pudo iniciar BA Protege+</Text>
            <Text style={styles.error}>{bootstrapError}</Text>
            <Button onPress={retry}>Reintentar</Button>
          </View>
        </Screen>
      ) : !isReady ? (
        <Screen scroll={false}>
          <View style={styles.startup}><Text style={styles.title}>Preparando tu espacio…</Text></View>
        </Screen>
      ) : (
        <ErrorBoundary>
          <NetworkSync />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
        </ErrorBoundary>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  startup: { flex: 1, justifyContent: 'center', gap: 16 },
  title: { color: colors.ink, fontSize: 24, fontWeight: '800' },
  error: { color: colors.danger, fontSize: 15, lineHeight: 22 },
});
