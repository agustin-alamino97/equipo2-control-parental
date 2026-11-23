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
        <PinEntry
            accessibilityLabel="Confirmar código de acceso"
            length={4}
            masked
            value={confirmation}
            onChangeText={setConfirmation}
        />
        {mismatch ? (
            <Text accessibilityRole="alert" style={styles.error}>
              Los códigos no coinciden. Volvé a intentarlo.
            </Text>
        ) : (
            <Text style={styles.hint}>Ingresá nuevamente los 4 dígitos.</Text>
        )}
        <ScreenFooter>
          <Button
              label="Confirmar código"
              disabled={confirmation.length !== 4 || mismatch}
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