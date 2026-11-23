import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { Laptop, Smartphone, Tablet } from 'lucide-react-native';
import Button from '../components/Button';
import {
    FigmaScreen,
    PageTitle,
    ScreenFooter,
    SurfaceCard,
    FIGMA_COLORS,
    figmaStyles,
} from '../components';
import { api, type Device } from '../services/api';
import type { AppScreenProps } from '../navigation/types';

const iconFor = (platform?: string) => {
    switch (platform) {
        case 'tablet':
            return <Tablet color={FIGMA_COLORS.primary} size={20} />;
        case 'laptop':
            return <Laptop color={FIGMA_COLORS.primary} size={20} />;
        default:
            return <Smartphone color={FIGMA_COLORS.primary} size={20} />;
    }
};

const statusLabel = (device: Device): { text: string; color: string } => {
    if (device.protection_status) {
        return { text: 'Vinculado', color: FIGMA_COLORS.positive };
    }
    return { text: 'Pendiente de configurar', color: FIGMA_COLORS.warning };
};

export default function DevicesScreen({ navigation }: AppScreenProps<'Devices'>) {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDevices();
    }, []);

    const loadDevices = async () => {
        try {
            setLoading(true);
            const data = await api.getDevices();
            setDevices(data);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudieron cargar los dispositivos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FigmaScreen onBack={() => navigation.goBack()}>
            <PageTitle
                title="Dispositivos vinculados"
                subtitle="Estos son los dispositivos que estás protegiendo."
            />
            {loading ? (
                <ActivityIndicator color={FIGMA_COLORS.primary} style={{ marginVertical: 40 }} />
            ) : devices.length === 0 ? (
                <SurfaceCard>
                    <Text style={styles.empty}>Todavía no vinculaste ningún dispositivo.</Text>
                </SurfaceCard>
            ) : (
                <SurfaceCard style={styles.list}>
                    {devices.map((device, index) => {
                        const status = statusLabel(device);
                        return (
                            <View
                                key={device.id}
                                style={[styles.row, index > 0 && styles.divided]}
                            >
                                <View style={styles.iconWrap}>{iconFor(device.platform)}</View>
                                <Text style={[figmaStyles.rowTitle, styles.name]}>{device.name}</Text>
                                <Text style={[styles.status, { color: status.color }]}>
                                    {status.text}
                                </Text>
                            </View>
                        );
                    })}
                </SurfaceCard>
            )}
            <ScreenFooter>
                <Button
                    label="Vincular nuevo dispositivo"
                    onPress={() => navigation.navigate('LinkNewDeviceGuide')}
                />
            </ScreenFooter>
        </FigmaScreen>
    );
}

const styles = StyleSheet.create({
    list: { paddingHorizontal: 14, paddingVertical: 0 },
    row: { alignItems: 'center', flexDirection: 'row', minHeight: 60 },
    divided: {
        borderTopColor: FIGMA_COLORS.border,
        borderTopWidth: StyleSheet.hairlineWidth,
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
    name: { flex: 1 },
    status: { fontSize: 12, fontWeight: '600' },
    empty: { color: FIGMA_COLORS.muted, fontSize: 14, textAlign: 'center' },
});