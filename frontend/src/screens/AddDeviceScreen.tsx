import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Smartphone } from 'lucide-react-native';
import Button from '../components/Button';
import {
    FigmaScreen,
    PageTitle,
    ScreenFooter,
    SurfaceCard,
    FIGMA_COLORS,
} from '../components/FigmaScreen';
import type { AppScreenProps } from '../navigation/types';

export default function AddDeviceScreen({ navigation }: AppScreenProps<'AddDevice'>) {
    return (
        <FigmaScreen onBack={() => navigation.goBack()}>
            <PageTitle
                title="Agregá un dispositivo"
                subtitle="Vinculá el dispositivo que querés proteger."
            />
            <View style={styles.hero}>
                <Smartphone color={FIGMA_COLORS.primary} size={44} strokeWidth={1.7} />
            </View>
            <SurfaceCard>
                <Text style={styles.body}>
                    Tené el dispositivo cerca. Vas a necesitar instalar BA Protege+ y seguir los
                    pasos de configuración para vincularlo.
                </Text>
            </SurfaceCard>
            <ScreenFooter>
                <Button
                    label="Agregar dispositivo"
                    onPress={() => navigation.navigate('ConfigureAccess')}
                />
            </ScreenFooter>
        </FigmaScreen>
    );
}

const styles = StyleSheet.create({
    hero: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: FIGMA_COLORS.softPurple,
        borderRadius: 40,
        height: 80,
        justifyContent: 'center',
        marginBottom: 20,
        width: 80,
    },
    body: {
        color: FIGMA_COLORS.text,
        fontSize: 14,
        lineHeight: 21,
    },
});