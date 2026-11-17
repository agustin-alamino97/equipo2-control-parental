import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, usePathname } from 'expo-router';
import AppIcon from './AppIcon';
import { IconKey } from '../constants/icons';
import { COLORS } from '../constants/colors';

const tabs: { key: string; label: string; icon: IconKey; iconActive: IconKey; route: string }[] = [
  { key: 'inicio', label: 'Inicio', icon: 'home', iconActive: 'homeActive', route: '/(tabs)/inicio' },
  { key: 'proteccion', label: 'Protección', icon: 'protection', iconActive: 'protectionActive', route: '/(tabs)/proteccion' },
  { key: 'perfil', label: 'Perfil', icon: 'profile', iconActive: 'profileActive', route: '/(tabs)/perfil' },
];

export default function TabBar() {
  const pathname = usePathname();
  return (
    <View style={styles.bar}>
      {tabs.map(t => {
        const active = pathname.includes(t.key);
        return (
          <TouchableOpacity key={t.key} style={styles.item} onPress={() => router.push(t.route as any)}>
            <AppIcon name={active ? t.iconActive : t.icon} size={20} color={COLORS.white} />
            <Text style={[styles.label, active && styles.active]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: COLORS.primary, paddingVertical: 10 },
  item: { flex: 1, alignItems: 'center' },
  label: { color: COLORS.white, fontSize: 10, opacity: 0.7, marginTop: 2 },
  active: { opacity: 1, fontWeight: '700' },
});