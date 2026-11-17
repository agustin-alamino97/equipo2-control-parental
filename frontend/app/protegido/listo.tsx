import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import AnimatedCheck from '../../components/AnimatedCheck';
import FadeInView from '../../components/FadeInView';
import { COLORS } from '../../constants/colors';

export default function Listo() {
  return (
    <View style={styles.container}>
      <Header subtitle="Configurar Protección" />
      <View style={{ padding: 20, alignItems: 'center' }}>
        <FadeInView delay={0}><AnimatedCheck size={90} /></FadeInView>
        <FadeInView delay={400}>
          <Text style={styles.title}>Ahora podés gestionar el bloqueo de sitios de apuestas ilegales en el dispositivo del menor.</Text>
        </FadeInView>
        <Text style={styles.small}>Abrí BA Protege+ en modo responsable en el dispositivo del adulto y bloqueá los sitios que consideres inapropiados para el menor.</Text>
        <PrimaryButton title="Terminar configuración" onPress={() => router.replace('/(tabs)/proteccion')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  title: { fontSize: 14, fontWeight: '700', color: COLORS.black, textAlign: 'center', marginBottom: 16 },
  small: { fontSize: 12, color: COLORS.grayText, textAlign: 'center', marginBottom: 30 },
});