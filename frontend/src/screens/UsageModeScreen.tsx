import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { LockKeyhole, Shield } from 'lucide-react-native';
import ActionTile from '../components/ActionTile';
import BottomTabs from '../components/BottomTabs';
import { FigmaScreen, FIGMA_COLORS } from '../components';
import type { AppScreenProps } from '../navigation/types';

export default function UsageModeScreen({ navigation }: AppScreenProps<'UsageMode'>) {
    return (
        <FigmaScreen
            footer={
                <BottomTabs
                    active="home"
                    onHome={() => navigation.replace('UsageMode')}
                    onHistory={() => navigation.navigate('History')}
                    onProfile={() => navigation.navigate('Profile')}
                />
            }
        >
            <Text style={styles.title}>Modo de uso</Text>
            <Text style={styles.description}>
                Elegí cómo querés que funcione la protección para tu familia.
            </Text>
            <ActionTile
                icon={<Shield color={FIGMA_COLORS.surface} size={22} />}
                title="Modo Responsable"
                subtitle="Gestioná la protección de tus hijos."
                tone="primary"
                onPress={() => navigation.navigate('Activate')}
            />
            <ActionTile
                icon={<LockKeyhole color={FIGMA_COLORS.surface} size={22} />}
                title="Modo Protegido"
                subtitle="Ingresá el código de acceso de tu responsable."
                tone="positive"
                onPress={() => navigation.navigate('ProtectedCode')}
            />
        </FigmaScreen>
    );
}

const styles = StyleSheet.create({
    title: {
        color: FIGMA_COLORS.text,
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
    },
    description: {
        color: FIGMA_COLORS.muted,
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 20,
    },
});