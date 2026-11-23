import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import InfoBox from '../../components/InfoBox';
import { COLORS } from '../../constants/colors';

export default function InicioAutomatico() {
  return (
    <View style={styles.container}>
      <Header subtitle="Configurar Protección" />
      <Text style={styles.caption}>Activá el inicio automático</Text>
      <Text style={styles.small}>Para bloquear los sitios de apuestas ilegales en cualquier momento.</Text>
      <View style={{ padding: 20 }}>
        <InfoBox><Text style={styles.step}>1. Encontrá y activá BA Protege+ en el dispositivo.</Text></InfoBox>
        <Text style={styles.link}>Ver el video de ayuda.</Text>
        <PrimaryButton title="Siguiente" onPress={() => router.push('/protegido/contra-eliminacion')} />
        <PrimaryButton title="Atrás" variant="outline" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  caption: { textAlign: 'center', fontSize: 13, color: COLORS.primary, marginTop: 12 },
  small: { textAlign: 'center', fontSize: 11, color: COLORS.grayText, marginVertical: 8, paddingHorizontal: 20 },
  step: { fontSize: 12, marginVertical: 3 },
  link: { color: COLORS.primary, fontSize: 12, textDecorationLine: 'underline', marginBottom: 20 },
});