import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Header from '../../components/Header';
import OptionCard from '../../components/OptionCard';
import FadeInView from '../../components/FadeInView';
import { COLORS } from '../../constants/colors';

export default function Inicio() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <Header subtitle="Modo Responsable" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <FadeInView delay={0}><OptionCard icon="ban" title="Bloquear Sitios" subtitle="Gestioná los sitios bloqueados" color="purple" onPress={() => router.push('/responsable/bloqueo-sitios')} /></FadeInView>
        <FadeInView delay={120}><OptionCard icon="eye" title="Visualizar Dispositivos" subtitle="Vinculá dispositivos al control parental" color="green" onPress={() => router.push('/responsable/dispositivos')} /></FadeInView>
        <FadeInView delay={240}><OptionCard icon="settings" title="Configuraciones" subtitle="Configuración del modo Responsable" color="purple" onPress={() => router.push('/responsable/configuracion')} /></FadeInView>
      </ScrollView>
    </View>
  );
}