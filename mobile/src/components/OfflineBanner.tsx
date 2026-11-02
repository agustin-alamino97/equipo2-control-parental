import { useNetInfo } from '@react-native-community/netinfo';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export function OfflineBanner() {
  const { isConnected, isInternetReachable } = useNetInfo();
  if (isConnected !== false && isInternetReachable !== false) return null;
  return (
    <View accessibilityRole="alert" style={styles.banner}>
      <Text style={styles.text}>
        Sin conexión a internet. Las funciones que requieren sincronización estarán disponibles cuando vuelva la conexión.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: colors.warningBackground, paddingHorizontal: 18, paddingVertical: 12 },
  text: { color: colors.warning, fontSize: 14, lineHeight: 20, fontWeight: '600' },
});
