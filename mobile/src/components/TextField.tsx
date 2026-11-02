import { useState } from 'react';
import type { TextInputProps } from 'react-native';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function TextField({ label, error, secureTextEntry, style, ...inputProps }: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, focused && styles.focused, error && styles.inputError]}>
        <TextInput
          accessibilityLabel={label}
          autoCapitalize="none"
          onBlur={(event) => {
            setFocused(false);
            inputProps.onBlur?.(event);
          }}
          onFocus={(event) => {
            setFocused(true);
            inputProps.onFocus?.(event);
          }}
          placeholderTextColor={colors.muted}
          secureTextEntry={Boolean(secureTextEntry) && !passwordVisible}
          style={[styles.input, style]}
          {...inputProps}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${passwordVisible ? 'Ocultar' : 'Mostrar'} ${label.toLowerCase()}`}
            accessibilityHint="Cambia la visibilidad del texto de la contraseña"
            onPress={() => setPasswordVisible((visible) => !visible)}
            style={styles.visibilityToggle}
            hitSlop={8}
          >
            <Text style={styles.visibilityLabel}>{passwordVisible ? 'Ocultar' : 'Mostrar'}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 7 },
  label: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  inputContainer: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 50,
    paddingHorizontal: 14,
    color: colors.ink,
    fontSize: 16,
  },
  focused: { borderColor: colors.primary, borderWidth: 2 },
  inputError: { borderColor: colors.danger },
  visibilityToggle: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 12 },
  visibilityLabel: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  error: { color: colors.danger, fontSize: 13 },
});
