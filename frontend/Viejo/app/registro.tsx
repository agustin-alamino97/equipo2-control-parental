import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import Header from '../components/Header';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS } from '../constants/colors';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetir, setRepetir] = useState('');
  const [acepta, setAcepta] = useState(false);

  const isValid = nombre && apellido && email && password && repetir === password && acepta;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Header title="BA Protege+" subtitle="Creá tu cuenta" />
        
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
          <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
          <TextInput style={styles.input} placeholder="Correo electrónico" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
          <TextInput style={styles.input} placeholder="Repetir contraseña" secureTextEntry value={repetir} onChangeText={setRepetir} />
          
          <TouchableOpacity style={styles.checkRow} onPress={() => setAcepta(!acepta)}>
            <View style={[styles.checkbox, acepta && styles.checkboxChecked]} />
            <Text style={styles.checkLabel}>Acepto términos y condiciones</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton title="Confirmar" variant={isValid ? 'solid' : 'disabled'} onPress={() => isValid && router.push('/confirmar-correo')} />
          <PrimaryButton title="Cancelar" variant="outline" onPress={() => router.back()} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { padding: 20, paddingBottom: 0 },
  input: { borderWidth: 1, borderColor: COLORS.gray, borderRadius: 6, padding: 12, marginBottom: 10, fontSize: 14 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  checkbox: { width: 18, height: 18, borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 3, marginRight: 8 },
  checkboxChecked: { backgroundColor: COLORS.primary },
  checkLabel: { fontSize: 12, color: COLORS.black },
  footer: { padding: 20, paddingBottom: 32, borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: COLORS.white },
});