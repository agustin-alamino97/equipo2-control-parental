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

src/
├── components/          # Design system
│   ├── FigmaScreen.tsx        # Screen wrapper + primitivos base + FIGMA_COLORS
│   ├── Button.tsx             # Botón filled/outline/disabled
│   ├── TextField.tsx          # Input con label, secure, pencil
│   ├── CheckOption.tsx        # Checkbox con label
│   ├── PinEntry.tsx           # Ingreso de código (4/5 dígitos, masked)
│   ├── BottomTabs.tsx         # Tabs Home / Historial / Perfil
│   ├── ActionTile.tsx         # Tile de acción (mode/card, primary/positive)
│   ├── SettingRow.tsx         # Label + switch
│   ├── OnboardingBullet.tsx   # Bullet con check verde
│   ├── LotbaBrandMark.tsx     # Logo
│   ├── OnboardingArtwork.tsx  # Ilustraciones del onboarding
│   └── index.ts               # Barrel export
├── data/                # Contenido estático
│   ├── onboarding.ts          # Títulos, subtítulos, bullets, artwork por paso
│   ├── protectionSteps.ts     # Copy aprobado del flujo viejo (referencia)
│   ├── protectedDevices.ts    # Mock de dispositivos
│   ├── historyEntries.ts      # Mock de historial
│   ├── blacklist.ts           # Sitios bloqueados iniciales
│   └── index.ts
├── navigation/
│   ├── types.ts               # RootStackParamList
│   └── RootNavigator.tsx      # Stack con las 38 rutas
└── screens/             # 1 archivo por pantalla (38 rutas + 2 shared)


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




