import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyRound } from 'lucide-react-native';
import Button from '../components/Button';
import PinEntry from '../components/PinEntry';
import {
  FigmaScreen,
  PageTitle,
  ScreenFooter,
  FIGMA_COLORS,
} from '../components';
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
        <PinEntry
            accessibilityLabel="Código de acceso de cuatro dígitos"
            length={4}
            masked
            value={accessCode}
            onChangeText={setAccessCode}
        />
        <Text style={styles.hint}>No compartas este código con otras personas.</Text>
        <ScreenFooter>
          <Button
              label="Continuar"
              disabled={!isComplete}
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
    marginBottom: 6,
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
