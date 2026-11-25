import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View, Alert, Linking, TouchableOpacity, Text } from 'react-native';
import Button from '../components/Button';
import CheckOption from '../components/CheckOption';
import TextField from '../components/TextField';
import {
    FigmaScreen,
    PageTitle,
    ScreenFooter,
} from '../components';
import { api } from '../services/api';
import type { AppScreenProps } from '../navigation/types';

export default function RegisterScreen({ navigation }: AppScreenProps<'Register'>) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);

    const canContinue =
        name.trim().length > 0 &&
        surname.trim().length > 0 &&
        email.includes('@') &&
        password.length >= 8 &&
        accepted;

    const submit = async () => {
        if (!canContinue) return;
        try {
            setLoading(true);
            await api.register(name, surname, email, password);

            // Si el registro es exitoso, vamos directo a UsageMode (Omitimos ConfirmAccount)
            navigation.replace('UsageMode');
        } catch (error: any) {
            Alert.alert('Error de registro', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Función para abrir los términos y condiciones
    const openTerms = () => {
        // Puedes usar Linking para abrir una URL o navegar a una pantalla interna
        Linking.openURL('https://tu-sitio-web.com/terminos-y-condiciones');
    };

    return (
        <FigmaScreen onBack={() => navigation.goBack()}>
            <PageTitle
                title="Creá tu cuenta"
                subtitle="Completá tus datos para empezar a proteger a tu familia."
            />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <TextField label="Nombre" value={name} onChangeText={setName} />
                <TextField label="Apellido" value={surname} onChangeText={setSurname} />
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
                
                {/* Checkbox con enlace a términos */}
                <View style={styles.checkboxContainer}>
                    <CheckOption
                        label="" // Dejamos el label vacío en el componente original
                        value={accepted}
                        onChange={setAccepted}
                    />
                    <TouchableOpacity onPress={() => setAccepted(!accepted)} style={styles.textContainer}>
                        <Text style={styles.checkboxText}>
                            Acepto los{' '}
                            <Text style={styles.link} onPress={openTerms}>
                                términos y condiciones
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            
            <ScreenFooter>
                <Button
                    label={loading ? 'Creando cuenta...' : 'Confirmar'}
                    disabled={!canContinue || loading}
                    onPress={submit}
                />
                <View style={styles.spacer} />
                <Button
                    label="Cancelar"
                    variant="outline"
                    onPress={() => navigation.goBack()}
                />
            </ScreenFooter>
        </FigmaScreen>
    );
}

const styles = StyleSheet.create({
    spacer: { height: 10 },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    textContainer: {
        flex: 1,
        marginLeft: 8,
    },
    checkboxText: {
        fontSize: 14,
        color: '#333', // Ajusta el color según tu tema
    },
    link: {
        color: '#007AFF', // Color azul de enlace
        textDecorationLine: 'underline',
    },
});