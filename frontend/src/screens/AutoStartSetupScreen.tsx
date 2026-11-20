import React from 'react';
import { Power } from 'lucide-react-native';
import SetupStepScreen from './SetupStepScreen';
import type { AppScreenProps } from '../navigation/types';
import { FIGMA_COLORS } from '../components/FigmaScreen';

export default function AutoStartSetupScreen({
  navigation,
}: AppScreenProps<'AutoStartSetup'>) {
  return (
    <SetupStepScreen
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate('UninstallProtection')}
      title="Permití el inicio automático"
      subtitle="Así BA Protege+ podrá reanudar la protección cuando el dispositivo se reinicie."
      icon={<Power color={FIGMA_COLORS.primary} size={34} />}
      instructions={[
        'Abrí los ajustes de aplicaciones del dispositivo.',
        'Seleccioná BA Protege+ y buscá “Inicio automático”.',
        'Permití que la aplicación se inicie al encender el dispositivo.',
      ]}
      stepLabel="Paso de configuración"
    />
  );
}
