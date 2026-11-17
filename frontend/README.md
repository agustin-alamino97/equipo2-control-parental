# BA Protege+

Aplicación móvil de **control parental y protección digital para familias**, desarrollada en **React Native + Expo**. Permite a los responsables gestionar el acceso a sitios de apuestas ilegales y contenidos riesgosos en los dispositivos de sus hijos.

---

## Tabla de contenidos

- [Requisitos previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Flujo de navegación](#-flujo-de-navegación)
- [Módulos principales](#-módulos-principales)
- [Persistencia local](#-persistencia-local)
- [Tema y estilos](#-tema-y-estilos)
- [Íconos](#-íconos)
- [Scripts disponibles](#-scripts-disponibles)
- [Convenciones de código](#-convenciones-de-código)
- [Notas para el equipo de backend](#-notas-para-el-equipo-de-backend)
- [Licencia](#-licencia)

---

## Requisitos previos

- **Node.js** `>= 18`
- **npm** `>= 9` (o `yarn` / `pnpm`)
- **Expo CLI** (se instala con `npx expo`)
- **Expo Go** en tu dispositivo físico, o un emulador/simulador:
  - Android Studio (emulador Android)
  - Xcode (simulador iOS, solo en macOS)

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPO>
cd BAProtege_App

# 2. Instalar dependencias (usar --legacy-peer-deps para evitar conflictos de peer deps en SDK 58)
npm install --legacy-peer-deps

# 3. Instalar dependencias de Expo
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar -- --legacy-peer-deps
npx expo install react-native-reanimated react-native-worklets -- --legacy-peer-deps
npx expo install @react-native-async-storage/async-storage expo-splash-screen -- --legacy-peer-deps
npx expo install @expo/vector-icons -- --legacy-peer-deps

# 4. Levantar el proyecto
npx expo start -c

Estructura del proyecto:

BAProtege_App/
├── app/                          # Rutas de Expo Router (file-based routing)
│   ├── _layout.tsx               # Layout raíz (Stack + ThemeProvider)
│   ├── index.tsx                 # "Portero": redirige según estado de sesión
│   ├── onboarding.tsx            # Onboarding de 6 pasos
│   ├── bienvenida.tsx            # Pantalla de bienvenida (login / registro)
│   ├── login.tsx                 # Inicio de sesión
│   ├── registro.tsx              # Formulario de registro
│   ├── confirmar-correo.tsx      # Verificación OTP
│   ├── registro-exitoso.tsx      # Confirmación de cuenta creada
│   ├── modo-uso.tsx              # Elección de modo (responsable / protegido)
│   ├── notificaciones.tsx        # Listado de alertas
│   ├── ajustes.tsx               # Ajustes generales (tema, idioma, etc.)
│   ├── (tabs)/                   # Navegación por tabs
│   │   ├── _layout.tsx           # Configuración de las tabs
│   │   ├── inicio.tsx            # Home del modo responsable
│   │   ├── proteccion.tsx        # Dispositivos vinculados
│   │   └── perfil.tsx            # Perfil del usuario
│   ├── responsable/              # Módulo "Modo Responsable"
│   │   ├── bloqueo-sitios.tsx
│   │   ├── dispositivos.tsx
│   │   ├── vincular-dispositivo.tsx
│   │   ├── tablet-nino.tsx
│   │   ├── descripcion-nino.tsx
│   │   └── configuracion.tsx
│   └── protegido/                # Módulo "Modo Protegido"
│       ├── _layout.tsx
│       ├── notificaciones.tsx
│       ├── accesibilidad.tsx
│       ├── app-fija.tsx
│       ├── inicio-automatico.tsx
│       ├── contra-eliminacion.tsx
│       ├── notificaciones-permiso.tsx
│       ├── segundo-plano.tsx
│       ├── pin.tsx
│       ├── repetir-pin.tsx
│       └── listo.tsx
│
├── components/                   # Componentes reutilizables
│   ├── AppIcon.tsx               # Renderiza íconos según constant/icons
│   ├── AnimatedCheck.tsx         # Check animado (Reanimated)
│   ├── FadeInView.tsx            # Animación de entrada
│   ├── Header.tsx                # Header con safe area + logo opcional
│   ├── InfoBox.tsx               # Caja de información
│   ├── OptionCard.tsx            # Tarjeta de opción (menú)
│   ├── PinPad.tsx                # Teclado numérico
│   ├── PrimaryButton.tsx         # Botón principal (solid / outline / disabled)
│   └── TabBar.tsx                # (obsoleto) TabBar custom, no usado
│
├── constants/
│   ├── colors.ts                 # Paleta estática (legacy, ver ThemeContext)
│   ├── icons.ts                  # Mapa centralizado de íconos
│   └── theme.ts                  # Paletas LIGHT / DARK
│
├── contexts/
│   └── ThemeContext.tsx          # Provider de tema (claro / oscuro / sistema)
│
├── utils/
│   ├── notifications.ts          # Alertas (CRUD con AsyncStorage)
│   ├── settings.ts               # Preferencias del usuario
│   ├── sites.ts                  # Sitios bloqueados (personalizados + lista negra)
│   └── storage.ts                # Sesión, onboarding y user
│
├── assets/                       # Imágenes y logos
├── app.json                      # Configuración de Expo
├── package.json
└── tsconfig.json

Flujo de navegación:

App abre
  ↓
app/index.tsx (portero)
  ↓
¿onboarding completado?
  ├── NO  → /onboarding
  └── SÍ  → ¿usuario registrado?
              ├── NO  → /bienvenida (login / registro)
              └── SÍ  → según modo:
                          ├── responsable → /(tabs)/inicio
                          └── protegido   → /protegido/notificaciones

Flujo del registro completo:

/onboarding → /bienvenida → /registro → /confirmar-correo → /registro-exitoso → /modo-uso → tabs o protegido

Scripts disponibles:

# Levantar Metro
npx expo start

# Levantar con caché limpia
npx expo start -c

# Correr en Android
npx expo run:android

# Correr en iOS
npx expo run:ios

# Correr en web
npx expo start --web

# Verificar tipos de TypeScript
npx tsc --noEmit

Imports:

// 1. React / React Native
import React from 'react';
import { View, Text } from 'react-native';

// 2. Terceros
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// 3. Internos (por capa)
import Header from '../components/Header';
import { COLORS } from '../constants/colors';
import { getUser } from '../utils/storage';

Notas para el equipo de backend
El frontend está desacoplado del backend. Actualmente usa mocks locales (AsyncStorage + setTimeout) para simular la API.

Endpoints esperados
Feature	Endpoint	Pantalla
Login	POST /auth/login	app/login.tsx
Registro	POST /auth/register	app/registro.tsx
Verificación OTP	POST /auth/verify-code	app/confirmar-correo.tsx
Recuperar contraseña	POST /auth/forgot-password	app/login.tsx
Lista de sitios	GET/POST/DELETE /sites	app/responsable/bloqueo-sitios.tsx
Dispositivos vinculados	GET /devices	app/(tabs)/proteccion.tsx
Vincular dispositivo	POST /devices/link	app/responsable/vincular-dispositivo.tsx
Configuración responsable	PUT /config/responsable	app/responsable/configuracion.tsx
Configuración protegido	PUT /config/protegido	app/protegido/*
Cada pantalla tiene un único punto de integración marcado con comentarios // MOCK o // TODO: conectar API.

