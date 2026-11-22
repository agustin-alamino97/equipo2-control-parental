import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Mail } from 'lucide-react-native';
import Button from '../components/Button';
import {
    FigmaScreen,
    PageTitle,
    ScreenFooter,
    FIGMA_COLORS,
} from '../components/FigmaScreen';
import type { AppScreenProps } from '../navigation/types';

export default function RecoverScreen({ navigation }: AppScreenProps<'Recover'>) {
    return (
        <FigmaScreen onBack={() => navigation.goBack()}>
            <PageTitle
                title="Recuperar contraseña"
                subtitle="Te enviamos un mail con instrucciones para recuperar tu contraseña."
            />
            <View style={styles.hero}>
                <Mail color={FIGMA_COLORS.primary} size={32} strokeWidth={1.8} />
            </View>
            <Text style={styles.notice}>
                Revisá tu bandeja de entrada y también la carpeta de spam o correo no deseado.
            </Text>
            <TouchableOpacity
                accessibilityLabel="Recordé mi contraseña"
                accessibilityRole="button"
                onPress={() => navigation.navigate('Login')}
                style={styles.linkWrap}
            >
                <Text style={styles.link}>¿Recordaste tu contraseña?</Text>
            </TouchableOpacity>
            <ScreenFooter>
                <Button label="Volver a iniciar sesión" onPress={() => navigation.navigate('Login')} />
            </ScreenFooter>
        </FigmaScreen>
    );
}

const styles = StyleSheet.create({
    hero: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: FIGMA_COLORS.softPurple,
        borderRadius: 36,
        height: 72,
        justifyContent: 'center',
        marginBottom: 18,
        width: 72,
    },
    notice: {
        color: FIGMA_COLORS.text,
        fontSize: 14,
        lineHeight: 21,
        marginBottom: 8,
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
});