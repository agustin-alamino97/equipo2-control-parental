# BA Protege+

Aplicación de control parental para prevenir el acceso a sitios de apuestas ilegales y otros contenidos riesgosos. Permite a un adulto responsable configurar la protección de los dispositivos que usan sus hijos.

## Stack

- **Expo** + **React Native**
- **TypeScript** (strict)
- **React Navigation** (native-stack)
- **lucide-react-native** (iconografía)
- **react-native-safe-area-context**

## Requisitos

- Node.js 18+
- npm 9+
- Expo CLI (`npx expo`)
- Dispositivo físico o emulador (iOS/Android)

## Instalación

```bash
npm install
npx expo start

src
├── components
│   ├── ActionTile.tsx
│   ├── BottomTabs.tsx
│   ├── Button.tsx
│   ├── CheckOption.tsx
│   ├── FigmaScreen.tsx
│   ├── index.ts
│   ├── LotbaBrandMark.tsx
│   ├── OnboardingArtwork.tsx
│   ├── OnboardingBullet.tsx
│   ├── PinEntry.tsx
│   ├── SettingRow.tsx
│   └── TextField.tsx
├── data
│   ├── blacklist.ts
│   ├── historyEntries.ts
│   ├── index.ts
│   ├── onboarding.ts
│   └── protectionSteps.ts
├── navigation
│   ├── RootNavigator.tsx
│   └── types.ts
├── screens
│   ├── AccessCodeConfirmationScreen.tsx
│   ├── AccessCodeSetupScreen.tsx
│   ├── AccessibilitySetupScreen.tsx
│   ├── ActivateScreen.tsx
│   ├── ActivatingScreen.tsx
│   ├── AddDeviceScreen.tsx
│   ├── AutoStartSetupScreen.tsx
│   ├── BackgroundWorkScreen.tsx
│   ├── BlacklistScreen.tsx
│   ├── BlockedSitesScreen.tsx
│   ├── ConfigProtectionScreen.tsx
│   ├── ConfigureAccessScreen.tsx
│   ├── CustomListScreen.tsx
│   ├── DevicesScreen.tsx
│   ├── HistoryScreen.tsx
│   ├── InterruptedScreen.tsx
│   ├── KeepAppPinnedScreen.tsx
│   ├── LinkDeviceGuideScreen.tsx
│   ├── LinkDeviceScreen.tsx
│   ├── LinkedScreen.tsx
│   ├── LinkNewDeviceGuideScreen.tsx
│   ├── LoginScreen.tsx
│   ├── NotificationPermissionScreen.tsx
│   ├── OnboardingScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── ProtectedCodeScreen.tsx
│   ├── ProtectedHomeScreen.tsx
│   ├── RecoverScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── RegistrationSuccessScreen.tsx
│   ├── ResponsibleModeScreen.tsx
│   ├── ScreenGalleryScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── SetupStepScreen.tsx
│   ├── SplashScreen.tsx
│   ├── SummaryScreen.tsx
│   ├── UninstallProtectionScreen.tsx
│   ├── UsageModeScreen.tsx
│   └── WelcomeScreen.tsx
└── services
    ├── api.ts
    ├── deviceIdentity.ts
    └── tokenStorage.ts

6 directories, 61 files


Flujos Principales

Onboarding y autenticación

Splash → Onboarding (5 pasos) → Welcome → Login → UsageMode
                              ↘ Register → ConfirmAccount → RegistrationSuccess → Login

Flujo responsable (configuración)

UsageMode → Activate → AddDevice → ConfigureAccess → LinkDevice → Linked
         → ConfigProtection → Summary → Activating → ResponsibleMode

Flujo de permisos (configuración detallada del dispositivo)

ResponsibleMode → Devices → LinkNewDeviceGuide → AccessibilitySetup
              → KeepAppPinned → AutoStartSetup → UninstallProtection
              → NotificationPermission → BackgroundWork → AccessCodeSetup
              → AccessCodeConfirmation → ResponsibleMode

Modo protegido (hijo)

UsageMode → ProtectedCode → ProtectedHome

Home del responsable

ResponsibleMode → BlockedSites → Blacklist
              → Devices → LinkNewDeviceGuide → (flujo de permisos)
              → Settings
              → Bottom tabs: History / Profile

Agregar una pantalla nueva

1 - Crear src/screens/NuevaScreen.tsx:

import { FigmaScreen, PageTitle } from '../components/FigmaScreen';
import type { AppScreenProps } from '../navigation/types';

export default function NuevaScreen({ navigation }: AppScreenProps<'Nueva'>) {
  return (
    <FigmaScreen onBack={() => navigation.goBack()}>
      <PageTitle title="Nueva" subtitle="Descripción" />
    </FigmaScreen>
  );
}

2 - Agregar Nueva: undefined (o con params) a RootStackParamList en navigation/types.ts.

3 - Registrar <Stack.Screen name="Nueva" component={NuevaScreen} /> en RootNavigator.tsx.

Scripts

npx tsc --noEmit      # Typecheck
npx expo start        # Dev server
npx expo start --clear # Dev server (limpia cache)

Pantalla de desarrollo
ScreenGallery es un índice de todas las pantallas, gateado con __DEV__. No aparece en builds de producción. Se usa para previsualizar screens sin completar los flujos anteriores.




