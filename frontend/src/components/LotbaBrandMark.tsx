import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const brandLogo = require('../../assets/isotipo_Mesa de trabajo 1 1(1).png');

export default function LotbaBrandMark({ size = 160 }: { size?: number }) {
  return (
    <View
      accessible
      accessibilityLabel="Logo BA Protege+"
      style={[styles.frame, { height: size, width: size }]}
    >
      <Image
        resizeMode="contain"
        source={brandLogo}
        style={{ height: size * 1.9, width: size * 1.9 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
