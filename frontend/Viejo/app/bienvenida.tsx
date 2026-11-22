// app/bienvenida.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import Header from '../components/Header';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS } from '../constants/colors';

export default function Bienvenida() {
  return (
    <View style={styles.container}>
      <Header title="BA Protege+" showLogo={false} />
      <View style={styles.content}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Protección Digital</Text>
        <Text style={styles.title}>Para Tu Familia</Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton title="Inicio de sesión" onPress={() => router.push('/login')} />
        <PrimaryButton title="Registrarse" variant="outline" onPress={() => router.push('/registro')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo: { width: 180, height: 180, marginBottom: 16 },
  title: { fontSize: 18, color: COLORS.primary, fontWeight: '600' },
  footer: { padding: 24 },
});