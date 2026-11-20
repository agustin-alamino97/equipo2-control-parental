import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  ConfirmAccount: undefined;
  Login: undefined;
  Recover: undefined;
  Activate: undefined;
  UsageMode: undefined;
  AddDevice: undefined;
  ConfigureAccess: undefined;
  LinkDevice: undefined;
  Linked: undefined;
  ConfigProtection: undefined;
  Summary: undefined;
  Activating: undefined;
  ResponsibleMode: undefined;
  Interrupted: undefined;
  RegistrationSuccess: undefined;
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
  ScreenGallery: undefined;
};

export type AppScreenProps<RouteName extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, RouteName>;
