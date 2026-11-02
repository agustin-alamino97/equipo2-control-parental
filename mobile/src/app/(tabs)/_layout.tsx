import { Redirect, Tabs } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../theme';

export default function ResponsibleTabsLayout() {
  const mode = useAuthStore((state) => state.mode);
  const token = useAuthStore((state) => state.token);
  if (mode !== 'responsible' || !token) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.ink,
        headerTitleStyle: { fontWeight: '800' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { minHeight: 62, paddingTop: 6, paddingBottom: 6 },
      }}
    >
      <Tabs.Screen name="devices" options={{ title: 'Dispositivos', headerShown: false }} />
      <Tabs.Screen name="rules" options={{ title: 'Reglas' }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alertas' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
