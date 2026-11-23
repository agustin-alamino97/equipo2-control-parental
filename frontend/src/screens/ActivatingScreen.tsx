import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import {
    FigmaScreen,
    PageTitle,
    FIGMA_COLORS,
} from '../components/FigmaScreen';
import type { AppScreenProps } from '../navigation/types';

export default function ActivatingScreen({
                                             navigation,
                                         }: AppScreenProps<'Activating'>) {
    useEffect(() => {
        const timer = setTimeout(() => navigation.replace('ResponsibleMode'), 1800);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <FigmaScreen>
            <PageTitle
                title="Activando protección"
                subtitle="Estamos configurando todo. Esto puede tardar unos segundos."
            />
            <View style={styles.hero}>
                <ActivityIndicator color={FIGMA_COLORS.primary} size="large" />
            </View>
            <Text style={styles.note}>
                No cierres la aplicación mientras se completa la configuración.
            </Text>
        </FigmaScreen>
    );
}

const styles = StyleSheet.create({
    hero: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: FIGMA_COLORS.softPurple,
        borderRadius: 44,
        height: 88,
        justifyContent: 'center',
        marginVertical: 32,
        width: 88,
    },
    note: {
        color: FIGMA_COLORS.muted,
        fontSize: 13,
        lineHeight: 19,
        textAlign: 'center',
    },
});