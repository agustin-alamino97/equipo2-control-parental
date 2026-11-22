import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import {
  FigmaScreen,
  FIGMA_COLORS,
  PageTitle,
  SurfaceCard,
} from '../components';
import type { AppScreenProps } from '../navigation/types';

export default function ScreenGalleryScreen({
  navigation,
}: AppScreenProps<'ScreenGallery'>) {
  const screens = [
    { title: 'Registro exitoso', description: 'Confirmación y próximo acceso a la cuenta.', onPress: () => navigation.navigate('RegistrationSuccess'),},
    { title: 'Historial', description: 'Actividad reciente del dispositivo protegido.', onPress: () => navigation.navigate('History'),},
    {
      title: 'Perfil',
      description: 'Cuenta, preferencias e historial.',
      onPress: () => navigation.navigate('Profile'),
    },
    { title: 'Sitios bloqueados', description: 'Categorías y acceso a la lista negra.', onPress: () => navigation.navigate('BlockedSites'),},
    { title: 'Lista negra', description: 'Administración manual de sitios bloqueados.', onPress: () => navigation.navigate('Blacklist'),},
    { title: 'Vincular dispositivo', description: 'Guía para incorporar un nuevo equipo.', onPress: () => navigation.navigate('LinkNewDeviceGuide'),},
    { title: 'Accesibilidad', description: 'Primer permiso de configuración.', onPress: () => navigation.navigate('AccessibilitySetup'),},
    { title: 'Fijar aplicación', description: 'Mantener BA Protege+ activa.', onPress: () => navigation.navigate('KeepAppPinned'),},
    { title: 'Inicio automático', description: 'Iniciar protección al encender el dispositivo.', onPress: () => navigation.navigate('AutoStartSetup'),},
    { title: 'Protección de desinstalación', description: 'Restringir la eliminación de la aplicación.', onPress: () => navigation.navigate('UninstallProtection'),},
    { title: 'Notificaciones', description: 'Permitir avisos sobre el dispositivo.', onPress: () => navigation.navigate('NotificationPermission'),},
    { title: 'Actividad en segundo plano', description: 'Mantener activa la protección.', onPress: () => navigation.navigate('BackgroundWork'),},
    { title: 'Crear código de acceso', description: 'Configurar un código numérico.', onPress: () => navigation.navigate('AccessCodeSetup'),},
    { title: 'Confirmar código de acceso', description: 'Vista directa de prueba usando el código 1234.', onPress: () => navigation.navigate('AccessCodeConfirmation', { accessCode: '1234' }),},
    { title: 'Splash', description: 'Pantalla de carga inicial.', onPress: () => navigation.navigate('Splash') },
    { title: 'Onboarding', description: 'Flujo de bienvenida.', onPress: () => navigation.navigate('Onboarding', { step: 1 }) },
    { title: 'Welcome', description: 'Pantalla de inicio (landing).', onPress: () => navigation.navigate('Welcome') },
    { title: 'Login', description: 'Inicio de sesión.', onPress: () => navigation.navigate('Login') },
    { title: 'Recover', description: 'Recuperar contraseña.', onPress: () => navigation.navigate('Recover') },
    { title: 'UsageMode', description: 'Selección de modo de uso.', onPress: () => navigation.navigate('UsageMode') },
    { title: 'Activate', description: 'Bienvenida al flujo responsable.', onPress: () => navigation.navigate('Activate') },
    { title: 'AddDevice', description: 'Agregar dispositivo.', onPress: () => navigation.navigate('AddDevice') },
    { title: 'ConfigureAccess', description: 'Configurar acceso.', onPress: () => navigation.navigate('ConfigureAccess') },
    { title: 'LinkDevice', description: 'Vincular dispositivo (nuevo).', onPress: () => navigation.navigate('LinkDevice') },
    { title: 'Linked', description: 'Dispositivo vinculado.', onPress: () => navigation.navigate('Linked') },
    { title: 'ConfigProtection', description: 'Permisos a habilitar.', onPress: () => navigation.navigate('ConfigProtection') },
    { title: 'Summary', description: 'Resumen de configuración.', onPress: () => navigation.navigate('Summary') },
    { title: 'Activating', description: 'Activando protección.', onPress: () => navigation.navigate('Activating') },
    { title: 'ResponsibleMode', description: 'Home del responsable.', onPress: () => navigation.navigate('ResponsibleMode') },
    { title: 'ProtectedCode', description: 'Código del modo protegido.', onPress: () => navigation.navigate('ProtectedCode') },
    { title: 'ProtectedHome', description: 'Home del dispositivo protegido.', onPress: () => navigation.navigate('ProtectedHome') },
    { title: 'Interrupted', description: 'Confirmación de bloqueo aplicado.', onPress: () => navigation.navigate('Interrupted') },
    { title: 'Settings', description: 'Configuración del control parental.', onPress: () => navigation.navigate('Settings') },
    { title: 'CustomList', description: 'Lista personalizada.', onPress: () => navigation.navigate('CustomList') },
    { title: 'Devices', description: 'Dispositivos vinculados.', onPress: () => navigation.navigate('Devices') },
  ];

  return (
    <FigmaScreen onBack={() => navigation.goBack()}>
      <PageTitle
        title="Pantallas nuevas"
        subtitle="Acceso de desarrollo para previsualizar cada pantalla sin completar los flujos anteriores."
      />
      <SurfaceCard style={styles.list}>
        {screens.map((screen, index) => (
          <TouchableOpacity
            accessibilityRole="button"
            key={screen.title}
            onPress={screen.onPress}
            style={[styles.item, index > 0 && styles.divided]}
          >
            <View style={styles.itemText}>
              <Text style={styles.title}>{screen.title}</Text>
              <Text style={styles.description}>{screen.description}</Text>
            </View>
            <ChevronRight color={FIGMA_COLORS.muted} size={19} />
          </TouchableOpacity>
        ))}
      </SurfaceCard>
    </FigmaScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 14,
    paddingVertical: 0,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 65,
    paddingVertical: 10,
  },
  divided: {
    borderTopColor: FIGMA_COLORS.border,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  itemText: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    color: FIGMA_COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    color: FIGMA_COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
});
