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

export default function AccessCodeSetupScreen({
  navigation,
}: AppScreenProps<'AccessCodeSetup'>) {
  const [accessCode, setAccessCode] = useState('');
  const isComplete = accessCode.length === 4;

  return (
    <FigmaScreen onBack={() => navigation.goBack()}>
      <PageTitle
        title="Creá un código de acceso"
        subtitle="Este código te permitirá administrar la protección."
      />
      <View style={styles.hero}>
        <KeyRound color={FIGMA_COLORS.primary} size={34} />
      </View>
      <Text style={styles.instruction}>Elegí un código numérico de 4 dígitos.</Text>
      <TextInput
        accessibilityLabel="Código de acceso de cuatro dígitos"
        autoComplete="off"
        keyboardType="number-pad"
        maxLength={4}
        onChangeText={value => setAccessCode(value.replace(/[^0-9]/g, '').slice(0, 4))}
        placeholder="• • • •"
        placeholderTextColor={FIGMA_COLORS.muted}
        secureTextEntry
        style={styles.codeInput}
        textContentType="none"
        value={accessCode}
      />
      <Text style={styles.hint}>No compartas este código con otras personas.</Text>
      <ScreenFooter>
        <PrimaryAction
          disabled={!isComplete}
          label="Continuar"
          onPress={() =>
            navigation.navigate('AccessCodeConfirmation', { accessCode })
          }
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
  instruction: {
    color: FIGMA_COLORS.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 17,
    textAlign: 'center',
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
  hint: {
    color: FIGMA_COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
    textAlign: 'center',
  },
});
