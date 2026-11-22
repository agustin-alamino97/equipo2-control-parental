import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Header from '../components/Header';
import PrimaryButton from '../components/PrimaryButton';
import AppIcon from '../components/AppIcon';
import { COLORS } from '../constants/colors';
import { DEFAULT_SETTINGS, getSettings, saveSettings, Settings } from '../utils/settings';
import { useTheme } from '../contexts/ThemeContext';

export default function Ajustes() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const { mode, setMode } = useTheme();

  useEffect(() => { (async () => setSettings(await getSettings()))(); }, []);
  const update = async (patch: Partial<Settings>) => setSettings(await saveSettings(patch));

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <Header title="BA Protege+" subtitle="Ajustes generales" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <Text style={styles.section}>Notificaciones</Text>
        <View style={styles.card}>
          <Row icon="warning" title="Notificaciones push" right={<Switch value={settings.notificationsEnabled} onValueChange={v => update({ notificationsEnabled: v })} trackColor={{ true: COLORS.primary }} />} />
          <Divider />
          <Row icon="settings" title="Sonido" right={<Switch value={settings.soundEnabled} onValueChange={v => update({ soundEnabled: v })} trackColor={{ true: COLORS.primary }} />} />
          <Divider />
          <Row icon="settings" title="Vibración" right={<Switch value={settings.vibrateEnabled} onValueChange={v => update({ vibrateEnabled: v })} trackColor={{ true: COLORS.primary }} />} />
        </View>

        <Text style={styles.section}>Apariencia</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Tema</Text>
          <View style={styles.segment}>
            {(['light', 'dark', 'system'] as const).map(opt => (
              <TouchableOpacity key={opt} style={[styles.segmentItem, mode === opt && styles.segmentItemActive]} onPress={() => setMode(opt)}>
                <Text style={[styles.segmentText, mode === opt && styles.segmentTextActive]}>{opt === 'light' ? 'Claro' : opt === 'dark' ? 'Oscuro' : 'Sistema'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.section}>Idioma</Text>
        <View style={styles.card}>
          <View style={styles.segment}>
            {(['es', 'en'] as const).map(opt => (
              <TouchableOpacity key={opt} style={[styles.segmentItem, settings.language === opt && styles.segmentItemActive]} onPress={() => update({ language: opt })}>
                <Text style={[styles.segmentText, settings.language === opt && styles.segmentTextActive]}>{opt === 'es' ? 'Español' : 'English'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.section}>Acerca de</Text>
        <View style={styles.card}>
          <Row icon="shieldCheck" title="BA Protege+" subtitle="Versión 1.0.0" />
          <Divider />
          <Row icon="warning" title="Términos y condiciones" onPress={() => {}} />
          <Divider />
          <Row icon="warning" title="Política de privacidad" onPress={() => {}} />
        </View>

        <PrimaryButton title="Volver" variant="outline" onPress={() => router.back()} />
      </ScrollView>
    </View>
  );
}

function Row({ icon, title, subtitle, right, onPress }: { icon: any; title: string; subtitle?: string; right?: React.ReactNode; onPress?: () => void }) {
  const Wrapper: any = onPress ? TouchableOpacity : View;
  return (
    <Wrapper onPress={onPress} style={styles.row}>
      <View style={styles.rowIcon}><AppIcon name={icon} size={18} color={COLORS.primary} /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {right}
      {onPress && <AppIcon name="next" size={18} color={COLORS.grayText} />}
    </Wrapper>
  );
}

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  section: { fontSize: 12, fontWeight: '700', color: COLORS.primary, marginTop: 16, marginBottom: 8, paddingHorizontal: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: COLORS.white, borderRadius: 10, paddingVertical: 4, paddingHorizontal: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 10 },
  rowIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.lightPurple, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 13, color: COLORS.black, fontWeight: '600' },
  rowSubtitle: { fontSize: 11, color: COLORS.grayText, marginTop: 1 },
  divider: { height: 1, backgroundColor: COLORS.gray, marginLeft: 54, marginRight: 10 },
  label: { fontSize: 12, fontWeight: '600', color: COLORS.primary, padding: 10, paddingBottom: 4 },
  segment: { flexDirection: 'row', backgroundColor: COLORS.bg, borderRadius: 8, padding: 4, margin: 10 },
  segmentItem: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  segmentItemActive: { backgroundColor: COLORS.primary },
  segmentText: { fontSize: 12, color: COLORS.grayText, fontWeight: '600' },
  segmentTextActive: { color: COLORS.white },
});