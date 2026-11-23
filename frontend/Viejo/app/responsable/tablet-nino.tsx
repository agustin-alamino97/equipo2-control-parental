import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import { COLORS } from '../../constants/colors';

export default function TabletNino() {
  const [pin, setPin] = useState('');
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', ''];

  return (
    <View style={styles.container}>
      <Header subtitle="Tablet de Niño" />
      <Text style={styles.caption}>Para desvincular tu vinculación ingrese su código de acceso.</Text>
      <View style={styles.pinRow}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={styles.pinBox}><Text style={styles.pinText}>{pin[i] ? '●' : ''}</Text></View>
        ))}
      </View>
      <View style={styles.grid}>
        {digits.map((d, i) => (
          <TouchableOpacity key={i} style={[styles.key, !d && { opacity: 0 }]} onPress={() => setPin(p => p.length < 4 ? p + d : p)}>
            <Text style={styles.keyText}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <PrimaryButton title="Aceptar" onPress={() => router.push('/responsable/descripcion-nino')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  caption: { fontSize: 13, color: COLORS.black, textAlign: 'center', marginVertical: 20, paddingHorizontal: 20 },
  pinRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  pinBox: { width: 50, height: 50, borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 8, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center' },
  pinText: { fontSize: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: 260, alignSelf: 'center' },
  key: { width: 70, height: 70, borderRadius: 35, borderWidth: 1, borderColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', margin: 5 },
  keyText: { fontSize: 22, color: COLORS.primary },
});