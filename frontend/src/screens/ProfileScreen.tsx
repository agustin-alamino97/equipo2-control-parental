import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  Bell, ChevronRight, CircleUserRound, History, LogOut, Shield,
} from 'lucide-react-native';
import {
  FigmaScreen, FIGMA_COLORS, PageTitle, SurfaceCard,
} from '../components/FigmaScreen';
import type { AppScreenProps } from '../navigation/types';
import { tokenStorage } from '../services/tokenStorage';

type User = { id: string; email: string; name?: string | null };

export default function ProfileScreen({ navigation }: AppScreenProps<'Profile'>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const u = await tokenStorage.getUser();
      setUser(u);
    } catch (e) {
      console.warn('No se pudo leer el usuario:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarga cuando la pantalla vuelve al foco (por si cambió el login)
  useEffect(() => {
    const unsub = navigation.addListener('focus', loadUser);
    loadUser();
    return unsub;
  }, [navigation, loadUser]);

  const handleSignOut = async () => {
    await tokenStorage.clearAll();
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };

  const displayName = loading
    ? 'Cargando…'
    : user?.name || user?.email || 'Sin sesión';
  const displayEmail = loading ? '' : user?.email ?? '';

  return (
    <FigmaScreen onBack={() => navigation.goBack()}>
      <PageTitle title="Mi perfil" subtitle="Gestioná tu cuenta y preferencias." />
      <SurfaceCard style={styles.profileCard}>
        <View style={styles.avatar}>
          <CircleUserRound color={FIGMA_COLORS.primary} size={35} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{displayEmail}</Text>
        </View>
      </SurfaceCard>
      <Text style={styles.sectionTitle}>Preferencias</Text>
      <SurfaceCard style={styles.menu}>
        <MenuItem icon={<History color={FIGMA_COLORS.primary} size={20} />} label="Historial de actividad" onPress={() => navigation.navigate('History')} />
        <MenuItem icon={<Shield color={FIGMA_COLORS.primary} size={20} />} label="Sitios bloqueados" onPress={() => navigation.navigate('BlockedSites')} />
        <MenuItem icon={<Bell color={FIGMA_COLORS.primary} size={20} />} label="Notificaciones" onPress={() => navigation.navigate('NotificationPermission')} />
      </SurfaceCard>
      <TouchableOpacity accessibilityRole="button" onPress={handleSignOut} style={styles.signOut}>
        <LogOut color={FIGMA_COLORS.danger} size={19} />
        <Text style={styles.signOutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </FigmaScreen>
  );
}

// MenuItem y styles quedan igual que antes

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      style={styles.menuItem}
    >
      <View style={styles.menuIcon}>{icon}</View>
      <Text style={styles.menuLabel}>{label}</Text>
      <ChevronRight color={FIGMA_COLORS.muted} size={18} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 28,
    paddingVertical: 20,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: FIGMA_COLORS.softPurple,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginRight: 14,
    width: 56,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    color: FIGMA_COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  email: {
    color: FIGMA_COLORS.muted,
    fontSize: 13,
    marginTop: 5,
  },
  sectionTitle: {
    color: FIGMA_COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  menu: {
    paddingHorizontal: 14,
    paddingVertical: 0,
  },
  menuItem: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 60,
  },
  menuIcon: {
    alignItems: 'center',
    backgroundColor: FIGMA_COLORS.softPurple,
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    marginRight: 12,
    width: 36,
  },
  menuLabel: {
    color: FIGMA_COLORS.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  signOut: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
    paddingVertical: 10,
  },
  signOutText: {
    color: FIGMA_COLORS.danger,
    fontSize: 14,
    fontWeight: '600',
  },
});
