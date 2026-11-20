import React from 'react';
import { Accessibility } from 'lucide-react-native';
import SetupStepScreen from './SetupStepScreen';
import type { AppScreenProps } from '../navigation/types';
import { FIGMA_COLORS } from '../components/FigmaScreen';

export default function AccessibilitySetupScreen({
  navigation,
}: AppScreenProps<'AccessibilitySetup'>) {
  return (
    <SetupStepScreen
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate('KeepAppPinned')}
      title="Activá Accesibilidad"
      subtitle="Este permiso ayuda a mantener activa la protección en el dispositivo."
      icon={<Accessibility color={FIGMA_COLORS.primary} size={34} />}
      instructions={[
        'Abrí los ajustes de Accesibilidad de Android.',
        'Buscá BA Protege+ dentro de los servicios instalados.',
        'Activá el servicio y confirmá el permiso solicitado.',
      ]}
      stepLabel="Permiso requerido"
    />
  );
}
