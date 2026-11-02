import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Feedback } from '../components/Feedback';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { api, getErrorMessage } from '../services/api';
import { getDeviceIdentity } from '../services/deviceIdentity';
import { isSecureStorageAvailable } from '../services/secureStorage';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme';

interface PairResponse {
  deviceToken: string;
}

export function PairingScreen() {
  const router = useRouter();
  const saveProtectedDevice = useAuthStore((state) => state.saveProtectedDevice);
  const canUseSecureStorage = isSecureStorageAvailable();
  const [code, setCode] = useState('');
  const [alias, setAlias] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const lastAutoSubmittedCode = useRef('');

  const submit = useCallback(async () => {
    if (!/^\d{6}$/.test(code) || alias.trim().length < 2 || loading || !canUseSecureStorage) return;
    setLoading(true);
    setError(null);
    try {
      const identity = await getDeviceIdentity();
      const { data } = await api.post<PairResponse>('/pairing/consume', {
        code,
        alias_name: alias.trim(),
        ...identity,
      });
      if (!data.deviceToken) throw new Error('El servidor no devolvió la credencial del dispositivo.');
      await saveProtectedDevice(data.deviceToken, identity.device_uuid);
      router.replace('/protection');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [alias, canUseSecureStorage, code, loading, saveProtectedDevice, router]);

  useEffect(() => {
    if (
      /^\d{6}$/.test(code)
      && alias.trim().length >= 2
      && canUseSecureStorage
      && !loading
      && lastAutoSubmittedCode.current !== code
    ) {
      lastAutoSubmittedCode.current = code;
      void submit();
    }
  }, [alias, canUseSecureStorage, code, loading, submit]);

  return (
    <Screen>
      <Text style={styles.kicker}>DISPOSITIVO PROTEGIDO</Text>
      <Text style={styles.title}>Vinculá este dispositivo</Text>
      <Text style={styles.subtitle}>
        Pedile al adulto responsable el código temporal que generó desde su cuenta.
      </Text>
      {!canUseSecureStorage ? (
        <Feedback kind="info" message="Para proteger el código y la credencial del dispositivo, vinculalo desde la aplicación Android o iOS." />
      ) : null}
      <Card>
        <TextField
          label="Nombre para identificar este dispositivo"
          value={alias}
          onChangeText={setAlias}
          autoCapitalize="words"
          placeholder="Ej. Tablet de casa"
          maxLength={40}
        />
        <TextField
          label="Código de vinculación"
          value={code}
          onChangeText={(value) => {
            const digits = value.replace(/\D/g, '').slice(0, 6);
            setCode(digits);
          }}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          maxLength={6}
          placeholder="123456"
          style={styles.otp}
          accessibilityHint="Ingresá los seis dígitos del código de vinculación"
        />
      </Card>
      {error ? <Feedback message={error} /> : null}
      <Button
        onPress={() => void submit()}
        disabled={!/^\d{6}$/.test(code) || alias.trim().length < 2 || !canUseSecureStorage}
        loading={loading}
      >
        Vincular dispositivo
      </Button>
      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          Vincular el equipo no activa por sí solo el filtrado de sitios. La VPN local necesita una integración nativa de Android aún no incluida.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: colors.primary, fontSize: 13, fontWeight: '800', letterSpacing: 1.5, marginTop: 18 },
  title: { color: colors.ink, fontSize: 28, lineHeight: 36, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 23 },
  otp: { textAlign: 'center', fontSize: 24, letterSpacing: 12, fontWeight: '800' },
  notice: { backgroundColor: colors.warningBackground, borderRadius: 12, padding: 14 },
  noticeText: { color: colors.warning, fontSize: 13, lineHeight: 20 },
});
