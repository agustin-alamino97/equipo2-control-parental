import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Header from '../../components/Header';
import InfoBox from '../../components/InfoBox';
import PrimaryButton from '../../components/PrimaryButton';
import { COLORS } from '../../constants/colors';

export default function DescripcionNino() {
  return (
    <View style={styles.container}>
      <Header subtitle="Tablet de Niño" />
      <View style={{ padding: 20 }}>
        <Text style={styles.caption}>Descripción de la vinculación del dispositivo</Text>
        <InfoBox>
          <Text style={styles.bold}>¡Listo!</Text>
          <Text style={styles.text}>El dispositivo ha sido vinculado correctamente.</Text>
          <Text style={styles.text}>Podrás desvincular la vinculación cuando lo desees.</Text>
        </InfoBox>
        <PrimaryButton title="Aceptar" onPress={() => router.push('/(tabs)/inicio')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  caption: { textAlign: 'center', fontSize: 13, marginBottom: 20, color: COLORS.black },
  bold: { fontWeight: '700', color: COLORS.primary, marginBottom: 8 },
  text: { fontSize: 12, color: COLORS.black, marginVertical: 2 },
});