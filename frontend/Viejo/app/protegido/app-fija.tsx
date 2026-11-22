import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import InfoBox from '../../components/InfoBox';
import { COLORS } from '../../constants/colors';

export default function AppFija() {
  return (
    <View style={styles.container}>
      <Header subtitle="Configurar Protección" />
      <Text style={styles.caption}>Fijá BA Protege+ en el dispositivo del menor.</Text>
      <Text style={styles.small}>De esta manera el menor no podrá apagar la aplicación.</Text>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <InfoBox>
          <Text style={styles.step}>1. Ve al menú Aplicaciones.</Text>
          <Text style={styles.step}>2. Seleccioná la sección Aplicaciones Fijadas.</Text>
          <Text style={styles.step}>3. Habilitá la opción BA Protege+.</Text>
          <Text style={styles.step}>4. Aceptar.</Text>
        </InfoBox>
        <Text style={styles.link}>Ver el video de ayuda</Text>
        <PrimaryButton title="Siguiente" onPress={() => router.push('/protegido/inicio-automatico')} />
        <PrimaryButton title="Atrás" variant="outline" onPress={() => router.back()} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  caption: { textAlign: 'center', fontSize: 13, color: COLORS.primary, marginTop: 12 },
  small: { textAlign: 'center', fontSize: 11, color: COLORS.grayText, marginVertical: 8, paddingHorizontal: 20 },
  step: { fontSize: 12, marginVertical: 3, color: COLORS.black },
  link: { color: COLORS.primary, fontSize: 12, textDecorationLine: 'underline', marginBottom: 20 },
});