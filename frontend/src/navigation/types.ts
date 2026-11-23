import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: { step?: 1 | 2 | 3 | 4 | 5 };
  Welcome: undefined;
  Register: undefined;
  RegistrationSuccess: undefined;
  Login: undefined;
  Recover: undefined;
  UsageMode: undefined;
  Activate: undefined;
  AddDevice: undefined;
  ConfigureAccess: undefined;
  LinkDevice: undefined;
  Linked: undefined;
  ConfigProtection: undefined;
  Summary: undefined;
  Activating: undefined;
  ResponsibleMode: undefined;
  Interrupted: undefined;
  History: undefined;
  Profile: undefined;
  BlockedSites: undefined;
  Blacklist: undefined;
  LinkNewDeviceGuide: undefined;
  AccessibilitySetup: undefined;
  KeepAppPinned: undefined;
  AutoStartSetup: undefined;
  UninstallProtection: undefined;
  NotificationPermission: undefined;
  BackgroundWork: undefined;
  AccessCodeSetup: undefined;
  AccessCodeConfirmation: { accessCode: string };
  ProtectedCode: undefined;
  ProtectedHome: undefined;
  Settings: undefined;
  CustomList: undefined;
  Devices: undefined;
  ScreenGallery: undefined;
};

export type AppScreenProps<RouteName extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, RouteName>;
