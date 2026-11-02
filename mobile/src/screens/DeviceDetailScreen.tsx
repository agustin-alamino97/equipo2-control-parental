import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { Feedback } from '../components/Feedback';
import { Screen } from '../components/Screen';
import { api, getErrorMessage } from '../services/api';
import { alertMessage, alertTitle, formatAlertDate, sortAlertsByNewest } from '../services/alertFormatting';
import { useDeviceStore } from '../store/deviceStore';
import type { AlertItem, Device } from '../types';
import { colors } from '../theme';

const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export function DeviceDetailScreen() {
  const params = useLocalSearchParams<{
    id: string;
    alias: string;
    model: string;
    os: string;
    linked: string;
    protected: string;
    lastSeen: string;
  }>();
  const router = useRouter();
  const device: Device = {
    id: String(params.id ?? ''),
    alias: String(params.alias ?? 'Dispositivo'),
    model: String(params.model ?? 'Modelo no informado'),
    os: String(params.os ?? 'Sistema no informado'),
    linked: params.linked === 'true',
    protected: params.protected === 'true',
    lastSeen: params.lastSeen ? String(params.lastSeen) : null,
  };
  const unlinkDevice = useDeviceStore((state) => state.unlinkDevice);
  const [events, setEvents] = useState<AlertItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlinking, setUnlinking] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<{ events: AlertItem[] }>('/events', { params: { deviceId: device.id } });
      setEvents(sortAlertsByNewest(data.events));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [device.id]);

  useEffect(() => { void loadEvents(); }, [loadEvents]);

  const confirmUnlink = () => Alert.alert(
    'Desvincular dispositivo',
    `¿Querés desvincular ${device.alias}? Se revocará su credencial de acceso.`,
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Desvincular',
        style: 'destructive',
        onPress: () => {
          setUnlinking(true);
          void unlinkDevice(device.id)
            .then(() => router.back())
            .catch((requestError: unknown) => setError(getErrorMessage(requestError)))
            .finally(() => setUnlinking(false));
        },
      },
    ],
  );

  const now = Date.now();
  const recentCutoff = now - RECENT_WINDOW_MS;
  const recentBlockedCount = events.filter((event) => {
    if (event.event_type !== 'blocked_access' || !event.event_time) return false;
    const timestamp = Date.parse(event.event_time);
    return Number.isFinite(timestamp) && timestamp >= recentCutoff && timestamp <= now;
  }).length;

  return (
    <Screen scroll={false}>
      <FlatList
        contentContainerStyle={styles.list}
        data={events}
        keyExtractor={(event, index) => String(event.id ?? index)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void loadEvents()} />}
        ListHeaderComponent={(
          <View style={styles.header}>
            <Text style={styles.title}>{device.alias}</Text>
            <Text style={styles.subtitle}>{device.model} · {device.os}</Text>
            <Card>
              <Text style={styles.sectionTitle}>Estado del dispositivo</Text>
              <Text style={styles.info}>Vinculación: {device.linked ? 'Activa' : 'Inactiva'}</Text>
              <Text style={styles.info}>
                Protección: {device.protected ? 'Informada por el servidor; filtrado nativo no verificado' : 'No confirmada'}
              </Text>
              <Text style={styles.info}>
                Última conexión: {formatAlertDate(device.lastSeen ?? undefined)}
              </Text>
              <Button variant="danger" onPress={confirmUnlink} loading={unlinking}>Desvincular</Button>
            </Card>
            <Card>
              <Text style={styles.sectionTitle}>Resumen de actividad</Text>
              <Text style={styles.info}>
                {loading
                  ? 'Actualizando eventos…'
                  : `${recentBlockedCount} accesos bloqueados en los últimos 7 días`}
              </Text>
            </Card>
            <Text style={styles.sectionTitle}>Historial de actividad</Text>
            {error ? <Feedback message={error} /> : null}
            {loading ? <Text style={styles.info}>Cargando historial…</Text> : null}
          </View>
        )}
        ListEmptyComponent={!loading ? (
          <EmptyState title="Sin actividad registrada" detail="Los eventos de este dispositivo aparecerán aquí cuando estén disponibles." />
        ) : null}
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.eventTitle}>{alertTitle(item)}</Text>
            <Text style={styles.info}>{alertMessage(item)}</Text>
            <Text style={styles.timestamp}>{formatAlertDate(item.event_time ?? item.creation_time)}</Text>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: 20, gap: 10, backgroundColor: colors.background },
  header: { gap: 12, marginBottom: 6 },
  title: { color: colors.ink, fontSize: 28, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 14 },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: '800' },
  info: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  eventTitle: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  timestamp: { color: colors.muted, fontSize: 12 },
});
