import React from 'react';
import { Bell, CheckCircle2 } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import {
  FigmaScreen,
  FIGMA_COLORS,
  PageTitle,
  PrimaryAction,
  ScreenFooter,
  SurfaceCard,
  figmaStyles,
} from '../components/FigmaScreen';
import type { AppScreenProps } from '../navigation/types';

export default function NotificationPermissionScreen({
  navigation,
}: AppScreenProps<'NotificationPermission'>) {
  return (
    <FigmaScreen onBack={() => navigation.goBack()}>
      <PageTitle
        title="Activá las notificaciones"
        subtitle="Recibí avisos importantes sobre la protección y la actividad del dispositivo."
      />
      <View style={styles.hero}>
        <Bell color={FIGMA_COLORS.primary} size={35} />
      </View>
      <SurfaceCard>
        <Text style={figmaStyles.sectionTitle}>¿Para qué se usan?</Text>
        <View style={styles.benefit}>
          <CheckCircle2 color={FIGMA_COLORS.positive} size={19} />
          <Text style={styles.benefitText}>Conocer si la protección se interrumpe.</Text>
        </View>
        <View style={styles.benefit}>
          <CheckCircle2 color={FIGMA_COLORS.positive} size={19} />
          <Text style={styles.benefitText}>Recibir avisos de actividad importante.</Text>
        </View>
      </SurfaceCard>
      <Text style={styles.notice}>
        Android puede mostrar una ventana para confirmar este permiso.
      </Text>
      <ScreenFooter>
        <PrimaryAction
          label="Permitir y continuar"
          onPress={() => navigation.navigate('BackgroundWork')}
        />
      </ScreenFooter>
    </FigmaScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: FIGMA_COLORS.softPurple,
    borderRadius: 34,
    height: 68,
    justifyContent: 'center',
    marginBottom: 22,
    width: 68,
  },
  benefit: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  benefitText: {
    color: FIGMA_COLORS.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  notice: {
    color: FIGMA_COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 15,
    textAlign: 'center',
  },
});
