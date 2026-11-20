import React from 'react';
import { BatteryCharging } from 'lucide-react-native';
import SetupStepScreen from './SetupStepScreen';
import type { AppScreenProps } from '../navigation/types';
import { FIGMA_COLORS } from '../components/FigmaScreen';

export default function BackgroundWorkScreen({
  navigation,
}: AppScreenProps<'BackgroundWork'>) {
  return (
    <SetupStepScreen
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate('AccessCodeSetup')}
      title="Permití la actividad en segundo plano"
      subtitle="La protección necesita seguir funcionando aunque no estés usando la aplicación."
      icon={<BatteryCharging color={FIGMA_COLORS.primary} size={34} />}
      instructions={[
        'Abrí los ajustes de batería para BA Protege+.',
        'Desactivá la optimización o elegí “Sin restricciones”.',
        'Dejá que la aplicación trabaje en segundo plano.',
      ]}
      stepLabel="Último permiso"
    />
  );
}
