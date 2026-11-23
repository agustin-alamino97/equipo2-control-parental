import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckCircle2, Mail } from 'lucide-react-native';
import {
  FigmaScreen,
  FIGMA_COLORS,
  PageTitle,
  PrimaryAction,
  ScreenFooter,
  SurfaceCard,
} from '../components';
import type { AppScreenProps } from '../navigation/types';

export default function RegistrationSuccessScreen({
  navigation,
}: AppScreenProps<'RegistrationSuccess'>) {
  return (
    <FigmaScreen>
      <View style={styles.hero}>
        <CheckCircle2 color={FIGMA_COLORS.positive} size={66} strokeWidth={1.8} />
      </View>
      <PageTitle
        title="¡Ya casi está!"
        subtitle="Tu cuenta se creó correctamente."
      />
      <SurfaceCard>
        <View style={styles.mailIcon}>
          <Mail color={FIGMA_COLORS.primary} size={23} />
        </View>
        <Text style={styles.cardTitle}>Confirmá tu correo electrónico</Text>
        <Text style={styles.cardBody}>
          Te enviamos un enlace para validar tu cuenta. Revisá también la carpeta
          de correo no deseado.
        </Text>
      </SurfaceCard>
      <ScreenFooter>
        <PrimaryAction
          label="Ir a iniciar sesión"
          onPress={() => navigation.navigate('Login')}
        />
      </ScreenFooter>
    </FigmaScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#E8F7EF',
    borderRadius: 48,
    height: 96,
    justifyContent: 'center',
    marginBottom: 22,
    width: 96,
  },
  mailIcon: {
    alignItems: 'center',
    backgroundColor: FIGMA_COLORS.softPurple,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    marginBottom: 14,
    width: 44,
  },
  cardTitle: {
    color: FIGMA_COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardBody: {
    color: FIGMA_COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
  },
});
