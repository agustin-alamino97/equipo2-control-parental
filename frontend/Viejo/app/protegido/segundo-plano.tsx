import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import InfoBox from '../../components/InfoBox';
import { COLORS } from '../../constants/colors';

export default function SegundoPlano() {
  return (
    <View style={styles.container}>
      <Header subtitle="Configurar Protección" />
      <Text style={styles.caption}>Permitir trabajar en segundo plano</Text>
      <Text style={styles.small}>Para reducir el gasto de batería</Text>
      <View style={{ padding: 20 }}>
        <InfoBox><Text style={styles.step}>1. Seleccioná y activá la opción Sin restricciones.</Text></InfoBox>
        <Text style={styles.link}>Ver el video de ayuda.</Text>
        <PrimaryButton title="Siguiente" onPress={() => router.push('/protegido/pin')} />
        <PrimaryButton title="Atrás" variant="outline" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  caption: { textAlign: 'center', fontSize: 13, color: COLORS.primary, marginTop: 12 },
  small: { textAlign: 'center', fontSize: 11, color: COLORS.grayText, marginTop: 6 },
  step: { fontSize: 12 },
  link: { color: COLORS.primary, fontSize: 12, textDecorationLine: 'underline', marginBottom: 20 },
});