import { Stack } from 'expo-router';
import { colors } from '../../../theme';

export default function DevicesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.ink,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Tus dispositivos' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalle del dispositivo' }} />
    </Stack>
  );
}
