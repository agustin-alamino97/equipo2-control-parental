import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ListChecks, LockKeyhole, RefreshCw } from 'lucide-react-native';
import ActionTile from '../components/ActionTile';
import BottomTabs from '../components/BottomTabs';
import { FigmaScreen, FIGMA_COLORS } from '../components';
import type { AppScreenProps } from '../navigation/types';

export default function ResponsibleModeScreen({
                                                  navigation,
                                              }: AppScreenProps<'ResponsibleMode'>) {
    return (
        <FigmaScreen
            footer={
                <BottomTabs
                    active="home"
                    onHome={() => navigation.replace('ResponsibleMode')}
                    onHistory={() => navigation.navigate('History')}
                    onProfile={() => navigation.navigate('Profile')}
                />
            }
        >
            <Text style={styles.title}>Modo Responsable</Text>
            <ActionTile
                icon={<LockKeyhole color={FIGMA_COLORS.surface} size={22} />}
                title="Bloquear Sitios"
                subtitle="Bloqueá sitios incluidos en la lista de bloqueo."
                tone="primary"
                variant="card"
                onPress={() => navigation.navigate('BlockedSites')}
            />
            <ActionTile
                icon={<RefreshCw color={FIGMA_COLORS.surface} size={22} />}
                title="Vincular Dispositivos"
                subtitle="Vinculá uno o más dispositivos para protegerlos."
                tone="positive"
                variant="card"
                onPress={() => navigation.navigate('Devices')}
            />
            <ActionTile
                icon={<ListChecks color={FIGMA_COLORS.surface} size={22} />}
                title="Configuración"
                subtitle="Configurá el control parental del modo responsable."
                tone="primary"
                variant="card"
                onPress={() => navigation.navigate('Settings')}
            />
        </FigmaScreen>
    );
}

const styles = StyleSheet.create({
    title: {
        color: FIGMA_COLORS.text,
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
    },
});