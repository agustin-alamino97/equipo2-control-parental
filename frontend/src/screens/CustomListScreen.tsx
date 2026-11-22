import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Button from '../components/Button';
import SettingRow from '../components/SettingRow';
import {
    FigmaScreen,
    PageTitle,
    ScreenFooter,
    SurfaceCard,
    FIGMA_COLORS,
} from '../components/FigmaScreen';
import type { AppScreenProps } from '../navigation/types';

export default function CustomListScreen({
                                             navigation,
                                         }: AppScreenProps<'CustomList'>) {
    const [enabled, setEnabled] = useState(true);

    return (
        <FigmaScreen onBack={() => navigation.goBack()}>
            <PageTitle
                title="Lista personalizada"
                subtitle="Elegí si querés bloquear sitios de información sobre juegos de azar."
            />
            <SettingRow
                title="Sitios informativos"
                description="2443 sitios incluidos en la lista."
                value={enabled}
                onValueChange={setEnabled}
            />
            <SurfaceCard>
                <Text style={styles.body}>
                    Los sitios de información sobre juegos de azar se incluyen en la
                    restricción cuando esta opción está activa.
                </Text>
            </SurfaceCard>
            <ScreenFooter>
                <Button label="Confirmar" onPress={() => navigation.goBack()} />
            </ScreenFooter>
        </FigmaScreen>
    );
}

const styles = StyleSheet.create({
    body: {
        color: FIGMA_COLORS.text,
        fontSize: 13,
        lineHeight: 20,
    },
});