import React from 'react';
import { ShieldCheck } from 'lucide-react-native';
import SetupStepScreen from './SetupStepScreen';
import type { AppScreenProps } from '../navigation/types';
import { FIGMA_COLORS } from '../components/FigmaScreen';

export default function UninstallProtectionScreen({
  navigation,
}: AppScreenProps<'UninstallProtection'>) {
  return (
    <SetupStepScreen
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate('NotificationPermission')}
      title="Protegé la aplicación"
      subtitle="La protección evita que BA Protege+ se desinstale sin autorización."
      icon={<ShieldCheck color={FIGMA_COLORS.primary} size={34} />}
      instructions={[
        'Revisá los permisos de administración solicitados.',
        'Confirmá que BA Protege+ pueda proteger la configuración.',
        'Completá la confirmación que aparece en Android.',
      ]}
      stepLabel="Protección del dispositivo"
    />
  );
}
