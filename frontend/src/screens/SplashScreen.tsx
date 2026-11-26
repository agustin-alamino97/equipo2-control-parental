import React, { useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FIGMA_COLORS } from '../components';
import type { AppScreenProps } from '../navigation/types';

export default function SplashScreen({ navigation }: AppScreenProps<'Splash'>) {
    useEffect(() => {
        // ⏱️ CAMBIO 1: Aumentamos el tiempo de 900 a 3000 (3 segundos)
        const timer = setTimeout(() => navigation.replace('Onboarding', { step: 1 }), 3000);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar barStyle="light-content" />
            <View style={styles.body}>
                
                {/* 🖼️ CAMBIO 2: Reemplazamos el componente viejo por tu nueva imagen */}
                {/* Asegúrate de poner el nombre correcto de tu archivo en la carpeta assets */}
                <Image 
                    source={require('../../assets/LogoBAProtege+ - Fdo Blanco.png')} 
                    style={{ width: 176, height: 176, resizeMode: 'contain' }} 
                />
                <Image 
                    source={require('../../assets/logo blanco lotba_Mesa de trabajo 1.png')} 
                    style={{ width: 176, height: 176, resizeMode: 'contain' }} 
                />

                {/* ✏️ CAMBIO 3: Si quieres cambiar el texto, edítalo aquí */}
                {/* <Text style={styles.brand}>Tu Nuevo Texto</Text> */}

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: FIGMA_COLORS.primary, // Mantiene el fondo azul
        flex: 1,
    },
    body: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    brand: {
        color: FIGMA_COLORS.surface, // Texto blanco
        fontSize: 26,
        fontWeight: '700',
        marginTop: 16,
    },
});