import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import { COLORS } from '../../constants/colors';

export default function PermisoNotif() {
  return (
    <View style={styles.container}>
      <Header subtitle="Configurar Protección" />
      <Text style={styles.caption}>Permitir notificaciones</Text>
      <Text style={styles.small}>Para tener al menor informado sobre todos los cambios.</Text>
      <View style={{ padding: 20, marginTop: 40 }}>
        <PrimaryButton title="Permitir" onPress={() => router.push('/protegido/segundo-plano')} />
        <PrimaryButton title="Atrás" variant="outline" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  caption: { textAlign: 'center', fontSize: 14, color: COLORS.primary, marginTop: 20 },
  small: { textAlign: 'center', fontSize: 11, color: COLORS.grayText, marginTop: 8 },
});