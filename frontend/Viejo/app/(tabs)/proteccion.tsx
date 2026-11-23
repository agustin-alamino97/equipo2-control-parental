import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Header from '../../components/Header';
import OptionCard from '../../components/OptionCard';
import FadeInView from '../../components/FadeInView';
import { COLORS } from '../../constants/colors';

export default function Proteccion() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <Header subtitle="Dispositivos Vinculados" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.help}>Activá y desactivá la protección de los dispositivos vinculados.</Text>
        <FadeInView delay={0}><OptionCard icon="link" title="Vincular un nuevo dispositivo" color="purple" onPress={() => router.push('/responsable/vincular-dispositivo')} /></FadeInView>
        <FadeInView delay={120}><OptionCard icon="tablet" title="Tablet de Niño" subtitle="Dispositivo vinculado" color="green" onPress={() => router.push('/responsable/tablet-nino')} /></FadeInView>
        <FadeInView delay={240}><OptionCard icon="phone" title="Celular de Dani" subtitle="2 dispositivos vinculados" color="green" onPress={() => router.push('/responsable/descripcion-nino')} /></FadeInView>
        <FadeInView delay={360}><OptionCard icon="laptop" title="Notebook de mamá" subtitle="Controlá las alertas" color="orange" onPress={() => {}} /></FadeInView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  help: { fontSize: 12, color: COLORS.grayText, textAlign: 'center', marginBottom: 14 },
});