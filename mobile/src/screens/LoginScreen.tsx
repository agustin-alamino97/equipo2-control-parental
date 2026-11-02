import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Feedback } from '../components/Feedback';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { getErrorMessage } from '../services/api';
import { isSecureStorageAvailable } from '../services/secureStorage';
import { isValidEmail, isValidPassword } from '../services/validation';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme';

export function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const canUseSecureStorage = isSecureStorageAvailable();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const valid = isValidEmail(email) && isValidPassword(password);

  const submit = async () => {
    if (!valid || loading || !canUseSecureStorage) return;
    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.heading}>
        <Text style={styles.kicker}>BA PROTEGE+</Text>
        <Text style={styles.title}>Ingresá a tu cuenta</Text>
        <Text style={styles.subtitle}>Gestioná el cuidado digital de tu familia.</Text>
      </View>
      <TextField
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        placeholder="nombre@correo.com"
        returnKeyType="next"
      />
      <TextField
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="password"
        autoComplete="password"
        placeholder="Al menos 8 caracteres y un número"
        onSubmitEditing={() => void submit()}
      />
      {!canUseSecureStorage ? (
        <Feedback kind="info" message="La vista web sirve para explorar la interfaz. Iniciá sesión en la aplicación Android o iOS para proteger tus credenciales." />
      ) : null}
      {error ? <Feedback message={error} /> : null}
      <Button onPress={() => void submit()} disabled={!valid || !canUseSecureStorage} loading={loading}>Ingresar</Button>
      <View style={styles.footer}>
        <Text style={styles.footerText}>¿Todavía no tenés una cuenta?</Text>
        <Button
          variant="secondary"
          onPress={() => router.push('/register')}
          disabled={!canUseSecureStorage}
        >
          Crear cuenta
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 8, marginTop: 20, marginBottom: 12 },
  kicker: { color: colors.primary, fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: colors.ink, fontSize: 28, lineHeight: 35, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 23 },
  footer: { gap: 10, marginTop: 10 },
  footerText: { color: colors.muted, fontSize: 14, textAlign: 'center' },
});
