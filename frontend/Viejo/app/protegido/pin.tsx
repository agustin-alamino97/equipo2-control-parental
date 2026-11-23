import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Header from '../../components/Header';
import PinPad from '../../components/PinPad';
import { COLORS } from '../../constants/colors';

export default function Pin() {
  const [pin, setPin] = useState('');
  return (
    <View style={styles.container}>
      <Header subtitle="Configurar Protección" />
      <Text style={styles.caption}>Establece el código de acceso.</Text>
      <Text style={styles.small}>Para que puedas desbloquear fácilmente el dispositivo del menor si es necesario.</Text>
      <View style={styles.dots}>
        {[0, 1, 2, 3].map(i => <View key={i} style={[styles.dot, pin.length > i && styles.dotFill]} />)}
      </View>
      <PinPad onPress={d => {
        const newPin = pin + d;
        setPin(newPin);
        if (newPin.length === 4) router.push('/protegido/repetir-pin');
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  caption: { textAlign: 'center', fontSize: 13, color: COLORS.primary, marginTop: 16 },
  small: { textAlign: 'center', fontSize: 11, color: COLORS.grayText, marginVertical: 10, paddingHorizontal: 20 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginVertical: 20 },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.primary, marginHorizontal: 8 },
  dotFill: { backgroundColor: COLORS.primary },
});