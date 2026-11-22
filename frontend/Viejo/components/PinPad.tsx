import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function PinPad({ onPress }: { onPress: (digit: string) => void }) {
  const digits = ['1','2','3','4','5','6','7','8','9','','0',''];
  return (
    <View style={styles.grid}>
      {digits.map((d, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.key, !d && { backgroundColor: 'transparent', borderWidth: 0 }]}
          disabled={!d}
          onPress={() => d && onPress(d)}
        >
          <Text style={styles.keyText}>{d}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  key: {
    width: 70, height: 70, borderRadius: 35, borderWidth: 1,
    borderColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', margin: 6,
  },
  keyText: { fontSize: 22, color: COLORS.primary, fontWeight: '600' },
});