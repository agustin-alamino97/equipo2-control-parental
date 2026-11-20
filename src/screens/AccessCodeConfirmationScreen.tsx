import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyRound } from 'lucide-react-native';
import {
  FigmaScreen,
  FIGMA_COLORS,
  PageTitle,
  PrimaryAction,
  ScreenFooter,
} from '../components/FigmaScreen';
import type { AppScreenProps } from '../navigation/types';

export default function AccessCodeConfirmationScreen({
  navigation,
  route,
}: AppScreenProps<'AccessCodeConfirmation'>) {
  const [confirmation, setConfirmation] = useState('');
  const mismatch =
    confirmation.length === 4 && confirmation !== route.params.accessCode;

  return (
    <FigmaScreen onBack={() => navigation.goBack()}>
      <PageTitle
        title="Confirmá tu código"
        subtitle="Volvé a ingresar el código para asegurarte de que sea correcto."
      />
      <View style={styles.hero}>
        <KeyRound color={FIGMA_COLORS.primary} size={34} />
      </View>
      <TextInput
        accessibilityLabel="Confirmar código de acceso"
        autoComplete="off"
        keyboardType="number-pad"
        maxLength={4}
        onChangeText={value =>
          setConfirmation(value.replace(/[^0-9]/g, '').slice(0, 4))
        }
        placeholder="• • • •"
        placeholderTextColor={FIGMA_COLORS.muted}
        secureTextEntry
        style={[styles.codeInput, mismatch && styles.codeInputError]}
        textContentType="none"
        value={confirmation}
      />
      {mismatch ? (
        <Text accessibilityRole="alert" style={styles.error}>
          Los códigos no coinciden. Volvé a intentarlo.
        </Text>
      ) : (
        <Text style={styles.hint}>Ingresá nuevamente los 4 dígitos.</Text>
      )}
      <ScreenFooter>
        <PrimaryAction
          disabled={confirmation.length !== 4 || mismatch}
          label="Confirmar código"
          onPress={() => navigation.navigate('ResponsibleMode')}
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
    borderRadius: 34,
    height: 68,
    justifyContent: 'center',
    marginBottom: 22,
    width: 68,
  },
  codeInput: {
    alignSelf: 'center',
    backgroundColor: FIGMA_COLORS.surface,
    borderColor: FIGMA_COLORS.border,
    borderRadius: 14,
    borderWidth: 1,
    color: FIGMA_COLORS.primary,
    fontSize: 24,
    fontWeight: '700',
    height: 62,
    letterSpacing: 12,
    maxWidth: 220,
    textAlign: 'center',
    width: '100%',
  },
  codeInputError: {
    borderColor: FIGMA_COLORS.danger,
  },
  error: {
    color: FIGMA_COLORS.danger,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
    textAlign: 'center',
  },
  hint: {
    color: FIGMA_COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
    textAlign: 'center',
  },
});
