import React from 'react';
import LinkDeviceGuideScreen from './LinkDeviceGuideScreen';
import type { AppScreenProps } from '../navigation/types';

export default function LinkDeviceScreen({ navigation }: AppScreenProps<'LinkDevice'>) {
    return (
        <LinkDeviceGuideScreen
            title="Vinculá el dispositivo"
            actionLabel="Ya vinculé el dispositivo"
            onBack={() => navigation.goBack()}
            onContinue={() => navigation.navigate('Linked')}
        />
    );
}