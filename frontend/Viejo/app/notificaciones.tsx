import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import Header from '../components/Header';
import AppIcon from '../components/AppIcon';
import PrimaryButton from '../components/PrimaryButton';
import FadeInView from '../components/FadeInView';
import { COLORS } from '../constants/colors';
import { Alert, getAlerts, markAllAsRead, markAsRead } from '../utils/notifications';

const typeColor = (t: Alert['type']) => t === 'success' ? COLORS.green : t === 'warning' ? COLORS.orange : COLORS.primary;
const typeIcon = (t: Alert['type']) => t === 'success' ? 'checkCircle' : t === 'warning' ? 'warning' : 'shieldCheck';
const formatDate = (ts: number) => {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} d`;
};

export default function Notificaciones() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => { setAlerts(await getAlerts()); }, []);
  useEffect(() => { (async () => { await load(); setLoading(false); })(); }, [load]);

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };
  const handleRead = async (id: string) => setAlerts(await markAsRead(id));
  const handleReadAll = async () => setAlerts(await markAllAsRead());
  const unread = alerts.filter(a => !a.read).length;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <Header title="BA Protege+" subtitle="Notificaciones" />
      <View style={styles.bar}>
        <Text style={styles.barText}>{unread} sin leer</Text>
        {unread > 0 && <TouchableOpacity onPress={handleReadAll}><Text style={styles.barAction}>Marcar todas como leídas</Text></TouchableOpacity>}
      </View>
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {alerts.length === 0 && <View style={styles.empty}><AppIcon name="checkCircle" size={48} color={COLORS.green} /><Text style={styles.emptyText}>Todo al día. No hay alertas.</Text></View>}
          {alerts.map((a, i) => (
            <FadeInView key={a.id} delay={i * 60}>
              <TouchableOpacity style={[styles.card, !a.read && styles.cardUnread]} onPress={() => handleRead(a.id)}>
                <View style={[styles.iconWrap, { backgroundColor: typeColor(a.type) + '22' }]}>
                  <AppIcon name={typeIcon(a.type) as any} size={22} color={typeColor(a.type)} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{a.title}</Text>
                  <Text style={styles.body}>{a.body}</Text>
                  <Text style={styles.time}>{formatDate(a.createdAt)}</Text>
                </View>
                {!a.read && <View style={styles.dot} />}
              </TouchableOpacity>
            </FadeInView>
          ))}
        </ScrollView>
      )}
      <View style={{ padding: 16 }}><PrimaryButton title="Volver" variant="outline" onPress={() => router.back()} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  barText: { fontSize: 12, color: COLORS.grayText, fontWeight: '600' },
  barAction: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  card: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: COLORS.white, borderRadius: 10, padding: 12, marginBottom: 10 },
  cardUnread: { borderLeftWidth: 3, borderLeftColor: COLORS.primary },
  iconWrap: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 13, fontWeight: '700', color: COLORS.black },
  body: { fontSize: 12, color: COLORS.grayText, marginTop: 2 },
  time: { fontSize: 10, color: COLORS.grayText, marginTop: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginTop: 6 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 13, color: COLORS.grayText, marginTop: 10 },
});