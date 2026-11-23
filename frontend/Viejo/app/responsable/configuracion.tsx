import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import InfoBox from '../../components/InfoBox';
import AppIcon from '../../components/AppIcon';
import { COLORS } from '../../constants/colors';

const steps = [
  { title: 'Configuración Responsable', subtitle: 'Bloqueá sitios de información sobre juegos de azar' },
  { title: 'Configuración Responsable', subtitle: 'Permisos de responsable del dispositivo' },
  { title: 'Configuración Responsable', subtitle: 'Activar VPN' },
  { title: 'Configuración Responsable', subtitle: 'Activar control parental' },
];

export default function ConfiguracionResponsable() {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <View style={styles.container}>
      <Header subtitle={current.title} />
      <Text style={styles.caption}>{current.subtitle}</Text>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {step === 0 && (
          <InfoBox>
            <Text style={styles.text}>Actualmente trabajamos con una base de bloqueo de sitios de información sobre juegos de azar, si querés excluir algún sitio de esta lista, podés ajustar la configuración. Asimismo, tenés la opción de bloquear todos los sitios con mayor riesgo.</Text>
            <TouchableOpacity style={styles.checkRow}><AppIcon name="square" size={18} color={COLORS.primary} /><Text style={styles.checkLabel}>Acepto términos y condiciones</Text></TouchableOpacity>
          </InfoBox>
        )}
        {step === 1 && (
          <InfoBox>
            <Text style={styles.text}>Esta permiso es necesario para evitar que se desinstale la app y para poder brindarte un mejor servicio.{'\n\n'}• Esta permiso permite restringir el acceso a sitios no deseados.{'\n\n'}• Garantiza el funcionamiento adecuado de la aplicación.</Text>
            <TouchableOpacity style={styles.checkRow}><AppIcon name="square" size={18} color={COLORS.primary} /><Text style={styles.checkLabel}>Acepto las condiciones de LUTIXA</Text></TouchableOpacity>
            <Text style={styles.link}>Si no estás de acuerdo, podés continuar sin esta función.</Text>
          </InfoBox>
        )}
        {step === 2 && (
          <InfoBox>
            <Text style={styles.text}>Este permiso otorga una VPN local que ayuda a bloquear sitios no deseados y no afecta el funcionamiento de la aplicación.</Text>
            <TouchableOpacity style={styles.checkRow}><AppIcon name="square" size={18} color={COLORS.primary} /><Text style={styles.checkLabel}>Acepto términos y condiciones</Text></TouchableOpacity>
          </InfoBox>
        )}
        {step === 3 && (
          <InfoBox>
            <Text style={styles.text}>• Para bloquear los sitios web, es necesario que actives el control parental</Text>
            <Text style={styles.text}>• Ver video de ayuda</Text>
            <Text style={styles.text}>• Activar el control parental</Text>
            <Text style={styles.text}>• Acceder a la configuración de tu dispositivo</Text>
            <Text style={styles.text}>• Ir a ajustes y activar el control parental</Text>
          </InfoBox>
        )}
        <PrimaryButton title={isLast ? 'Activar protección' : 'Siguiente'} onPress={() => isLast ? router.push('/(tabs)/inicio') : setStep(step + 1)} />
        <PrimaryButton title={isLast ? 'Volver y revisar' : 'Atrás'} variant="outline" onPress={() => step > 0 ? setStep(step - 1) : router.back()} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  caption: { textAlign: 'center', fontSize: 13, color: COLORS.primary, marginVertical: 12, paddingHorizontal: 20 },
  text: { fontSize: 12, color: COLORS.black, marginVertical: 2 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  checkLabel: { fontSize: 12, color: COLORS.black },
  link: { fontSize: 11, color: COLORS.grayText, marginTop: 8, fontStyle: 'italic' },
});