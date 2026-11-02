import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { colors } from '../theme';

export function ProtectionScreen() {
  return (
    <Screen scroll={false}>
      <View style={styles.content}>
        <View style={styles.mark}><Text style={styles.markText}>✓</Text></View>
        <Text style={styles.title}>Dispositivo vinculado</Text>
        <Text style={styles.subtitle}>
          Este equipo está asociado a la cuenta del adulto responsable.
        </Text>
        <Card>
          <Text style={styles.statusTitle}>Estado del filtrado</Text>
          <Text style={styles.status}>
            Pendiente de integración nativa
          </Text>
          <Text style={styles.detail}>
            La VPN local, la protección anti-desinstalación y el servicio persistente de Android no están activos en esta versión.
          </Text>
        </Card>
        <Text style={styles.note}>
          No se debe considerar este dispositivo protegido contra el acceso a sitios hasta completar y validar esos servicios nativos.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 18 },
  mark: { width: 72, height: 72, borderRadius: 24, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  markText: { color: colors.primary, fontSize: 40, fontWeight: '700' },
  title: { color: colors.ink, fontSize: 27, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 24, textAlign: 'center' },
  statusTitle: { color: colors.ink, fontSize: 16, fontWeight: '800' },
  status: { color: colors.warning, fontSize: 15, fontWeight: '800' },
  detail: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  note: { color: colors.danger, fontSize: 13, lineHeight: 20, textAlign: 'center' },
});
