import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import InfoBox from '../../components/InfoBox';
import { COLORS } from '../../constants/colors';

export default function VincularDispositivo() {
  return (
    <View style={styles.container}>
      <Header subtitle="Vincular un nuevo dispositivo" />
      <View style={{ padding: 20 }}>
        <InfoBox>
          <Text style={{ fontWeight: '700', marginBottom: 6 }}>Para vincular un nuevo dispositivo seguí los siguientes pasos:</Text>
          <Text style={styles.step}>• Aceptá los permisos del dispositivo.</Text>
          <Text style={styles.step}>• Aceptá el acceso a "Modo Accesibilidad".</Text>
          <Text style={styles.step}>• Completá el paso del PIN.</Text>
          <Text style={styles.step}>• Aceptá las condiciones de LUTIXA.</Text>
          <Text style={styles.step}>• Listo, ya tenés configurado el dispositivo.</Text>
        </InfoBox>
        <Text style={styles.link}>Ver el video de ayuda</Text>
        <PrimaryButton title="Aceptar" onPress={() => router.back()} />
        <PrimaryButton title="Cancelar" variant="outline" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  step: { fontSize: 12, color: COLORS.black, marginVertical: 2 },
  link: { color: COLORS.primary, textDecorationLine: 'underline', fontSize: 12, marginBottom: 20 },
});