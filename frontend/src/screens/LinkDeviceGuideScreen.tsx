import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Bluetooth, Check, Smartphone } from 'lucide-react-native';
import Button from '../components/Button';
import {
    FigmaScreen,
    PageTitle,
    ScreenFooter,
    SurfaceCard,
    FIGMA_COLORS,
    figmaStyles,
} from '../components';

const steps = [
    'En el dispositivo que querés proteger, instalá BA Protege+.',
    'Abrí la aplicación y elegí la opción “Vincular dispositivo”.',
    'Seguí los pasos para activar la protección y completar el vínculo.',
];

type LinkDeviceGuideScreenProps = {
    onBack: () => void;
    onContinue: () => void;
    title?: string;
    actionLabel?: string;
};

export default function LinkDeviceGuideScreen({
                                                  onBack,
                                                  onContinue,
                                                  title = 'Vinculá un nuevo dispositivo',
                                                  actionLabel = 'Continuar',
                                              }: LinkDeviceGuideScreenProps) {
    return (
        <FigmaScreen onBack={onBack}>
            <PageTitle
                title={title}
                subtitle="Tené el dispositivo protegido cerca para completar la configuración."
            />
            <View style={styles.illustration}>
                <View style={styles.deviceCircle}>
                    <Smartphone color={FIGMA_COLORS.primary} size={48} strokeWidth={1.7} />
                </View>
                <View style={styles.connection}>
                    <Bluetooth color={FIGMA_COLORS.accent} size={24} />
                </View>
                <View style={styles.checkCircle}>
                    <Check color={FIGMA_COLORS.surface} size={20} strokeWidth={3} />
                </View>
            </View>
            <SurfaceCard>
                {steps.map((step, index) => (
                    <View key={step} style={styles.stepRow}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={[figmaStyles.body, styles.stepText]}>{step}</Text>
                    </View>
                ))}
            </SurfaceCard>
            <Text style={styles.notice}>
                Asegurate de tener conexión a internet en ambos dispositivos.
            </Text>
            <ScreenFooter>
                <Button label={actionLabel} onPress={onContinue} />
            </ScreenFooter>
        </FigmaScreen>
    );
}

const styles = StyleSheet.create({
    illustration: {
        alignItems: 'center',
        alignSelf: 'center',
        height: 150,
        justifyContent: 'center',
        marginBottom: 16,
        position: 'relative',
        width: 190,
    },
    deviceCircle: {
        alignItems: 'center',
        backgroundColor: FIGMA_COLORS.softPurple,
        borderRadius: 44,
        height: 88,
        justifyContent: 'center',
        width: 88,
    },
    connection: {
        alignItems: 'center',
        backgroundColor: FIGMA_COLORS.surface,
        borderRadius: 20,
        elevation: 2,
        height: 40,
        justifyContent: 'center',
        position: 'absolute',
        right: 24,
        top: 22,
        width: 40,
    },
    checkCircle: {
        alignItems: 'center',
        backgroundColor: FIGMA_COLORS.positive,
        borderColor: FIGMA_COLORS.surface,
        borderRadius: 15,
        borderWidth: 3,
        bottom: 20,
        height: 30,
        justifyContent: 'center',
        position: 'absolute',
        right: 44,
        width: 30,
    },
    stepRow: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginBottom: 15,
    },
    stepNumber: {
        alignItems: 'center',
        backgroundColor: FIGMA_COLORS.softPurple,
        borderRadius: 13,
        height: 26,
        justifyContent: 'center',
        marginRight: 12,
        width: 26,
    },
    stepNumberText: {
        color: FIGMA_COLORS.primary,
        fontSize: 13,
        fontWeight: '700',
    },
    stepText: {
        flex: 1,
    },
    notice: {
        color: FIGMA_COLORS.muted,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 14,
        textAlign: 'center',
    },
});