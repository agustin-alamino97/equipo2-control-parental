import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { Feedback } from '../components/Feedback';
import { Screen } from '../components/Screen';
import { api, getErrorMessage } from '../services/api';
import { alertMessage, alertTitle, formatAlertDate, sortAlertsByNewest } from '../services/alertFormatting';
import type { AlertItem } from '../types';
import { colors } from '../theme';

export function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<{ alerts: AlertItem[] }>('/events/alerts');
      setAlerts(sortAlertsByNewest(data.alerts));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const markRead = async (alert: AlertItem) => {
    if (alert.is_read || alert.read) return;
    try {
      await api.patch(`/events/alerts/${encodeURIComponent(String(alert.id))}/read`);
      setAlerts((current) => current.map((item) => (
        item.id === alert.id ? { ...item, is_read: true, read: true } : item
      )));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <Screen scroll={false}>
      <FlatList
        contentContainerStyle={styles.list}
        data={alerts}
        keyExtractor={(item, index) => String(item.id ?? index)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void refresh()} />}
        ListHeaderComponent={(
          <View style={styles.header}>
            <Text style={styles.kicker}>ACTIVIDAD</Text>
            <Text style={styles.title}>Alertas</Text>
            <Text style={styles.subtitle}>Avisos relevantes de tus dispositivos vinculados.</Text>
            {error ? <Feedback message={error} /> : null}
          </View>
        )}
        ListEmptyComponent={!loading ? (
          <EmptyState title="No hay alertas" detail="Cuando se registre una actividad importante, la vas a encontrar acá." />
        ) : null}
        renderItem={({ item }) => {
          const unread = !item.is_read && !item.read;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${alertTitle(item)}. ${unread ? 'No leída' : 'Leída'}`}
              onPress={() => void markRead(item)}
            >
              <Card>
                <View style={styles.row}>
                  <View style={[styles.dot, unread && styles.unread]} />
                  <Text style={styles.alertTitle}>{alertTitle(item)}</Text>
                </View>
                <Text style={styles.message}>{alertMessage(item)}</Text>
                <Text style={styles.date}>
                  {formatAlertDate(item.alert_time ?? item.creation_time ?? item.event_time)}
                </Text>
              </Card>
            </Pressable>
          );
        }}
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
  header: { gap: 8, marginBottom: 10 },
  kicker: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: colors.ink, fontSize: 28, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.border },
  unread: { backgroundColor: colors.primary },
  alertTitle: { color: colors.ink, fontSize: 15, fontWeight: '800', flex: 1 },
  message: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  date: { color: colors.muted, fontSize: 12 },
});
