import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
    Accessibility,
    BatteryCharging,
    Bell,
    Pin,
    Power,
    ShieldCheck,
} from 'lucide-react-native';
import Button from '../components/Button';
import {
    FigmaScreen,
    PageTitle,
    ScreenFooter,
    SurfaceCard,
    FIGMA_COLORS,
} from '../components/FigmaScreen';
import type { AppScreenProps } from '../navigation/types';

const permissions = [
    { icon: Accessibility, label: 'Accesibilidad' },
    { icon: Pin, label: 'Fijar aplicación' },
    { icon: Power, label: 'Inicio automático' },
    { icon: ShieldCheck, label: 'Protección contra desinstalación' },
    { icon: Bell, label: 'Notificaciones' },
    { icon: BatteryCharging, label: 'Actividad en segundo plano' },
];

export default function ConfigProtectionScreen({
                                                   navigation,
                                               }: AppScreenProps<'ConfigProtection'>) {
    return (
        <FigmaScreen onBack={() => navigation.goBack()}>
            <PageTitle
                title="Configurá la protección"
                subtitle="Vas a habilitar varios permisos en el dispositivo del menor."
            />
            <SurfaceCard style={styles.list}>
                {permissions.map(({ icon: Icon, label }) => (
                    <View key={label} style={styles.row}>
                        <View style={styles.iconWrap}>
                            <Icon color={FIGMA_COLORS.primary} size={20} />
                        </View>
                        <Text style={styles.label}>{label}</Text>
                    </View>
                ))}
            </SurfaceCard>
            <ScreenFooter>
                <Button
                    label="Comenzar configuración"
                    onPress={() => navigation.navigate('Summary')}
                />
            </ScreenFooter>
        </FigmaScreen>
    );
}

const styles = StyleSheet.create({
    list: {
        paddingVertical: 4,
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        minHeight: 56,
    },
    iconWrap: {
        alignItems: 'center',
        backgroundColor: FIGMA_COLORS.softPurple,
        borderRadius: 10,
        height: 36,
        justifyContent: 'center',
        marginRight: 12,
        width: 36,
    },
    label: {
        color: FIGMA_COLORS.text,
        flex: 1,
        fontSize: 14,
    },
});