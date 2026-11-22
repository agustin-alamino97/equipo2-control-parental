import React, { useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LotbaBrandMark from '../components/LotbaBrandMark';
import { FIGMA_COLORS } from '../components';
import type { AppScreenProps } from '../navigation/types';

export default function SplashScreen({ navigation }: AppScreenProps<'Splash'>) {
    useEffect(() => {
        const timer = setTimeout(() => navigation.replace('Onboarding', { step: 1 }), 900);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar barStyle="light-content" />
            <View style={styles.body}>
                <LotbaBrandMark size={176} />
                <Text style={styles.brand}>BA Protege+</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: FIGMA_COLORS.primary,
        flex: 1,
    },
    body: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    brand: {
        color: FIGMA_COLORS.surface,
        fontSize: 26,
        fontWeight: '700',
        marginTop: 16,
    },
});