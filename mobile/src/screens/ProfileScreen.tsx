import { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Feedback } from '../components/Feedback';
import { Screen } from '../components/Screen';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme';

export function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [error, setError] = useState<string | null>(null);

  const confirmLogout = () => Alert.alert(
    'Cerrar sesión',
    '¿Querés cerrar la sesión de esta cuenta?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: () => {
          void logout().catch((requestError: unknown) => {
            setError(requestError instanceof Error ? requestError.message : 'No se pudo cerrar la sesión.');
          });
        },
      },
    ],
  );

  return (
    <Screen>
      <Text style={styles.kicker}>CUENTA</Text>
      <Text style={styles.title}>Perfil</Text>
      <Card>
        <Text style={styles.name}>{user?.name ?? 'Responsable'}</Text>
        <Text style={styles.email}>{user?.email ?? 'Correo no disponible'}</Text>
      </Card>
      <Card>
        <Text style={styles.sectionTitle}>Seguridad de la cuenta</Text>
        <Text style={styles.description}>
          La sesión se guarda en el almacenamiento seguro del dispositivo y vence según la política del servidor.
        </Text>
      </Card>
      {error ? <Feedback message={error} /> : null}
      <Button variant="danger" onPress={confirmLogout}>Cerrar sesión</Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: colors.ink, fontSize: 28, fontWeight: '800' },
  name: { color: colors.ink, fontSize: 20, fontWeight: '800' },
  email: { color: colors.muted, fontSize: 15 },
  sectionTitle: { color: colors.ink, fontSize: 16, fontWeight: '800' },
  description: { color: colors.muted, fontSize: 14, lineHeight: 21 },
});
