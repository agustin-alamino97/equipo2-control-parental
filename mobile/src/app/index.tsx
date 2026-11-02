import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export default function IndexRoute() {
  const mode = useAuthStore((state) => state.mode);
  const token = useAuthStore((state) => state.token);
  const deviceToken = useAuthStore((state) => state.deviceToken);

  if (!mode) return <Redirect href="/onboarding" />;
  if (mode === 'responsible') {
    return <Redirect href={token ? '/(tabs)/devices' : '/login'} />;
  }
  return <Redirect href={deviceToken ? '/protection' : '/pairing'} />;
}
