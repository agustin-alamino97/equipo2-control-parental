import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Header from '../components/Header';
import AppIcon from '../components/AppIcon';
import FadeInView from '../components/FadeInView';
import { COLORS } from '../constants/colors';
import { getUser, setUser } from '../utils/storage';

export default function ModoUso() {
  const selectMode = async (mode: 'responsable' | 'protegido') => {
    const user = await getUser();
    if (user) await setUser({ ...user, mode });
    if (mode === 'responsable') router.replace('/(tabs)/inicio');
    else router.replace('/protegido/notificaciones');
  };

  return (
    <View style={styles.container}>
      <Header subtitle="Modo de uso" />
      <View style={styles.content}>
        <Text style={styles.title}>Elegí cómo querés que protejamos a tu familia.</Text>
        <FadeInView delay={0}>
          <TouchableOpacity style={[styles.card, { backgroundColor: COLORS.primary }]} onPress={() => selectMode('responsable')}>
            <View style={styles.iconCircle}><AppIcon name="shieldCheckFilled" size={28} color={COLORS.white} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Modo Responsable</Text>
              <Text style={styles.cardText}>Controlá su actividad y recibí alertas.</Text>
            </View>
          </TouchableOpacity>
        </FadeInView>
        <FadeInView delay={200}>
          <TouchableOpacity style={[styles.card, { backgroundColor: COLORS.green }]} onPress={() => selectMode('protegido')}>
            <View style={styles.iconCircle}><AppIcon name="child" size={28} color={COLORS.white} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Modo Protegido</Text>
              <Text style={styles.cardText}>Controlá la actividad y recibí alertas.</Text>
            </View>
          </TouchableOpacity>
        </FadeInView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 14, color: COLORS.grayText, textAlign: 'center', marginBottom: 24 },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, padding: 16, marginVertical: 8 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardTitle: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  cardText: { color: COLORS.white, fontSize: 11, marginTop: 2 },
});