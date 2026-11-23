import React, { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import AppIcon from './AppIcon';
import { COLORS } from '../constants/colors';

export default function AnimatedCheck({ size = 90, delay = 100 }: { size?: number; delay?: number }) {
  const scale = useSharedValue(0);
  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 8, stiffness: 100 }));
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={style}>
      <AppIcon name="checkCircle" size={size} color={COLORS.green} />
    </Animated.View>
  );
}