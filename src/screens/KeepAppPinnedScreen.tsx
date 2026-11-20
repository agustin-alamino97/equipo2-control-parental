import React from 'react';
import { Pin } from 'lucide-react-native';
import SetupStepScreen from './SetupStepScreen';
import type { AppScreenProps } from '../navigation/types';
import { FIGMA_COLORS } from '../components/FigmaScreen';

export default function KeepAppPinnedScreen({
  navigation,
}: AppScreenProps<'KeepAppPinned'>) {
  return (
    <SetupStepScreen
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate('AutoStartSetup')}
      title="Fijá BA Protege+"
      subtitle="Evitá que el sistema cierre la aplicación mientras protege el dispositivo."
      icon={<Pin color={FIGMA_COLORS.primary} size={34} />}
      instructions={[
        'Abrí la vista de aplicaciones recientes.',
        'Mantené presionado el ícono de BA Protege+.',
        'Elegí “Fijar” o “Mantener abierto”, según tu dispositivo.',
      ]}
      stepLabel="Paso de configuración"
    />
  );
}
