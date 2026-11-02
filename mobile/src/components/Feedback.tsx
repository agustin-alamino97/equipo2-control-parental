import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export function Feedback({ message, kind = 'error' }: { message: string; kind?: 'error' | 'success' | 'info' }) {
  const tone = kind === 'error'
    ? { backgroundColor: colors.dangerBackground, color: colors.danger }
    : kind === 'success'
      ? { backgroundColor: colors.successBackground, color: colors.success }
      : { backgroundColor: colors.accent, color: colors.primaryDark };
  return (
    <View accessibilityRole="alert" style={[styles.container, { backgroundColor: tone.backgroundColor }]}>
      <Text style={[styles.text, { color: tone.color }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 14, borderRadius: 12 },
  text: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
});
