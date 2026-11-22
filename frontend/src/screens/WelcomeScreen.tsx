import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar} from "react-native";
import Button from '../components/Button';
import LotbaBrandMark from '../components/LotbaBrandMark';
import { FIGMA_COLORS } from '../components';
import type { AppScreenProps } from '../navigation/types';

export default function WelcomeScreen({ navigation }: AppScreenProps<'Welcome'>) {
    return (
        <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.body}>
                <LotbaBrandMark size={176} />
                <Text style={styles.title}>Protección Digital{'\n'}Para Tu Familia</Text>
                <View style={styles.actions}>
                    <Button
                        label="Inicio de sesión"
                        onPress={() => navigation.navigate('Login')}
                    />
                    <View style={styles.spacer} />
                    <Button
                        label="Registrarse"
                        variant="outline"
                        onPress={() => navigation.navigate('Register')}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: FIGMA_COLORS.background,
        flex: 1,
    },
    body: {
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    title: {
        color: FIGMA_COLORS.text,
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 32,
        marginTop: 12,
        textAlign: 'center',
    },
    actions: {
        marginTop: 'auto',
        paddingBottom: 32,
        width: '100%',
    },
    spacer: {
        height: 12,
    },
});