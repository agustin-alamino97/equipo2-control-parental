import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ICONS, IconKey } from '../constants/icons';

type Props = {
  name: IconKey;
  size?: number;
  color?: string;
  style?: any;
};

export default function AppIcon({ name, size = 22, color = '#FFF', style }: Props) {
  const icon = ICONS[name];
  if (icon.set === 'mc') {
    return <MaterialCommunityIcons name={icon.name as any} size={size} color={color} style={style} />;
  }
  return <Ionicons name={icon.name as any} size={size} color={color} style={style} />;
}