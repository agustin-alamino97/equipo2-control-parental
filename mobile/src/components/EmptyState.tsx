import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.mark}>+</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.detail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 24, gap: 8 },
  mark: { color: colors.primary, fontSize: 34, fontWeight: '300' },
  title: { color: colors.ink, fontSize: 17, fontWeight: '700', textAlign: 'center' },
  detail: { color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center' },
});
