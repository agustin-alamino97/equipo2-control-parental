import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyRound } from 'lucide-react-native';
import Button from '../components/Button';
import {
    FigmaScreen,
    PageTitle,
    ScreenFooter,
    SurfaceCard,
    FIGMA_COLORS,
} from '../components';
import type { AppScreenProps } from '../navigation/types';

export default function ConfigureAccessScreen({
                                                  navigation,
                                              }: AppScreenProps<'ConfigureAccess'>) {
    return (
        <FigmaScreen onBack={() => navigation.goBack()}>
            <PageTitle
                title="Configurá el acceso"
                subtitle="Vas a crear un código de acceso para administrar la protección."
            />
            <View style={styles.hero}>
                <KeyRound color={FIGMA_COLORS.primary} size={40} strokeWidth={1.8} />
            </View>
            <SurfaceCard>
                <Text style={styles.body}>
                    Este código te permitirá desbloquear el dispositivo del menor si es necesario y
                    administrar la configuración de la protección.
                </Text>
                <Text style={styles.warning}>
                    No compartas este código con otras personas.
                </Text>
            </SurfaceCard>
            <ScreenFooter>
                <Button
                    label="Continuar"
                    onPress={() => navigation.navigate('LinkDevice')}
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
        marginBottom: 12,
    },
    warning: {
        color: FIGMA_COLORS.warning,
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 19,
    },
});