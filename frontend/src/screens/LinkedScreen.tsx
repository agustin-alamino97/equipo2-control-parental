import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import Button from '../components/Button';
import {
    FigmaScreen,
    PageTitle,
    ScreenFooter,
    SurfaceCard,
    FIGMA_COLORS,
} from '../components/FigmaScreen';
import type { AppScreenProps } from '../navigation/types';

export default function LinkedScreen({ navigation }: AppScreenProps<'Linked'>) {
    return (
        <FigmaScreen>
            <View style={styles.hero}>
                <CheckCircle2 color={FIGMA_COLORS.positive} size={60} strokeWidth={1.8} />
            </View>
            <PageTitle
                title="¡Dispositivo vinculado!"
                subtitle="El dispositivo ya está conectado a tu cuenta."
            />
            <SurfaceCard>
                <Text style={styles.body}>
                    Ahora vamos a configurar la protección para que BA Protege+ funcione
                    correctamente en el dispositivo del menor.
                </Text>
            </SurfaceCard>
            <ScreenFooter>
                <Button
                    label="Configurar protección"
                    onPress={() => navigation.navigate('ConfigProtection')}
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
        borderRadius: 50,
        height: 100,
        justifyContent: 'center',
        marginBottom: 20,
        width: 100,
    },
    body: {
        color: FIGMA_COLORS.text,
        fontSize: 14,
        lineHeight: 21,
    },
});