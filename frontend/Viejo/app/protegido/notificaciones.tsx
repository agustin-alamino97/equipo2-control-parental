import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import { COLORS } from '../../constants/colors';

export default function Notificaciones() {
  const [code, setCode] = useState(['', '', '', '', '']);
  return (
    <View style={styles.container}>
      <Header subtitle="Modo Protegido" />
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text style={styles.orange}>¡Revisá tus notificaciones!</Text>
        <Text style={styles.caption}>Ingresá el código que te enviamos al dispositivo del responsable.</Text>
        <View style={styles.codeRow}>
          {code.map((c, i) => (
            <TextInput key={i} style={styles.codeBox} maxLength={1} keyboardType="number-pad" value={c} onChangeText={t => { const nc = [...code]; nc[i] = t; setCode(nc); }} />
          ))}
        </View>
        <Text style={styles.small}>Si no recibiste el código, hacé clic acá.</Text>
        <PrimaryButton title="Confirmar" variant={code.every(c => c) ? 'solid' : 'disabled'} onPress={() => code.every(c => c) && router.push('/protegido/accesibilidad')} />
        <PrimaryButton title="Cancelar" variant="outline" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  orange: { color: COLORS.orange, fontWeight: '700', marginBottom: 8 },
  caption: { fontSize: 12, color: COLORS.black, textAlign: 'center', marginBottom: 16 },
  codeRow: { flexDirection: 'row', marginBottom: 10 },
  codeBox: { width: 45, height: 55, backgroundColor: COLORS.lightPurple, borderRadius: 8, marginHorizontal: 4, textAlign: 'center', fontSize: 20 },
  small: { fontSize: 10, color: COLORS.grayText, marginBottom: 16 },
});