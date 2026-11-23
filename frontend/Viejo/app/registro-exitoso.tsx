import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Header from '../components/Header';
import PrimaryButton from '../components/PrimaryButton';
import AnimatedCheck from '../components/AnimatedCheck';
import FadeInView from '../components/FadeInView';
import { COLORS } from '../constants/colors';
import { setOnboarded, setUser } from '../utils/storage';

export default function RegistroExitoso() {
  const handleContinuar = async () => {
    await setOnboarded(true);
    await setUser({ name: 'Darío Rubeo', email: 'darorodevsk@gmail.com', mode: 'responsable' });
    router.replace('/modo-uso');
  };

  return (
    <View style={styles.container}>
      <Header subtitle="Confirmación de cuenta" />
      <View style={styles.content}>
        <FadeInView delay={0}><AnimatedCheck size={90} /></FadeInView>
        <FadeInView delay={400}>
          <Text style={styles.bold}>Te has registrado exitosamente.</Text>
        </FadeInView>
        <PrimaryButton title="Continuar" onPress={handleContinuar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  bold: { fontSize: 16, fontWeight: '700', color: COLORS.black, marginVertical: 20, textAlign: 'center' },
});