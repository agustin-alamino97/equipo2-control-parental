import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../constants/colors';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: 'solid' | 'outline' | 'disabled';
  style?: ViewStyle;
};

export default function PrimaryButton({ title, onPress, variant = 'solid', style }: Props) {
  const isOutline = variant === 'outline';
  const isDisabled = variant === 'disabled';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.button, isOutline && styles.outline, isDisabled && styles.disabled, style]}
    >
      <Text style={[styles.text, isOutline && styles.textOutline]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: COLORS.primary, padding: 20, borderRadius: 8, alignItems: 'center', marginVertical: 6 },
  outline: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.primary },
  disabled: { backgroundColor: '#D3D3D3' },
  text: { color: COLORS.white, fontWeight: '600', fontSize: 15 },
  textOutline: { color: COLORS.primary },
});