import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function InfoBox({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <View style={styles.box}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderWidth: 1, borderColor: COLORS.gray, borderRadius: 10, padding: 14, marginVertical: 10, backgroundColor: COLORS.white },
  title: { fontWeight: '700', color: COLORS.primary, marginBottom: 6 },
});