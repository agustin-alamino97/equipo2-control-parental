import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { KeyRound, MailCheck } from 'lucide-react-native';
import { Mail } from 'lucide-react-native';
import Button from '../components/Button';
import {
    FigmaScreen,
    PageTitle,
    ScreenFooter,
    FIGMA_COLORS,
} from '../components/FigmaScreen';
import type { AppScreenProps } from '../navigation/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RecoverScreen({ navigation }: AppScreenProps<'Recover'>) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const handleSend = () => {
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setError('Ingresá tu email.');
            return;
        }

        if (!EMAIL_REGEX.test(trimmedEmail)) {
            setError('Ingresá un email válido.');
            return;
        }

        setError(null);
        setSent(true);

        // TODO: Llamar a tu API para enviar el código de validación a `trimmedEmail`
        // y, si corresponde, navegar a la pantalla de verificación:
        // navigation.navigate('VerifyCode', { email: trimmedEmail });
    };

    return (
        <FigmaScreen onBack={() => navigation.goBack()}>
            <PageTitle
                title="Recuperar contraseña"
                subtitle={
                    sent
                        ? 'Te enviamos un mail con el código de validación para recuperar tu contraseña.'
                        : 'Ingresá tu email y te enviamos un código de validación.'
                }
            />

            {/* <View style={styles.hero}>
                <Mail color={FIGMA_COLORS.primary} size={32} strokeWidth={1.8} />
            </View> */}

            <View style={styles.hero}>
                {sent ? (
                    <MailCheck color={FIGMA_COLORS.primary} size={50} strokeWidth={1.8} />
                ) : (
                    <KeyRound color={FIGMA_COLORS.primary} size={50} strokeWidth={1.8} />
                )}
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    accessibilityLabel="Email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    keyboardType="email-address"
                    onChangeText={(text) => {
                        setEmail(text);
                        if (error) setError(null);
                        if (sent) setSent(false);
                    }}
                    onSubmitEditing={handleSend}
                    placeholder="nombre@ejemplo.com"
                    placeholderTextColor="#9CA3AF"
                    returnKeyType="send"
                    style={[styles.input, error ? styles.inputError : null]}
                    textContentType="emailAddress"
                    value={email}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.sendButtonWrap}>
                    <Button
                        label={sent ? 'Reenviar código' : 'Enviar código'}
                        onPress={handleSend}
                    />
                </View>
            </View>

            {sent ? (
                <Text style={styles.notice}>
                    Revisá tu bandeja de entrada y también la carpeta de spam o correo no deseado.
                </Text>
            ) : null}

            <TouchableOpacity
                accessibilityLabel="Recordé mi contraseña"
                accessibilityRole="button"
                onPress={() => navigation.navigate('Login')}
                style={styles.linkWrap}
            >
                <Text style={styles.link}>¿Recordaste tu contraseña?</Text>
            </TouchableOpacity>

            <ScreenFooter>
                <Button
                    label="Volver a iniciar sesión"
                    onPress={() => navigation.navigate('Login')}
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
        borderRadius: 36,
        height: 72,
        justifyContent: 'center',
        marginBottom: 18,
        width: 72,
    },
    form: {
        marginBottom: 16,
    },
    label: {
        color: FIGMA_COLORS.text,
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderColor: '#D1D5DB',
        borderRadius: 10,
        borderWidth: 1,
        color: FIGMA_COLORS.text,
        fontSize: 15,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    inputError: {
        borderColor: '#DC2626',
    },
    errorText: {
        color: '#DC2626',
        fontSize: 12,
        marginTop: 6,
    },
    sendButtonWrap: {
        marginTop: 14,
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