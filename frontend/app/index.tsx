// app/index.tsx
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { getOnboarded, getUser } from '../utils/storage';
import { COLORS } from '../constants/colors';

export default function Index() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // 👇 Poné esto en true para forzar el onboarding
      const DEV_FORCE_ONBOARDING = true; 

      if (DEV_FORCE_ONBOARDING) {
        return setTarget('/onboarding');
      }

      const onboarded = await getOnboarded();
      const user = await getUser();

      if (!onboarded) {
        setTarget('/onboarding');
      } else if (onboarded && !user) {
        setTarget('/bienvenida'); // 👈 Ahora va a bienvenida, no a index
      } else if (onboarded && user) {
        setTarget(user.mode === 'protegido' ? '/protegido/notificaciones' : '/(tabs)/inicio');
      }
    })();
  }, []);

  if (!target) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return <Redirect href={target as any} />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white },
});