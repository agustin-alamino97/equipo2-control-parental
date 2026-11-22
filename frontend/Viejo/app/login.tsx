import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { router } from 'expo-router';
import Header from '../components/Header';
import PrimaryButton from '../components/PrimaryButton';
import AppIcon from '../components/AppIcon';
import { COLORS } from '../constants/colors';
import { getUser, setOnboarded } from '../utils/storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = isValidEmail && password.length >= 6 && !loading;

  const handleLogin = async () => {
    setError(null);
    if (!isValidEmail) return setError('Ingresá un correo válido.');
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');

    try {
      setLoading(true);
      await new Promise(res => setTimeout(res, 900));
      const existing = await getUser();
      const ok = !existing || existing.email === email.trim();
      if (!ok) throw new Error('Credenciales inválidas.');
      await setOnboarded(true);
      router.replace('/(tabs)/inicio');
    } catch (e: any) {
      setError(e.message ?? 'No pudimos iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Header title="BA Protege+" subtitle="Iniciar sesión" />

        {/* Contenido scrolleable */}
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.iconWrap}>
            <AppIcon name="login" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>¡Bienvenido de nuevo!</Text>
          <Text style={styles.subtitle}>Ingresá tus credenciales para continuar.</Text>

          <Text style={styles.label}>Correo electrónico</Text>
          <View style={[styles.inputWrap, error && !isValidEmail && styles.inputError]}>
            <AppIcon name="mail" size={18} color={COLORS.grayText} />
            <TextInput 
              style={styles.input} 
              placeholder="tucorreo@ejemplo.com" 
              keyboardType="email-address" 
              autoCapitalize="none" 
              autoCorrect={false} 
              value={email} 
              onChangeText={(t) => { setEmail(t); setError(null); }} 
            />
          </View>

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputWrap}>
            <AppIcon name="lock" size={18} color={COLORS.grayText} />
            <TextInput 
              style={styles.input} 
              placeholder="Mínimo 6 caracteres" 
              secureTextEntry={!showPassword} 
              value={password} 
              onChangeText={(t) => { setPassword(t); setError(null); }} 
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
              <AppIcon name="eye" size={18} color={showPassword ? COLORS.primary : COLORS.grayText} />
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <AppIcon name="warning" size={16} color={COLORS.orange} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.forgot} onPress={() => Alert.alert('Recuperar', 'Te enviamos un correo.')}>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Botones anclados al fondo */}
        <View style={styles.footer}>
          {loading ? (
            <View style={styles.loadingBtn}>
              <ActivityIndicator color={COLORS.white} />
              <Text style={styles.loadingText}>Ingresando…</Text>
            </View>
          ) : (
            <PrimaryButton title="Iniciar sesión" variant={canSubmit ? 'solid' : 'disabled'} onPress={() => canSubmit && handleLogin()} />
          )}
          <TouchableOpacity style={styles.registerRow} onPress={() => router.push('/registro')}>
            <Text style={styles.registerText}>¿No tenés cuenta? </Text>
            <Text style={styles.registerLink}>Registrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { padding: 20, paddingBottom: 0 },
  iconWrap: { alignSelf: 'center', width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.lightPurple, alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.primary, textAlign: 'center' },
  subtitle: { fontSize: 13, color: COLORS.grayText, textAlign: 'center', marginTop: 6, marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '600', color: COLORS.primary, marginTop: 12, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.gray, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2, backgroundColor: COLORS.white },
  inputError: { borderColor: COLORS.orange },
  input: { flex: 1, paddingVertical: 10, marginLeft: 8, fontSize: 14, color: COLORS.black },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.lightOrange, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, marginTop: 12 },
  errorText: { color: COLORS.orange, fontSize: 12, marginLeft: 6, flex: 1 },
  forgot: { alignSelf: 'flex-end', marginTop: 10, marginBottom: 20 },
  forgotText: { fontSize: 12, color: COLORS.primary, textDecorationLine: 'underline' },
  footer: { padding: 20, paddingBottom: 32, borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: COLORS.white },
  loadingBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 8, marginVertical: 6 },
  loadingText: { color: COLORS.white, fontWeight: '600', marginLeft: 10, fontSize: 15 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  registerText: { fontSize: 13, color: COLORS.grayText },
  registerLink: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },
});