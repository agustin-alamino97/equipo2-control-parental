import { useCallback, useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DeviceCard } from '../components/DeviceCard';
import { EmptyState } from '../components/EmptyState';
import { Feedback } from '../components/Feedback';
import { OfflineBanner } from '../components/OfflineBanner';
import { getErrorMessage } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useDeviceStore } from '../store/deviceStore';
import { colors } from '../theme';

const DEVICE_LIMIT = 15;

export function DevicesScreen() {
  const router = useRouter();
  const userName = useAuthStore((state) => state.user?.name);
  const devices = useDeviceStore((state) => state.devices);
  const isLoading = useDeviceStore((state) => state.isLoading);
  const pairingCode = useDeviceStore((state) => state.pairingCode);
  const fetchDevices = useDeviceStore((state) => state.fetchDevices);
  const generatePairingCode = useDeviceStore((state) => state.generatePairingCode);
  const [modalVisible, setModalVisible] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loadingCode, setLoadingCode] = useState(false);

  const refresh = useCallback(() => {
    void fetchDevices().catch((requestError: unknown) => setError(getErrorMessage(requestError)));
  }, [fetchDevices]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!pairingCode || !modalVisible) return undefined;
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((new Date(pairingCode.expiresAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(remaining);
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [pairingCode, modalVisible]);

  const createCode = async () => {
    setLoadingCode(true);
    setError(null);
    try {
      await generatePairingCode();
      setModalVisible(true);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoadingCode(false);
    }
  };

  return (
    <>
      <OfflineBanner />
      <FlatList
        contentContainerStyle={styles.list}
        data={devices}
        keyExtractor={(device) => device.id}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
        ListHeaderComponent={(
          <View style={styles.header}>
            <Text style={styles.kicker}>MODO RESPONSABLE</Text>
            <Text style={styles.title}>Hola, {userName || 'Responsable'}</Text>
            <Text style={styles.subtitle}>Tus dispositivos</Text>
            <Text style={styles.meta}>
              {devices.length} de {DEVICE_LIMIT} dispositivos vinculados
            </Text>
            {error ? <Feedback message={error} /> : null}
          </View>
        )}
        ListEmptyComponent={!isLoading ? (
          <EmptyState
            title="Todavía no hay dispositivos"
            detail="Vinculá el primer dispositivo para empezar a administrarlo desde tu cuenta."
          />
        ) : null}
        renderItem={({ item }) => (
          <DeviceCard
            device={item}
            onPress={() => router.push({
              pathname: '/(tabs)/devices/[id]',
              params: {
                id: item.id,
                alias: item.alias,
                model: item.model,
                os: item.os,
                linked: String(item.linked),
                protected: String(item.protected),
                lastSeen: item.lastSeen ?? '',
              },
            })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListFooterComponent={<View style={{ height: 12 }} />}
        ListFooterComponentStyle={styles.footer}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
      />
      <View style={styles.action}>
        <Button
          onPress={() => void createCode()}
          disabled={devices.length >= DEVICE_LIMIT}
          loading={loadingCode}
        >
          {devices.length >= DEVICE_LIMIT ? 'Límite de dispositivos alcanzado' : '+  Vincular nuevo dispositivo'}
        </Button>
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <Card>
            <Pressable accessibilityRole="button" accessibilityLabel="Cerrar" onPress={() => setModalVisible(false)} style={styles.close}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
            <Text style={styles.modalTitle}>Código de vinculación</Text>
            <Text style={styles.modalText}>Ingresá este código en el dispositivo protegido.</Text>
            <Text accessibilityLabel={`Código ${pairingCode?.code ?? ''}`} style={styles.code}>
              {pairingCode?.code?.split('').join(' ') ?? ''}
            </Text>
            <Text style={styles.expiry}>
              {secondsLeft > 0 ? `Vence en ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}` : 'El código venció'}
            </Text>
            <Button variant="secondary" onPress={() => setModalVisible(false)}>Listo</Button>
          </Card>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  list: { flexGrow: 1, padding: 20, paddingBottom: 100, gap: 0, backgroundColor: colors.background },
  header: { gap: 8, marginBottom: 16 },
  kicker: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: colors.ink, fontSize: 28, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 14 },
  meta: { color: colors.muted, fontSize: 14 },
  footer: { paddingBottom: 16 },
  action: { padding: 16, backgroundColor: colors.background },
  overlay: { flex: 1, backgroundColor: '#0008', justifyContent: 'center', padding: 24 },
  close: { alignSelf: 'flex-end', minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: colors.muted, fontSize: 28 },
  modalTitle: { color: colors.ink, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  modalText: { color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  code: { color: colors.primary, fontSize: 35, letterSpacing: 8, fontWeight: '900', textAlign: 'center', paddingVertical: 8 },
  expiry: { color: colors.warning, fontSize: 14, fontWeight: '700', textAlign: 'center', paddingBottom: 8 },
});
