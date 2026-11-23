import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Header from '../components/Header';
import PrimaryButton from '../components/PrimaryButton';
import AppIcon from '../components/AppIcon';
import { COLORS } from '../constants/colors';

export default function ConfirmarCorreo() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const handleChange = (text: string, idx: number) => {
    const newCode = [...code]; newCode[idx] = text; setCode(newCode);
  };
  const isComplete = code.every(c => c.length === 1);

  return (
    <View style={styles.container}>
      <Header title="BA Protege+" subtitle="Confirmación de cuenta" />
      <View style={styles.content}>
        <AppIcon name="mail" size={56} color={COLORS.primary} style={{ marginVertical: 12 }} />
        <Text style={styles.bold}>¡Revisa tu correo!</Text>
        <Text style={styles.text}>Te enviamos un mail para confirmar tu cuenta. Recordá revisar tu carpeta de spam.</Text>
        <Text style={styles.bold}>Ingresá el código</Text>
        <View style={styles.codeRow}>
          {code.map((c, i) => (
            <TextInput key={i} style={styles.codeBox} maxLength={1} keyboardType="number-pad" value={c} onChangeText={t => handleChange(t, i)} />
          ))}
        </View>
        <Text style={styles.small}>Si no recibiste el código, hacé clic acá</Text>
        <PrimaryButton title="Confirmar" variant={isComplete ? 'solid' : 'disabled'} onPress={() => isComplete && router.push('/registro-exitoso')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: 24, alignItems: 'center' },
  bold: { fontWeight: '700', color: COLORS.black, marginTop: 10, textAlign: 'center' },
  text: { fontSize: 12, color: COLORS.grayText, textAlign: 'center', marginVertical: 8 },
  codeRow: { flexDirection: 'row', marginVertical: 16 },
  codeBox: { width: 40, height: 50, borderRadius: 8, backgroundColor: COLORS.lightPurple, marginHorizontal: 4, textAlign: 'center', fontSize: 18 },
  small: { fontSize: 10, color: COLORS.grayText, marginBottom: 20 },
});