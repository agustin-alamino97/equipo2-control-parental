import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { Feedback } from '../components/Feedback';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { normalizeDomain } from '../services/validation';
import { useRulesStore } from '../store/rulesStore';
import { colors } from '../theme';

export function RulesScreen() {
  const official = useRulesStore((state) => state.official);
  const customDomains = useRulesStore((state) => state.customDomains);
  const isLoading = useRulesStore((state) => state.isLoading);
  const syncPending = useRulesStore((state) => state.syncPending);
  const error = useRulesStore((state) => state.error);
  const load = useRulesStore((state) => state.load);
  const addCustomDomain = useRulesStore((state) => state.addCustomDomain);
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null);
  const [saving, setSaving] = useState(false);
  const domain = normalizeDomain(value);

  const refresh = useCallback(() => {
    void load().catch((requestError: unknown) => {
      setFeedback({ message: requestError instanceof Error ? requestError.message : 'No se pudieron cargar las reglas.', kind: 'error' });
    });
  }, [load]);

  useEffect(() => { refresh(); }, [refresh]);

  const addDomain = async () => {
    if (!domain || saving || customDomains.includes(domain)) return;
    setSaving(true);
    setFeedback(null);
    try {
      await addCustomDomain(domain);
      setValue('');
      const pending = useRulesStore.getState().syncPending;
      setFeedback({
        message: pending
          ? 'El dominio quedó guardado y pendiente de sincronización.'
          : 'Dominio agregado correctamente.',
        kind: pending ? 'info' : 'success',
      });
    } catch (requestError) {
      setFeedback({
        message: requestError instanceof Error ? requestError.message : 'No se pudo agregar el dominio.',
        kind: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.kicker}>PROTECCIÓN</Text>
      <Text style={styles.title}>Sitios y reglas</Text>
      <Text style={styles.subtitle}>Consultá la lista oficial y administrá dominios personalizados.</Text>
      {error ? <Feedback kind={syncPending ? 'info' : 'error'} message={error} /> : null}
      <Card>
        <View style={styles.row}>
          <Text style={styles.sectionTitle}>Lista oficial LOTBA</Text>
          <Text style={styles.badge}>OFICIAL</Text>
        </View>
        <Text style={styles.body}>
          {official ? `${official.domains.length} dominios oficiales` : 'Lista no disponible'}
        </Text>
        <Text style={styles.meta}>
          {official
            ? `Versión ${official.version} · ${official.syncedAt ? new Date(official.syncedAt).toLocaleString() : 'sin fecha'}`
            : 'Conectate para consultar la versión actual.'}
        </Text>
        {official?.domains.slice(0, 12).map((item) => <Text key={item} style={styles.domain}>{item}</Text>)}
        {official && official.domains.length > 12 ? (
          <Text style={styles.meta}>Se muestran 12 de {official.domains.length} dominios.</Text>
        ) : null}
      </Card>
      <Card>
        <Text style={styles.sectionTitle}>Tu lista personalizada</Text>
        <Text style={styles.body}>Los cambios se guardan localmente y se sincronizan con tu cuenta cuando hay conexión.</Text>
        <TextField
          label="Dominio o URL"
          value={value}
          onChangeText={setValue}
          keyboardType="url"
          autoCapitalize="none"
          placeholder="ejemplo.com"
          returnKeyType="done"
          onSubmitEditing={() => void addDomain()}
        />
        <Button onPress={() => void addDomain()} disabled={!domain || saving || customDomains.includes(domain)} loading={saving}>
          Agregar dominio
        </Button>
        {feedback ? <Feedback message={feedback.message} kind={feedback.kind} /> : null}
        {syncPending ? <Feedback kind="info" message="Hay cambios pendientes de sincronización." /> : null}
        <ScrollView
          style={styles.customList}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
          nestedScrollEnabled
        >
          {customDomains.length === 0 ? (
            <EmptyState title="Tu lista está vacía" detail="Agregá un dominio para sumarlo a tus reglas personalizadas." />
          ) : customDomains.map((item) => (
            <View key={item} style={styles.domainRow}>
              <Text style={styles.domain}>{item}</Text>
              <Text style={styles.pending}>{syncPending ? 'Pendiente' : 'Activo'}</Text>
            </View>
          ))}
        </ScrollView>
        <Text style={styles.meta}>
          La API actual permite consultar y agregar dominios personalizados. La edición y eliminación requieren endpoints aún no disponibles en el backend.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: colors.ink, fontSize: 28, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: '800' },
  badge: { color: colors.primary, fontSize: 11, fontWeight: '800', backgroundColor: colors.accent, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 7 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  meta: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  domain: { color: colors.ink, fontSize: 14, lineHeight: 21 },
  customList: { maxHeight: 280 },
  domainRow: { minHeight: 48, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  pending: { color: colors.muted, fontSize: 12 },
});
