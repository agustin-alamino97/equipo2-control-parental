import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Shield } from 'lucide-react-native';
import Button from '../components/Button';
import {
    FigmaScreen,
    PageTitle,
    ScreenFooter,
    FIGMA_COLORS,
} from '../components';
import type { AppScreenProps } from '../navigation/types';

export default function ProtectedHomeScreen({
                                                navigation,
                                            }: AppScreenProps<'ProtectedHome'>) {
    const [unlocked, setUnlocked] = useState(false);

    return (
        <FigmaScreen>
            <PageTitle title="Modo Protegido" />
            <View style={styles.card}>
                <Shield color={FIGMA_COLORS.surface} size={40} />
                <Text style={styles.title}>Dispositivo protegido</Text>
                <Text style={styles.caption}>
                    La protección está activa en este dispositivo.
                </Text>
            </View>
            <ScreenFooter>
                <Button
                    label={unlocked ? 'Protección activa' : 'Ver estado de protección'}
                    onPress={() => setUnlocked(true)}
                />
                <View style={styles.spacer} />
                <Button
                    label="Cancelar"
                    variant="outline"
                    onPress={() => navigation.popToTop()}
                />
            </ScreenFooter>
        </FigmaScreen>
    );
}

const styles = StyleSheet.create({
    card: {
        alignItems: 'center',
        backgroundColor: FIGMA_COLORS.primary,
        borderRadius: 20,
        marginBottom: 20,
        padding: 28,
    },
    title: {
        color: FIGMA_COLORS.surface,
        fontSize: 18,
        fontWeight: '700',
        marginTop: 12,
    },
    caption: {
        color: FIGMA_COLORS.surface,
        fontSize: 13,
        lineHeight: 19,
        marginTop: 6,
        opacity: 0.9,
        textAlign: 'center',
    },
    spacer: { height: 10 },
});