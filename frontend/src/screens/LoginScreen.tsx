import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import Button from '../components/Button';
import CheckOption from '../components/CheckOption';
import TextField from '../components/TextField';
import {
    FigmaScreen,
    PageTitle,
    ScreenFooter,
    FIGMA_COLORS,
} from '../components';
import { api } from '../services/api';
import type { AppScreenProps } from '../navigation/types';

export default function LoginScreen({ navigation }: AppScreenProps<'Login'>) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);

    const canContinue = email.includes('@') && password.length > 0;

    const handleLogin = async () => {
        if (!canContinue) return;
        try {
            setLoading(true);
            await api.login(email.trim(), password);
            // Navegamos a UsageMode después de un login exitoso
            navigation.replace('UsageMode');
        } catch (error: any) {
            Alert.alert('Error de inicio de sesión', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FigmaScreen onBack={() => navigation.goBack()}>
            <PageTitle
                title="Iniciar sesión"
                subtitle="Ingresá con tu cuenta de responsable."
            />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <TextField
                    label="Correo electrónico"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextField
                    label="Contraseña"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <CheckOption
                    label="Recordar contraseña"
                    value={remember}
                    onChange={setRemember}
                />
                <TouchableOpacity
                    accessibilityLabel="Olvidé mi contraseña"
                    accessibilityRole="button"
                    onPress={() => navigation.navigate('Recover')}
                    style={styles.linkWrap}
                >
                    <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
            <ScreenFooter>
                <Button
                    label={loading ? 'Ingresando...' : 'Iniciar sesión'}
                    disabled={!canContinue || loading}
                    onPress={handleLogin}
                />
                <View style={styles.spacer} />
                <Button
                    label="Cancelar"
                    variant="outline"
                    onPress={() => navigation.navigate('Welcome')}
                />
            </ScreenFooter>
        </FigmaScreen>
    );
}

const styles = StyleSheet.create({
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
    spacer: { height: 10 },
});