import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import Button from '../components/Button';
import {
    FigmaScreen,
    ScreenFooter,
    FIGMA_COLORS,
} from '../components';
import type { AppScreenProps } from '../navigation/types';

export default function InterruptedScreen({
                                              navigation,
                                          }: AppScreenProps<'Interrupted'>) {
    return (
        <FigmaScreen>
            <View style={styles.hero}>
                <CheckCircle2 color={FIGMA_COLORS.positive} size={66} strokeWidth={1.8} />
            </View>
            <Text style={styles.title}>
                Ahora podés gestionar el bloqueo de sitios de apuestas ilegales en el
                dispositivo del menor.
            </Text>
            <Text style={styles.body}>
                BA Protege+ se mantendrá en el dispositivo del adulto y bloqueará los
                sitios de apuestas y juegos ilegales en el dispositivo del menor.
            </Text>
            <ScreenFooter>
                <Button
                    label="Terminar configuración"
                    onPress={() => navigation.replace('ProtectedHome')}
                />
            </ScreenFooter>
        </FigmaScreen>
    );
}

const styles = StyleSheet.create({
    hero: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#E8F7EF',
        borderRadius: 48,
        height: 96,
        justifyContent: 'center',
        marginBottom: 24,
        marginTop: 16,
        width: 96,
    },
    title: {
        color: FIGMA_COLORS.text,
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 25,
        marginBottom: 14,
        textAlign: 'center',
    },
    body: {
        color: FIGMA_COLORS.muted,
        fontSize: 14,
        lineHeight: 21,
        marginBottom: 10,
        textAlign: 'center',
    },
});