import { Tabs } from 'expo-router';
import AppIcon from '../../components/AppIcon';
import { COLORS } from '../../constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="inicio"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused, color }) => (
            <AppIcon name={focused ? 'homeActive' : 'home'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="proteccion"
        options={{
          title: 'Protección',
          tabBarIcon: ({ focused, color }) => (
            <AppIcon name={focused ? 'protectionActive' : 'protection'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused, color }) => (
            <AppIcon name={focused ? 'profileActive' : 'profile'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}