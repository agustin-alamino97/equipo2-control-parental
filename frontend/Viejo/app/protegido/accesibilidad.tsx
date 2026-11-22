import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import InfoBox from '../../components/InfoBox';
import { COLORS } from '../../constants/colors';

export default function Accesibilidad() {
  return (
    <View style={styles.container}>
      <Header subtitle="Configurar Protección" />
      <Text style={styles.caption}>Activá la accesibilidad</Text>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <InfoBox>
          <Text style={styles.step}>1. Abrí la sección Aplicaciones descargadas.</Text>
          <Text style={styles.step}>2. Seleccioná BA Protege+.</Text>
          <Text style={styles.step}>3. Habilitá la aplicación marcando la casilla.</Text>
          <Text style={styles.step}>4. Aceptar.</Text>
        </InfoBox>
        <Text style={styles.link}>Ver el video de ayuda</Text>
        <PrimaryButton title="Siguiente" onPress={() => router.push('/protegido/app-fija')} />
        <PrimaryButton title="Atrás" variant="outline" onPress={() => router.back()} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  caption: { textAlign: 'center', fontSize: 13, color: COLORS.primary, marginVertical: 12 },
  step: { fontSize: 12, marginVertical: 3, color: COLORS.black },
  link: { color: COLORS.primary, fontSize: 12, textDecorationLine: 'underline', marginBottom: 20 },
});