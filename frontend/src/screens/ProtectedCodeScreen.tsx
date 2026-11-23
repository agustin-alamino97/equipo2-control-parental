import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BellRing } from 'lucide-react-native';
import Button from '../components/Button';
import PinEntry from '../components/PinEntry';
import {
    FigmaScreen,
    PageTitle,
    ScreenFooter,
    FIGMA_COLORS,
} from '../components';
import type { AppScreenProps } from '../navigation/types';
import { getOrCreateDeviceUuid} from "../services/deviceIdentity";

export default function ProtectedCodeScreen({
                                                navigation,
                                            }: AppScreenProps<'ProtectedCode'>) {
    const [code, setCode] = useState('');
    const [hintVisible, setHintVisible] = useState(false);
    const ready = code.length === 5;

    const [deviceUuid, setDeviceUuid] = useState<string | null>(null);

    useEffect(() => {
        getOrCreateDeviceUuid().then(setDeviceUuid).catch(console.error);
    }, []);

    return (
        <FigmaScreen onBack={() => navigation.goBack()}>
            <PageTitle
                title="Modo Protegido"
                subtitle="Ingresá el código de acceso que te enviamos al dispositivo del responsable."
            />
            <View style={styles.hero}>
                <BellRing color={FIGMA_COLORS.warning} size={32} strokeWidth={1.8} />
            </View>
            <Text style={styles.notice}>¡Revisá tus notificaciones!</Text>
            <PinEntry
                accessibilityLabel="Código de acceso"
                masked
                value={code}
                onChangeText={setCode}
            />
            <TouchableOpacity
                accessibilityLabel="No recibí el código"
                accessibilityRole="button"
                onPress={() => setHintVisible(true)}
                style={styles.linkWrap}
            >
                <Text style={styles.link}>Si no recibiste el código, hacé click aquí.</Text>
            </TouchableOpacity>
            {hintVisible ? (
                <Text style={styles.hint}>
                    Revisá las notificaciones de tu dispositivo responsable.
                </Text>
            ) : null}
            <ScreenFooter>
                <Button
                    label="Confirmar"
                    disabled={!ready}
                    onPress={() => navigation.replace('ProtectedHome')}
                />
                <View style={styles.spacer} />
                <Button
                    label="Cancelar"
                    variant="outline"
                    onPress={() => navigation.goBack()}
                />
            </ScreenFooter>
        </FigmaScreen>
    );
}

const styles = StyleSheet.create({
    hero: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#FFF6E5',
        borderRadius: 36,
        height: 72,
        justifyContent: 'center',
        marginBottom: 14,
        width: 72,
    },
    notice: {
        color: FIGMA_COLORS.warning,
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 6,
        textAlign: 'center',
    },
    linkWrap: {
        alignSelf: 'center',
        paddingHorizontal: 8,
        paddingVertical: 10,
    },
    link: {
        color: FIGMA_COLORS.primary,
        fontSize: 13,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    hint: {
        color: FIGMA_COLORS.muted,
        fontSize: 12,
        textAlign: 'center',
    },
    spacer: { height: 10 },
});