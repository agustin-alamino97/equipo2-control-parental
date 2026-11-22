import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import AppIcon from './AppIcon';
import { IconKey } from '../constants/icons';
import { COLORS } from '../constants/colors';

type Props = {
  icon: IconKey;
  title: string;
  subtitle?: string;
  color: 'purple' | 'green' | 'orange';
  onPress?: () => void;
};

export default function OptionCard({ icon, title, subtitle, color, onPress }: Props) {
  const bg = color === 'green' ? COLORS.green : color === 'orange' ? COLORS.orange : COLORS.primary;
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, { backgroundColor: bg }]}>
      <View style={styles.iconCircle}>
        <AppIcon name={icon} size={22} color={COLORS.white} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, padding: 14, marginVertical: 6 },
  iconCircle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  title: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  sub: { color: COLORS.white, fontSize: 11, marginTop: 2 },
});