import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Device } from '../types';
import { colors } from '../theme';
import { Card } from './Card';
import { formatAlertDate } from '../services/alertFormatting';

export function DeviceCard({ device, onPress }: { device: Device; onPress: () => void }) {
  const statusColor = device.protected ? colors.warning : colors.muted;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalles de ${device.alias}. ${
        device.protected ? 'Protección informada por el servidor' : 'Protección no confirmada'
      }. Última conexión: ${formatAlertDate(device.lastSeen ?? undefined)}.`}
      onPress={onPress}
    >
      <Card>
        <View style={styles.row}>
          <View style={styles.icon}><Text style={styles.iconText}>D</Text></View>
          <View style={styles.details}>
            <Text style={styles.title}>{device.alias}</Text>
            <Text style={styles.subtitle}>{device.model} · {device.os}</Text>
          </View>
        </View>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={[styles.status, { color: statusColor }]}>
            {device.protected ? 'Protección informada por el servidor' : 'Protección no confirmada'}
          </Text>
          <Text style={styles.linked}>{device.linked ? 'Vinculado' : 'Desvinculado'}</Text>
        </View>
        <Text style={styles.lastSeen}>
          Última conexión: {formatAlertDate(device.lastSeen ?? undefined)}
        </Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  icon: { height: 46, width: 46, borderRadius: 15, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  iconText: { color: colors.primary, fontSize: 20, fontWeight: '800' },
  details: { flex: 1, gap: 4 },
  title: { color: colors.ink, fontSize: 16, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingTop: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  status: { fontSize: 12, fontWeight: '700', flex: 1 },
  linked: { color: colors.muted, fontSize: 12 },
  lastSeen: { color: colors.muted, fontSize: 12, lineHeight: 18 },
});
