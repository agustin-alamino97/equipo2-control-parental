import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

export default function Header({
  title = 'BA Protege+',
  subtitle,
  showLogo = false,
}: {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.wrap}>
      <View style={[styles.bar, { paddingTop: insets.top + 12 }]}>
        {showLogo && (
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        )}
        <Text style={styles.barText}>{title}</Text>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: COLORS.white },
  bar: {
    backgroundColor: COLORS.primary,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  logo: { width: 24, height: 24, marginRight: 8 },
  barText: { color: COLORS.white, fontSize: 30, fontWeight: '800' },
  subtitle: {
    textAlign: 'center',
    marginTop: 14,
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
    paddingHorizontal: 20,
  },
});