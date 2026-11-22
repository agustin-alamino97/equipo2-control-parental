import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Button from '../components/Button';
import SettingRow from '../components/SettingRow';
import {
    FigmaScreen,
    PageTitle,
    ScreenFooter,
} from '../components';
import type { AppScreenProps } from '../navigation/types';

export default function SettingsScreen({ navigation }: AppScreenProps<'Settings'>) {
    const [protection, setProtection] = useState(true);
    const [allowSites, setAllowSites] = useState(true);

    return (
        <FigmaScreen onBack={() => navigation.goBack()}>
            <PageTitle
                title="Configuración"
                subtitle="Ajustá el comportamiento del control parental."
            />
            <SettingRow
                title="Bloqueo de sitios"
                description="Protección de sitios de juegos de azar"
                value={protection}
                onValueChange={setProtection}
            />
            <SettingRow
                title="Lista de información"
                description="Incluir sitios informativos relacionados"
                value={allowSites}
                onValueChange={setAllowSites}
            />
            <ScreenFooter>
                <Button
                    label="Volver"
                    variant="outline"
                    onPress={() => navigation.goBack()}
                />
            </ScreenFooter>
        </FigmaScreen>
    );
}

const styles = StyleSheet.create({});