import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import Button from '../components/Button';
import {
    FigmaScreen,
    PageTitle,
    ScreenFooter,
    SurfaceCard,
    FIGMA_COLORS,
    figmaStyles,
} from '../components/FigmaScreen';
import type { AppScreenProps } from '../navigation/types';

export default function ActivateScreen({ navigation }: AppScreenProps<'Activate'>) {
    return (
        <FigmaScreen onBack={() => navigation.goBack()}>
            <PageTitle
                title="Activá el modo responsable"
                subtitle="Vamos a configurar la protección de los dispositivos de tu familia paso a paso."
            />
            <View style={styles.hero}>
                <ShieldCheck color={FIGMA_COLORS.primary} size={40} strokeWidth={1.8} />
            </View>
            <SurfaceCard>
                <Text style={figmaStyles.sectionTitle}>¿Qué vamos a configurar?</Text>
                <Text style={styles.item}>•  Vincular un dispositivo</Text>
                <Text style={styles.item}>•  Crear un código de acceso</Text>
                <Text style={styles.item}>•  Configurar la protección</Text>
                <Text style={styles.item}>•  Activar el bloqueo de sitios</Text>
            </SurfaceCard>
            <ScreenFooter>
                <Button
                    label="Comenzar"
                    onPress={() => navigation.navigate('AddDevice')}
                />
            </ScreenFooter>
        </FigmaScreen>
    );
}

const styles = StyleSheet.create({
    hero: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: FIGMA_COLORS.softPurple,
        borderRadius: 40,
        height: 80,
        justifyContent: 'center',
        marginBottom: 20,
        width: 80,
    },
    item: {
        color: FIGMA_COLORS.text,
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 6,
    },
});