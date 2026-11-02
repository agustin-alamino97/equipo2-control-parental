import { Redirect } from 'expo-router';
import { PairingScreen } from '../screens/PairingScreen';
import { useAuthStore } from '../store/authStore';

export default function PairingRoute() {
  const deviceToken = useAuthStore((state) => state.deviceToken);
  return deviceToken ? <Redirect href="/protection" /> : <PairingScreen />;
}
