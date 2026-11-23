import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Button from '../components/Button';
import {
    FigmaScreen,
    PageTitle,
    ScreenFooter,
    SurfaceCard,
    FIGMA_COLORS,
} from '../components/FigmaScreen';
import type { AppScreenProps } from '../navigation/types';

const points = [
    'Has elegido bloquear sitios de información sobre juegos de azar.',
    'Has aceptado que la aplicación no se elimine durante el período de bloqueo.',
    'Has permitido acceso para utilizar el VPN local.',
    'Aceptás los términos y condiciones y la política de privacidad.',
];

export default function SummaryScreen({ navigation }: AppScreenProps<'Summary'>) {
    return (
        <FigmaScreen onBack={() => navigation.goBack()}>
            <PageTitle
                title="Resumen de configuración"
                subtitle="Revisá lo que se va a activar antes de continuar."
            />
            <SurfaceCard>
                {points.map(point => (
                    <Text key={point} style={styles.point}>
                        •  {point}
                    </Text>
                ))}
            </SurfaceCard>
            <ScreenFooter>
                <Button
                    label="Activar protección"
                    onPress={() => navigation.navigate('Activating')}
                />
            </ScreenFooter>
        </FigmaScreen>
    );
}

const styles = StyleSheet.create({
    point: {
        color: FIGMA_COLORS.text,
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 10,
    },
});