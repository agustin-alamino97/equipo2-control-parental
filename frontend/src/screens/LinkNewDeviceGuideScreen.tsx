import React from 'react';
import LinkDeviceGuideScreen from './LinkDeviceGuideScreen';
import type { AppScreenProps } from '../navigation/types';

export default function LinkNewDeviceGuideScreen({
                                                   navigation,
                                                 }: AppScreenProps<'LinkNewDeviceGuide'>) {
  return (
      <LinkDeviceGuideScreen
          onBack={() => navigation.goBack()}
          onContinue={() => navigation.navigate('AccessibilitySetup')}
      />
  );
}