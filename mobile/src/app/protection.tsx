import { Redirect } from 'expo-router';
import { ProtectionScreen } from '../screens/ProtectionScreen';
import { useAuthStore } from '../store/authStore';

export default function ProtectionRoute() {
  const deviceToken = useAuthStore((state) => state.deviceToken);
  return deviceToken ? <ProtectionScreen /> : <Redirect href="/pairing" />;
}
