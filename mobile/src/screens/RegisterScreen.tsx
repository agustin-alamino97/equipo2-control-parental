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

export function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const canUseSecureStorage = isSecureStorageAvailable();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const valid = name.trim().length >= 2 && isValidEmail(email) && isValidPassword(password);

  const submit = async () => {
    if (!valid || loading || !canUseSecureStorage) return;
    setLoading(true);
    setError(null);
    try {
      await register({ name: name.trim(), surname: surname.trim(), email: email.trim(), password });
      setComplete(true);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.heading}>
        <Text style={styles.kicker}>NUEVA CUENTA</Text>
        <Text style={styles.title}>Creá tu cuenta responsable</Text>
        <Text style={styles.subtitle}>Completá tus datos para comenzar.</Text>
      </View>
      <TextField label="Nombre" value={name} onChangeText={setName} autoCapitalize="words" placeholder="Tu nombre" />
      <TextField label="Apellido (opcional)" value={surname} onChangeText={setSurname} autoCapitalize="words" placeholder="Tu apellido" />
      <TextField
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        placeholder="nombre@correo.com"
      />
      <TextField
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="newPassword"
        autoComplete="new-password"
        placeholder="Al menos 8 caracteres y un número"
      />
      {!canUseSecureStorage ? (
        <Feedback kind="info" message="La creación de cuentas requiere la aplicación móvil para guardar credenciales de forma segura." />
      ) : null}
      {error ? <Feedback message={error} /> : null}
      {complete ? <Feedback kind="success" message="Cuenta creada. Ya podés ingresar con tu correo y contraseña." /> : null}
      <Button
        onPress={() => void submit()}
        disabled={!valid || complete || !canUseSecureStorage}
        loading={loading}
      >
        Crear cuenta
      </Button>
      <Button variant="secondary" onPress={() => router.back()}>Volver al inicio de sesión</Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 8, marginTop: 12, marginBottom: 8 },
  kicker: { color: colors.primary, fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: colors.ink, fontSize: 28, lineHeight: 35, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 23 },
});
