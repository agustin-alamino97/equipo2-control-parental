import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Feedback } from '../components/Feedback';
import { Screen } from '../components/Screen';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme';

export function OnboardingScreen() {
  const router = useRouter();
  const setMode = useAuthStore((state) => state.setMode);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const chooseMode = async (mode: 'responsible' | 'protected') => {
    setLoading(true);
    setError(null);
    try {
      await setMode(mode);
      router.push(mode === 'responsible' ? '/login' : '/pairing');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo guardar el modo seleccionado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.brand}>
        <View style={styles.mark}><Text style={styles.markText}>+</Text></View>
        <Text style={styles.eyebrow}>BA PROTEGE+</Text>
        <Text style={styles.title}>Acompañar también es cuidar.</Text>
        <Text style={styles.description}>
          Elegí cómo vas a configurar este dispositivo para continuar.
        </Text>
      </View>
      <Card>
        <Text style={styles.cardTitle}>Soy adulto responsable</Text>
        <Text style={styles.cardText}>
          Administrá dispositivos vinculados, reglas y alertas desde tu cuenta.
        </Text>
        <Button onPress={() => void chooseMode('responsible')} loading={loading}>
          Continuar como adulto
        </Button>
      </Card>
      <Card>
        <Text style={styles.cardTitle}>Configurar como dispositivo protegido</Text>
        <Text style={styles.cardText}>
          Vinculá este equipo con el código de seis dígitos de un adulto responsable.
        </Text>
        <Button
          variant="secondary"
          onPress={() => void chooseMode('protected')}
          loading={loading}
        >
          Vincular dispositivo
        </Button>
      </Card>
      {error ? <Feedback message={error} /> : null}
      <Text style={styles.footnote}>
        La protección de red requiere un servicio nativo adicional; esta versión inicial no bloquea tráfico.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: { alignItems: 'center', paddingVertical: 24, gap: 12 },
  mark: { height: 62, width: 62, borderRadius: 20, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  markText: { color: colors.primary, fontSize: 42, lineHeight: 48, fontWeight: '300' },
  eyebrow: { color: colors.primary, fontSize: 13, fontWeight: '800', letterSpacing: 2 },
  title: { color: colors.ink, fontSize: 30, lineHeight: 36, fontWeight: '800', textAlign: 'center' },
  description: { color: colors.muted, fontSize: 16, lineHeight: 24, textAlign: 'center' },
  cardTitle: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  cardText: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  footnote: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', paddingHorizontal: 8 },
});
