import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  type TextInputInstance,
  View,
} from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock3,
  Eye,
  EyeOff,
  Home,
  Laptop,
  ListChecks,
  LockKeyhole,
  Mail,
  Pencil,
  RefreshCw,
  Shield,
  Smartphone,
  Tablet,
  UserRound,
} from 'lucide-react-native';
import LotbaBrandMark from './components/LotbaBrandMark';
import OnboardingArtwork from './components/OnboardingArtwork';

type LotbaStackParamList = {
  Splash: undefined;
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Onboarding4: undefined;
  Onboarding5: undefined;
  Landing: undefined;
  Register: undefined;
  EmailConfirmation: { email: string };
  RegistrationSuccess: undefined;
  Login: undefined;
  Recover: { email?: string } | undefined;
  UsageMode: undefined;
  ResponsibleSetup: undefined;
  DevicePermission: undefined;
  ProtectionSummary: undefined;
  VpnConsent: undefined;
  ResponsibleHome: undefined;
  History: undefined;
  Profile: undefined;
  Settings: undefined;
  BlockedSites: undefined;
  CustomList: undefined;
  Blacklist: undefined;
  Devices: undefined;
  LinkDeviceGuide: undefined;
  ProtectedCode: undefined;
  ProtectedHome: undefined;
  ProtectionSetup: { step: number; accessCode?: string; newCode?: string };
  ProtectionComplete: undefined;
};

type FlowNavigator = Pick<
  NativeStackNavigationProp<LotbaStackParamList, 'Onboarding1'>,
  'navigate'
>;
type ScreenProps<Route extends keyof LotbaStackParamList> =
  NativeStackScreenProps<LotbaStackParamList, Route>;

const Stack = createNativeStackNavigator<LotbaStackParamList>();

const C = {
  purple: '#342783',
  purpleText: '#382D7F',
  white: '#FFFFFF',
  border: '#AAA8B8',
  muted: '#777485',
  disabled: '#C9C6CE',
  green: '#39A83C',
  orange: '#E79B24',
  lilac: '#E8DFF4',
  pale: '#F6F2FA',
} as const;

const BACK_HIDDEN_ROUTES = new Set([
  'Splash',
  'Onboarding1',
  'Onboarding2',
  'Onboarding3',
  'Onboarding4',
  'Onboarding5',
  'Landing',
  'Register',
  'Login',
  'Recover',
  'EmailConfirmation',
  'RegistrationSuccess',
  'ResponsibleSetup',
  'DevicePermission',
  'VpnConsent',
  'ProtectedCode',
  'ResponsibleHome',
  'History',
  'Profile',
  'ProtectionSetup',
  'ProtectionComplete',
]);

function Page({
  title,
  children,
  bottom,
  scroll = true,
}: {
  title?: string;
  children: React.ReactNode;
  bottom?: React.ReactNode;
  scroll?: boolean;
}) {
  const navigation = useNavigation();
  const routeName = useRoute().name;
  const showBack = !BACK_HIDDEN_ROUTES.has(routeName);
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeRoot}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            onPress={() => navigation.goBack()}
            style={styles.headerBack}
          >
            <ArrowLeft color={C.white} size={22} />
          </Pressable>
        ) : (
          <View style={styles.headerBack} />
        )}
        <Text style={styles.brandTitle}>BA Protege+</Text>
        <View style={styles.headerBack} />
      </View>
      {scroll ? (
        <ScrollView
          style={styles.pageBody}
          contentContainerStyle={styles.bodyContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {title ? <Text style={styles.pageTitle}>{title}</Text> : null}
          {children}
        </ScrollView>
      ) : (
        <View style={styles.pageBody}>
          {title ? <Text style={styles.pageTitle}>{title}</Text> : null}
          {children}
        </View>
      )}
      {bottom}
    </SafeAreaView>
  );
}

function Button({
  label,
  onPress,
  disabled = false,
  outline = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  outline?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        outline && styles.outlineButton,
        disabled && styles.disabledButton,
      ]}
    >
      <Text style={[styles.buttonText, outline && styles.outlineButtonText]}>
        {label}
      </Text>
    </Pressable>
  );
}

function CheckOption({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      style={styles.checkOption}
    >
      <View style={[styles.checkbox, value && styles.checkedBox]}>
        {value ? <Check color={C.white} size={13} strokeWidth={3} /> : null}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </Pressable>
  );
}

function Field({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  placeholder,
  maxLength,
  showPencil = false,
}: {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'number-pad';
  placeholder?: string;
  maxLength?: number;
  showPencil?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<TextInputInstance | null>(null);
  return (
    <View style={styles.fieldWrap}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <View style={styles.fieldRow}>
        <TextInput
          ref={inputRef}
          accessibilityLabel={label ?? placeholder}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
          autoCorrect={false}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8B8991"
          returnKeyType="next"
          secureTextEntry={secureTextEntry && !visible}
          style={styles.input}
          value={value}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onPress={() => setVisible(current => !current)}
            style={styles.passwordToggle}
          >
            {visible ? (
              <EyeOff color={C.purpleText} size={14} />
            ) : (
              <Eye color={C.purpleText} size={14} />
            )}
          </Pressable>
        ) : null}
        {showPencil ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Editar ${label}`}
            onPress={() => inputRef.current?.focus()}
            style={styles.passwordToggle}
          >
            <Pencil color={C.purpleText} size={14} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function PinEntry({
  value,
  onChangeText,
  accessibilityLabel,
  masked = false,
}: {
  value: string;
  onChangeText: (value: string) => void;
  accessibilityLabel: string;
  masked?: boolean;
}) {
  const inputRef = useRef<TextInputInstance | null>(null);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ingresar ${accessibilityLabel}`}
      onPress={() => inputRef.current?.focus()}
      style={styles.pinRow}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <View key={index} style={styles.pinCell}>
          <Text style={styles.pinDigit}>
            {value[index] ? (masked ? '*' : value[index]) : ''}
          </Text>
        </View>
      ))}
      <TextInput
        ref={inputRef}
        accessibilityLabel={accessibilityLabel}
        keyboardType="number-pad"
        maxLength={5}
        onChangeText={text => onChangeText(text.replace(/\D/g, ''))}
        style={styles.pinInputOverlay}
        value={value}
      />
    </Pressable>
  );
}

function BottomTabs({
  active,
  onHome,
  onHistory,
  onProfile,
}: {
  active: 'home' | 'history' | 'profile';
  onHome: () => void;
  onHistory: () => void;
  onProfile: () => void;
}) {
  return (
    <View style={styles.tabs}>
      <Tab
        icon={<Home size={17} color={C.white} />}
        label="Home"
        active={active === 'home'}
        onPress={onHome}
      />
      <Tab
        icon={<Clock3 size={17} color={C.white} />}
        label="Historial"
        active={active === 'history'}
        onPress={onHistory}
      />
      <Tab
        icon={<UserRound size={17} color={C.white} />}
        label="Perfil"
        active={active === 'profile'}
        onPress={onProfile}
      />
    </View>
  );
}

function Tab({
  icon,
  label,
  active,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={styles.tab}
    >
      {icon}
      <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>{label}</Text>
    </Pressable>
  );
}

function SplashScreen({ navigation }: ScreenProps<'Splash'>) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Onboarding1'), 900);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.splashRoot}>
      <StatusBar barStyle="light-content" />
      <LotbaBrandMark size={176} />
      <Text style={styles.splashText}>BA Protege+</Text>
    </SafeAreaView>
  );
}

function LandingScreen({ navigation }: ScreenProps<'Landing'>) {
  return (
    <Page scroll={false}>
      <View style={styles.landingBody}>
        <LotbaBrandMark size={176} />
        <Text style={styles.landingTitle}>Protección Digital{'\n'}Para Tu Familia</Text>
        <View style={styles.landingActions}>
          <Button label="Inicio de sesión" onPress={() => navigation.navigate('Login')} />
          <Button
            label="Registrarse"
            outline
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      </View>
    </Page>
  );
}

function OnboardingScreen({
  navigation,
  step,
}: {
  navigation: FlowNavigator;
  step: 1 | 2 | 3 | 4 | 5;
}) {
  const titles = [
    'Navegación más segura para tus hijos',
    '1. Registrate',
    '2. Configurá el modo responsable',
    '3. Instalá la aplicación en el dispositivo del menor',
    '4. Vinculá el dispositivo con la clave de acceso',
  ];
  const subtitles = [
    'Control parental para prevenir el acceso a sitios de apuestas ilegales y otros contenidos riesgosos.',
    'Creá tu cuenta para empezar a proteger a tus hijos.',
    'Elegí el modo responsable para gestionar la protección de tus hijos.',
    'Descargá BA Protege+ en el dispositivo que usarán tus hijos.',
    'Ingresá la clave para vincular el dispositivo del menor.',
  ];
  const bullets = [
    [],
    ['Es rápido y seguro', 'Podés ser el responsable', 'Gestioná todos tus dispositivos.'],
    ['Activá el VPN y configurá tu celular', 'Bloqueá sitios de apuestas ilegales', 'Recibí alertas de actividad'],
    [],
    ['Configurá el dispositivo del menor en Modo Protegido para que tu hijo no pueda desinstalar BA Protege+.'],
  ];
  const next = () => {
    if (step === 1) navigation.navigate('Onboarding2');
    else if (step === 2) navigation.navigate('Onboarding3');
    else if (step === 3) navigation.navigate('Onboarding4');
    else if (step === 4) navigation.navigate('Onboarding5');
    else navigation.navigate('Landing');
  };
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.onboardingRoot}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.onboardingScroll}
        contentContainerStyle={styles.onboardingTop}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 ? (
          <>
            <Text style={styles.onboardingBrand}>BA Protege+</Text>
            <LotbaBrandMark size={168} />
          </>
        ) : null}
        <Text style={[styles.onboardingTitle, step > 1 && styles.compactOnboardingTitle]}>
          {titles[step - 1]}
        </Text>
        <Text style={styles.onboardingSubtitle}>{subtitles[step - 1]}</Text>
        {step > 1 ? (
          <OnboardingArtwork
            kind={
              step === 2
                ? 'register'
                : step === 3
                  ? 'responsible'
                  : step === 4
                    ? 'install'
                    : 'access'
            }
          />
        ) : null}
        {step === 4 ? (
          <View style={styles.androidStoreRow}>
            <View style={styles.androidMark}>
              <View style={styles.androidAntennaLeft} />
              <View style={styles.androidAntennaRight} />
              <View style={styles.androidHead}>
                <View style={styles.androidEye} />
                <View style={styles.androidEye} />
              </View>
              <View style={styles.androidBody} />
            </View>
            <Text style={styles.onboardingBulletText}>Disponible en Google Play</Text>
          </View>
        ) : null}
        <View style={styles.onboardingBulletList}>
          {bullets[step - 1].map(bullet => (
            <OnboardingBullet key={bullet} text={bullet} />
          ))}
        </View>
      </ScrollView>
      <View style={styles.onboardingActions}>
        <Button label="Siguiente" onPress={next} />
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Landing')}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Omitir</Text>
        </Pressable>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${step * 20}%` }]} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function OnboardingBullet({ text }: { text: string }) {
  return (
    <View style={styles.onboardingBullet}>
      <View style={styles.bulletCheck}>
        <Check color={C.white} size={11} strokeWidth={3} />
      </View>
      <Text style={styles.onboardingBulletText}>{text}</Text>
    </View>
  );
}

function RegisterScreen({ navigation }: ScreenProps<'Register'>) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const canContinue =
    name.trim().length > 0 &&
    surname.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length > 0;
  return (
    <Page title="Creá tu cuenta">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Field placeholder="Nombre" value={name} onChangeText={setName} />
        <Field placeholder="Apellido" value={surname} onChangeText={setSurname} />
        <Field
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Field
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <CheckOption
          label="Acepto términos y condiciones"
          value={accepted}
          onChange={setAccepted}
        />
        <View style={styles.formActions}>
          <Button
            label="Confirmar"
            disabled={!canContinue}
            onPress={() =>
              navigation.navigate('EmailConfirmation', { email: email.trim() })
            }
          />
          <Button
            label="Cancelar"
            outline
            onPress={() => navigation.navigate('Landing')}
          />
        </View>
      </KeyboardAvoidingView>
    </Page>
  );
}

function EmailConfirmationScreen({
  navigation,
  route,
}: ScreenProps<'EmailConfirmation'>) {
  const [code, setCode] = useState('');
  const ready = code.length === 5;
  return (
    <Page title="Confirmación de cuenta">
      <View style={styles.mailHero}>
        <Mail color={C.purple} size={28} strokeWidth={1.8} />
      </View>
      <Text style={styles.mailTitle}>¡Revisá tu correo!</Text>
      <Text style={styles.mailMessage}>
        Te enviamos un mail para confirmar tu cuenta. Recordá revisar el spam o correo no deseado.
      </Text>
      <Text style={styles.pinLabel}>Ingresá el código que te enviamos</Text>
      <PinEntry
        accessibilityLabel="Código de confirmación"
        value={code}
        onChangeText={setCode}
      />
      <View style={styles.formActions}>
        <Button
          label="Confirmar"
          disabled={!ready}
          onPress={() => navigation.navigate('RegistrationSuccess')}
        />
        <Button label="Cancelar" outline onPress={() => navigation.goBack()} />
      </View>
      <Text style={styles.emailHint}>{route.params.email}</Text>
    </Page>
  );
}

function RegistrationSuccessScreen({ navigation }: ScreenProps<'RegistrationSuccess'>) {
  return (
    <Page title="Confirmación de cuenta">
      <View style={styles.successHero}>
        <Check color={C.green} size={32} strokeWidth={3} />
      </View>
      <Text style={styles.successMessage}>Te has registrado exitosamente.</Text>
      <View style={styles.formActions}>
        <Button label="Continuar" onPress={() => navigation.navigate('UsageMode')} />
      </View>
    </Page>
  );
}

function LoginScreen({ navigation }: ScreenProps<'Login'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const canContinue = email.includes('@') && password.length > 0;
  return (
    <Page title="Iniciar sesión">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Field
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Field
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <CheckOption
          label="Recordar contraseña"
          value={remember}
          onChange={setRemember}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Recover', { email })}
          style={styles.textLinkWrap}
        >
          <Text style={styles.textLink}>¿Olvidaste tu contraseña?</Text>
        </Pressable>
        <View style={styles.formActions}>
          <Button
            label="Iniciar sesión"
            disabled={!canContinue}
            onPress={() => navigation.navigate('UsageMode')}
          />
          <Button
            label="Cancelar"
            outline
            onPress={() => navigation.navigate('Landing')}
          />
        </View>
      </KeyboardAvoidingView>
    </Page>
  );
}

function RecoverScreen({ navigation, route }: ScreenProps<'Recover'>) {
  const email = route.params?.email || 'usuario@example.com';
  return (
    <Page title="Recuperar contraseña">
      <View style={styles.mailHero}>
        <Mail color={C.purple} size={28} strokeWidth={1.8} />
      </View>
      <Text style={styles.mailTitle}>¡Revisá tu correo!</Text>
      <Text style={styles.mailMessage}>
        Te enviamos un mail para recuperar tu contraseña. Recordá revisar el spam o correo no deseado.
      </Text>
      <Text style={styles.emailHint}>{email}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('Login')}
        style={styles.recoverLink}
      >
        <Text style={styles.textLink}>¿Recordaste tu contraseña?</Text>
      </Pressable>
      <View style={styles.formActions}>
        <Button label="Confirmar" onPress={() => navigation.navigate('Login')} />
      </View>
    </Page>
  );
}

function UsageModeScreen({ navigation }: ScreenProps<'UsageMode'>) {
  return (
    <Page
      title="Modo de uso"
      bottom={
        <BottomTabs
          active="home"
          onHome={() => navigation.navigate('UsageMode')}
          onHistory={() => navigation.navigate('History')}
          onProfile={() => navigation.navigate('Profile')}
        />
      }
    >
      <Text style={styles.modeDescription}>
        Elegí cómo querés que funcione la protección para tu familia.
      </Text>
      <ModeTile
        title="Modo Responsable"
        subtitle="Gestioná la protección de tus hijos."
        color={C.purple}
        icon={<Shield color={C.white} size={19} />}
        onPress={() => navigation.navigate('ResponsibleSetup')}
      />
      <ModeTile
        title="Modo Protegido"
        subtitle="Ingresá el código de acceso de tu responsable."
        color={C.green}
        icon={<LockKeyhole color={C.white} size={19} />}
        onPress={() => navigation.navigate('ProtectedCode')}
      />
    </Page>
  );
}

function ModeTile({
  color,
  icon,
  title,
  subtitle,
  onPress,
}: {
  color: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.modeTile, { backgroundColor: color }]}
    >
      <View style={styles.modeTileIcon}>{icon}</View>
      <View style={styles.modeTileText}>
        <Text style={styles.modeTileTitle}>{title}</Text>
        <Text style={styles.modeTileSubtitle}>{subtitle}</Text>
      </View>
      <ChevronRight color={C.white} size={18} />
    </Pressable>
  );
}

function ResponsibleSetupScreen({ navigation }: ScreenProps<'ResponsibleSetup'>) {
  const [accepted, setAccepted] = useState(false);
  return (
    <Page title="Configuración Responsable">
      <Text style={styles.centerSubtitle}>Bloqueá sitios de información sobre juegos de azar</Text>
      <View style={styles.noticeCard}>
        <Text style={styles.smallText}>
          Actualmente incluimos una lista de 2443 sitios de información sobre juegos de azar. El
          propósito principal de estos sitios es informar al usuario sobre servicios de juego y
          publicitarios. Podés optar por incluir estos sitios en su restricción marcando la casilla
          a continuación. Tené en cuenta que esta es solo una pequeña selección de los sitios con
          mayor tráfico de este tipo.
        </Text>
        <CheckOption
          label="Acepto términos y condiciones"
          value={accepted}
          onChange={setAccepted}
        />
      </View>
      <View style={styles.formActions}>
        <Button
          label="Siguiente"
          disabled={!accepted}
          onPress={() => navigation.navigate('DevicePermission')}
        />
        <Button label="Atrás" outline onPress={() => navigation.goBack()} />
      </View>
    </Page>
  );
}

function DevicePermissionScreen({ navigation }: ScreenProps<'DevicePermission'>) {
  const [accepted, setAccepted] = useState(false);
  return (
    <Page title="Configuración Responsable">
      <Text style={styles.centerSubtitle}>Permiso de Responsable del dispositivo</Text>
      <View style={styles.noticeCard}>
        <Text style={styles.smallText}>
          Este permiso es necesario para evitar que la aplicación se elimine durante un período de
          bloqueo seleccionado y para proteger a los usuarios de los daños del juego. Mientras el
          permiso esté activo no se podrá desinstalar la aplicación, desactivar el permiso de
          responsable ni modificar configuraciones que permitan eliminarla. Una vez finalizado el
          período de bloqueo, la aplicación permitirá quitar el permiso si lo deseás.
          {'\n\n'}Si no concedés este permiso, la aplicación no funcionará.
        </Text>
        <CheckOption
          label="Quiero activar el permiso de responsable del dispositivo."
          value={accepted}
          onChange={setAccepted}
        />
      </View>
      <View style={styles.formActions}>
        <Button
          label="Siguiente"
          disabled={!accepted}
          onPress={() => navigation.navigate('ProtectionSummary')}
        />
        <Button label="Atrás" outline onPress={() => navigation.goBack()} />
      </View>
    </Page>
  );
}

function ProtectionSummaryScreen({ navigation }: ScreenProps<'ProtectionSummary'>) {
  const points = [
    'Has elegido bloquear 2443 sitios de información sobre juegos de azar.',
    'Has aceptado que la aplicación no se elimine durante el período de bloqueo.',
    'Has permitido acceso para utilizar el VPN local.',
    'Acepta los términos y condiciones, la política de privacidad y la licencia de usuario.',
  ];
  return (
    <Page title="Configuración Responsable">
      <Text style={styles.centerSubtitle}>Activar control parental</Text>
      <View style={styles.noticeCard}>
        {points.map(point => (
          <Text key={point} style={styles.bulletText}>•  {point}</Text>
        ))}
      </View>
      <Button
        label="Activar protección"
        onPress={() => navigation.navigate('VpnConsent')}
      />
    </Page>
  );
}

function VpnConsentScreen({ navigation }: ScreenProps<'VpnConsent'>) {
  const [accepted, setAccepted] = useState(false);
  return (
    <Page title="Configuración Responsable">
      <Text style={styles.centerSubtitle}>Activar VPN</Text>
      <View style={styles.noticeCard}>
        <Text style={styles.smallText}>
          Esta aplicación utiliza una VPN local para aplicar su bloqueo. No podrás utilizar otras
          VPN mientras una tenga una restricción activa. Por favor, permite que esta aplicación
          configure una conexión VPN.
        </Text>
        <CheckOption
          label="Acepto términos y condiciones"
          value={accepted}
          onChange={setAccepted}
        />
      </View>
      <View style={styles.formActions}>
        <Button
          label="Siguiente"
          disabled={!accepted}
          onPress={() => navigation.navigate('ResponsibleHome')}
        />
        <Button label="Atrás" outline onPress={() => navigation.goBack()} />
      </View>
    </Page>
  );
}

function ResponsibleHomeScreen({ navigation }: ScreenProps<'ResponsibleHome'>) {
  return (
    <Page
      title="Modo Responsable"
      scroll={false}
      bottom={
        <BottomTabs
          active="home"
          onHome={() => navigation.navigate('ResponsibleHome')}
          onHistory={() => navigation.navigate('History')}
          onProfile={() => navigation.navigate('Profile')}
        />
      }
    >
      <View style={styles.homeActions}>
        <HomeCard
          icon={<LockKeyhole color={C.purple} size={22} />}
          title="Bloquear Sitios"
          subtitle="Bloqueá sitios incluidos en la lista de bloqueo."
          color={C.purple}
          onPress={() => navigation.navigate('BlockedSites')}
        />
        <HomeCard
          icon={<RefreshCw color={C.purple} size={22} />}
          title="Vincular Dispositivos"
          subtitle="Vinculá uno o más dispositivos para protegerlos."
          color={C.green}
          onPress={() => navigation.navigate('Devices')}
        />
        <HomeCard
          icon={<ListChecks color={C.purple} size={22} />}
          title="Configuración"
          subtitle="Configurá el control parental del modo responsable."
          color={C.purple}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
    </Page>
  );
}

function HomeCard({
  icon,
  title,
  subtitle,
  color,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.homeCard, { backgroundColor: color }]}
    >
      <View style={styles.homeIcon}>{icon}</View>
      <View style={styles.homeCardText}>
        <Text style={styles.homeCardTitle}>{title}</Text>
        <Text style={styles.homeCardSubtitle}>{subtitle}</Text>
      </View>
      <ChevronRight color={C.white} size={19} />
    </Pressable>
  );
}

function HistoryScreen({ navigation }: ScreenProps<'History'>) {
  const entries = [
    ['11-09-26', 'El dispositivo Celular de Cami intentó ingresar a www.aposta.com'],
    ['27-10-26', 'El dispositivo Celular de Cami fue vinculado.'],
    ['13-10-26', 'El dispositivo Notebook de mamá ha sido desvinculado.'],
    ['22-09-26', 'El dispositivo Tablet de Nico intentó desinstalar la aplicación BA Protege+.'],
  ];
  return (
    <Page
      title="Historial"
      bottom={
        <BottomTabs
          active="history"
          onHome={() => navigation.navigate('ResponsibleHome')}
          onHistory={() => navigation.navigate('History')}
          onProfile={() => navigation.navigate('Profile')}
        />
      }
    >
      <Text style={styles.centerSubtitle}>Registro de actividad reciente de los dispositivos protegidos.</Text>
      <View style={styles.historyList}>
        {entries.map(([date, description], index) => (
          <View key={date} style={styles.historyEntry}>
            {index === 0 ? <View style={styles.unreadDot} /> : null}
            <Text style={styles.historyDate}>{date}</Text>
            <Text style={styles.historyText}>{description}</Text>
          </View>
        ))}
      </View>
    </Page>
  );
}

function ProfileScreen({ navigation }: ScreenProps<'Profile'>) {
  const [name, setName] = useState('Usuario');
  const [surname, setSurname] = useState('Demo');
  const [email, setEmail] = useState('usuario@example.com');
  const [password, setPassword] = useState('clave123');
  const [code, setCode] = useState('12345');
  const [saved, setSaved] = useState(false);
  return (
    <Page
      title="Perfil"
      bottom={
        <BottomTabs
          active="profile"
          onHome={() => navigation.navigate('ResponsibleHome')}
          onHistory={() => navigation.navigate('History')}
          onProfile={() => navigation.navigate('Profile')}
        />
      }
    >
      <Field
        label="Nombre"
        value={name}
        onChangeText={setName}
        showPencil
      />
      <Field
        label="Apellido"
        value={surname}
        onChangeText={setSurname}
        showPencil
      />
      <Field
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        showPencil
      />
      <Field
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        showPencil
      />
      <Field
        label="Código de acceso"
        value={code}
        onChangeText={setCode}
        secureTextEntry
        showPencil
      />
      <Button
        label={saved ? 'Confirmado' : 'Confirmar'}
        onPress={() => setSaved(true)}
      />
      <Button
        label="Cancelar"
        outline
        onPress={() => navigation.navigate('UsageMode')}
      />
    </Page>
  );
}

function SettingsScreen({ navigation }: ScreenProps<'Settings'>) {
  const [allowSites, setAllowSites] = useState(true);
  const [protection, setProtection] = useState(true);
  return (
    <Page title="Configuración">
      <Text style={styles.centerSubtitle}>Configuración Responsable</Text>
      <View style={styles.settingRow}>
        <View style={styles.settingText}>
          <Text style={styles.cardTitle}>Bloqueo de sitios</Text>
          <Text style={styles.cardDescription}>Protección de sitios de juegos de azar</Text>
        </View>
        <Switch value={protection} onValueChange={setProtection} trackColor={{ true: C.green }} />
      </View>
      <View style={styles.settingRow}>
        <View style={styles.settingText}>
          <Text style={styles.cardTitle}>Lista de información</Text>
          <Text style={styles.cardDescription}>Incluir sitios informativos relacionados</Text>
        </View>
        <Switch value={allowSites} onValueChange={setAllowSites} trackColor={{ true: C.green }} />
      </View>
      <Button label="Volver" outline onPress={() => navigation.goBack()} />
    </Page>
  );
}

function BlockedSitesScreen({ navigation }: ScreenProps<'BlockedSites'>) {
  return (
    <Page title="Bloquear Sitios">
      <Text style={styles.centerSubtitle}>Sitios de información sobre juegos de azar</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('CustomList')}
        style={styles.listOption}
      >
        <View style={styles.listOptionIcon}><ListChecks color={C.purple} size={21} /></View>
        <Text style={styles.listOptionText}>Lista Personalizada</Text>
        <ChevronRight color={C.purple} size={18} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('Blacklist')}
        style={styles.listOption}
      >
        <View style={styles.listOptionIcon}><Shield color={C.purple} size={21} /></View>
        <Text style={styles.listOptionText}>Lista Negra</Text>
        <ChevronRight color={C.purple} size={18} />
      </Pressable>
    </Page>
  );
}

function CustomListScreen({ navigation }: ScreenProps<'CustomList'>) {
  const [enabled, setEnabled] = useState(true);
  return (
    <Page title="Lista Personalizada">
      <Text style={styles.paragraph}>Elegí si querés bloquear sitios de información sobre juegos de azar.</Text>
      <View style={styles.settingRow}>
        <View style={styles.settingText}>
          <Text style={styles.cardTitle}>Sitios informativos</Text>
          <Text style={styles.cardDescription}>2443 sitios incluidos en la lista.</Text>
        </View>
        <Switch value={enabled} onValueChange={setEnabled} trackColor={{ true: C.green }} />
      </View>
      <Button label="Confirmar" onPress={() => navigation.goBack()} />
    </Page>
  );
}

function BlacklistScreen({ navigation }: ScreenProps<'Blacklist'>) {
  const [site, setSite] = useState('');
  const [sites, setSites] = useState(['www.aposta.com', 'casino.example']);
  const addSite = () => {
    const value = site.trim();
    if (!value) return;
    setSites(current => [value, ...current]);
    setSite('');
  };
  return (
    <Page title="Lista Negra">
      <Text style={styles.paragraph}>Administrá los sitios bloqueados manualmente.</Text>
      <Field placeholder="Dirección del sitio" value={site} onChangeText={setSite} />
      <Button label="Agregar sitio" disabled={!site.trim()} onPress={addSite} />
      <Text style={styles.sectionHeading}>Sitios bloqueados ({sites.length})</Text>
      {sites.map((item, index) => (
        <View key={`${item}-${index}`} style={styles.siteRow}>
          <Text style={styles.siteText}>{item}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Quitar ${item}`}
            onPress={() => setSites(current => current.filter((_, siteIndex) => siteIndex !== index))}
          >
            <Text style={styles.removeSite}>Quitar</Text>
          </Pressable>
        </View>
      ))}
    </Page>
  );
}

function DevicesScreen({ navigation }: ScreenProps<'Devices'>) {
  const devices = [
    { name: 'Celular de Cami', icon: <Smartphone color={C.purple} size={20} /> },
    { name: 'Tablet de Nico', icon: <Tablet color={C.purple} size={20} /> },
    { name: 'Notebook de mamá', icon: <Laptop color={C.purple} size={20} /> },
  ];
  return (
    <Page title="Vincular Dispositivos">
      {devices.map(device => (
        <View key={device.name} style={styles.deviceRow}>
          <View style={styles.deviceIcon}>{device.icon}</View>
          <Text style={styles.deviceName}>{device.name}</Text>
          <Text style={styles.deviceStatus}>Vinculado</Text>
        </View>
      ))}
      <Button
        label="Vincular nuevo dispositivo"
        onPress={() => navigation.navigate('LinkDeviceGuide')}
      />
    </Page>
  );
}

function LinkDeviceGuideScreen({ navigation }: ScreenProps<'LinkDeviceGuide'>) {
  return (
    <Page title="Vincular dispositivo">
      <View style={styles.guideIcon}>
        <Smartphone color={C.purple} size={46} />
      </View>
      <Text style={styles.paragraph}>
        Para vincular un equipo, instalá BA Protege+ en el dispositivo y seguí las instrucciones de configuración.
      </Text>
      <View style={styles.noticeCard}>
        <Text style={styles.smallText}>
          Asegurate de tener ambos dispositivos disponibles. Una vez vinculado, aparecerá en tu lista de dispositivos.
        </Text>
      </View>
      <Button label="Aceptar" onPress={() => navigation.goBack()} />
    </Page>
  );
}

function ProtectedCodeScreen({ navigation }: ScreenProps<'ProtectedCode'>) {
  const [code, setCode] = useState('');
  const [messageVisible, setMessageVisible] = useState(false);
  const ready = code.length === 5;
  return (
    <Page title="Modo Protegido">
      <Text style={styles.noticeTitle}>¡Revisá tus notificaciones!</Text>
      <Text style={styles.noticeSubtitle}>Ingresá el código de acceso que te enviamos al dispositivo del responsable.</Text>
      <PinEntry
        accessibilityLabel="Código de acceso"
        value={code}
        onChangeText={setCode}
        masked
      />
      <Pressable
        accessibilityRole="button"
        onPress={() => setMessageVisible(true)}
        style={styles.textLinkWrap}
      >
        <Text style={styles.textLink}>Si no recibiste el código, hacé click aquí.</Text>
      </Pressable>
      {messageVisible ? <Text style={styles.inlineNotice}>Revisá las notificaciones de tu dispositivo responsable.</Text> : null}
      <View style={styles.formActions}>
        <Button
          label="Confirmar"
          disabled={!ready}
          onPress={() =>
            navigation.navigate('ProtectionSetup', { step: 1, accessCode: code })
          }
        />
        <Button label="Cancelar" outline onPress={() => navigation.goBack()} />
      </View>
    </Page>
  );
}

type ProtectionStep = {
  subtitle: string;
  description?: string;
  warning?: string;
  instructions: string[];
  help: boolean;
};

const protectionSteps: ProtectionStep[] = [
  {
    subtitle: 'Activá la accesibilidad',
    instructions: [
      'Abrí la sección Aplicaciones descargadas.',
      'Seleccioná BA Protege+.',
      'Habilitá la aplicación marcando la casilla.',
      'Aceptar.',
    ],
    help: true,
  },
  {
    subtitle: 'Fijá BA Protege+ en el dispositivo del menor.',
    description: 'De esta manera el menor no podrá apagar la aplicación.',
    instructions: [
      'Ve al menú Aceleración.',
      'Seleccioná la sección Aplicaciones Fijadas.',
      'Habilitá la opción BA Protege+.',
      'Aceptar.',
    ],
    help: true,
  },
  {
    subtitle: 'Activá el inicio automático',
    description:
      'Para bloquear los sitios de apuestas ilegales en cualquier momento.',
    instructions: [
      'Encuentra y activa BA Protege+ en el dispositivo.',
    ],
    help: true,
  },
  {
    subtitle: 'Activá la protección contra eliminación.',
    description: 'Para evitar que el menor borre accidentalmente la app.',
    instructions: [
      'Pulsá el botón Activar la app de administrador.',
      'Marcá la casilla y pulsá aceptar.',
    ],
    help: true,
  },
  {
    subtitle: 'Permitir notificaciones',
    description:
      'Para mantener informado sobre todos los cambios y actividades de los dispositivos vinculados.',
    instructions: [],
    help: false,
  },
  {
    subtitle: 'Permitir trabajar en segundo plano',
    description: 'Para reducir el gasto de batería',
    instructions: [
      'Seleccioná y activá la opción Sin restricciones.',
    ],
    help: true,
  },
  {
    subtitle: 'Establecé un nuevo código de acceso de cinco dígitos',
    description:
      'Para que puedas desbloquear fácilmente el dispositivo del menor si es necesario.',
    warning:
      'No uses combinaciones simples como “1234” o una fecha de nacimiento, dado que podría descifrarse fácilmente.',
    instructions: [],
    help: false,
  },
  {
    subtitle: 'Repetí el código de acceso',
    description:
      'Para que puedas desbloquear fácilmente el dispositivo del menor si es necesario.',
    warning:
      'No uses combinaciones simples como “1234” o una fecha de nacimiento, dado que podría descifrarse fácilmente.',
    instructions: [],
    help: false,
  },
];

function ProtectionSetupScreen({
  navigation,
  route,
}: ScreenProps<'ProtectionSetup'>) {
  const { step, accessCode, newCode } = route.params;
  const currentStep = Math.min(Math.max(step, 1), protectionSteps.length);
  const details = protectionSteps[currentStep - 1];
  const [code, setCode] = useState('');
  const [helpVisible, setHelpVisible] = useState(false);
  const ready =
    code.length === 5 && (currentStep !== 8 || code === newCode);
  const isCodeStep = currentStep >= 7;

  const continueSetup = () => {
    if (currentStep === 7) {
      navigation.push('ProtectionSetup', {
        step: 8,
        accessCode,
        newCode: code,
      });
      return;
    }

    if (currentStep === 8) {
      navigation.navigate('ProtectionComplete');
      return;
    }

    navigation.push('ProtectionSetup', {
      step: currentStep + 1,
      accessCode,
      newCode,
    });
  };

  return (
    <Page title="Configurar Protección">
      <Text style={styles.protectionStepTitle}>{details.subtitle}</Text>
      {details.description && !isCodeStep ? (
        <Text style={styles.protectionStepDescription}>{details.description}</Text>
      ) : null}
      {isCodeStep ? (
        <>
          {details.description ? (
            <Text style={styles.protectionStepDescription}>
              {details.description}
            </Text>
          ) : null}
          <PinEntry
            accessibilityLabel={
              currentStep === 7 ? 'Nuevo código de acceso' : 'Repetir código de acceso'
            }
            value={code}
            onChangeText={setCode}
            masked
          />
          {details.warning ? (
            <Text style={styles.protectionWarning}>{details.warning}</Text>
          ) : null}
        </>
      ) : details.instructions.length > 0 ? (
        <View style={styles.protectionInstructions}>
          {details.instructions.map((instruction, index) => (
            <Text key={instruction} style={styles.protectionInstruction}>
              {index + 1}. {instruction}
            </Text>
          ))}
          {details.help ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setHelpVisible(value => !value)}
              style={styles.protectionHelpButton}
            >
              <Text style={styles.protectionHelpText}>Ver el video de ayuda.</Text>
            </Pressable>
          ) : null}
          {helpVisible ? (
            <Text style={styles.inlineNotice}>
              Seguí estos pasos en los ajustes del dispositivo.
            </Text>
          ) : null}
        </View>
      ) : null}
      {currentStep < 7 ? (
        <View style={styles.formActions}>
          <Button
            label={currentStep === 5 ? 'Permitir' : 'Siguiente'}
            onPress={continueSetup}
          />
          <Button label="Atrás" outline onPress={() => navigation.goBack()} />
        </View>
      ) : (
        <View style={styles.formActions}>
          <Button
            label="Confirmar"
            disabled={!ready}
            onPress={continueSetup}
          />
          <Button
            label="Cancelar"
            outline
            onPress={() => navigation.navigate('UsageMode')}
          />
        </View>
      )}
    </Page>
  );
}

function ProtectionCompleteScreen({
  navigation,
}: ScreenProps<'ProtectionComplete'>) {
  return (
    <Page>
      <View style={styles.successHero}>
        <Check color={C.green} size={32} strokeWidth={3} />
      </View>
      <Text style={styles.protectionCompleteTitle}>
        Ahora podés gestionar el bloqueo de sitios de apuestas ilegales en el dispositivo del menor.
      </Text>
      <Text style={styles.successMessage}>
        BA Protege+ se mantendrá en el dispositivo del adulto y bloqueará los sitios de apuestas y juegos ilegales en el dispositivo del menor.
      </Text>
      <View style={styles.formActions}>
        <Button
          label="Terminar configuración"
          onPress={() => navigation.navigate('ProtectedHome')}
        />
      </View>
    </Page>
  );
}

function ProtectedHomeScreen({ navigation }: ScreenProps<'ProtectedHome'>) {
  const [unlocked, setUnlocked] = useState(false);
  return (
    <Page title="Modo Protegido">
      <View style={styles.protectedCard}>
        <Shield color={C.white} size={36} />
        <Text style={styles.protectedTitle}>Dispositivo protegido</Text>
        <Text style={styles.protectedCaption}>La protección está activa en este dispositivo.</Text>
      </View>
      <Button
        label={unlocked ? 'Protección activa' : 'Ver estado de protección'}
        onPress={() => setUnlocked(true)}
      />
      <Button label="Cancelar" outline onPress={() => navigation.popToTop()} />
    </Page>
  );
}

export default function LotbaFlowApp() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: C.white },
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding1">
            {props => <OnboardingScreen {...props} step={1} />}
          </Stack.Screen>
          <Stack.Screen name="Onboarding2">
            {props => <OnboardingScreen {...props} step={2} />}
          </Stack.Screen>
          <Stack.Screen name="Onboarding3">
            {props => <OnboardingScreen {...props} step={3} />}
          </Stack.Screen>
          <Stack.Screen name="Onboarding4">
            {props => <OnboardingScreen {...props} step={4} />}
          </Stack.Screen>
          <Stack.Screen name="Onboarding5">
            {props => <OnboardingScreen {...props} step={5} />}
          </Stack.Screen>
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="EmailConfirmation" component={EmailConfirmationScreen} />
          <Stack.Screen name="RegistrationSuccess" component={RegistrationSuccessScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Recover" component={RecoverScreen} />
          <Stack.Screen name="UsageMode" component={UsageModeScreen} />
          <Stack.Screen name="ResponsibleSetup" component={ResponsibleSetupScreen} />
          <Stack.Screen name="DevicePermission" component={DevicePermissionScreen} />
          <Stack.Screen name="ProtectionSummary" component={ProtectionSummaryScreen} />
          <Stack.Screen name="VpnConsent" component={VpnConsentScreen} />
          <Stack.Screen name="ResponsibleHome" component={ResponsibleHomeScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="BlockedSites" component={BlockedSitesScreen} />
          <Stack.Screen name="CustomList" component={CustomListScreen} />
          <Stack.Screen name="Blacklist" component={BlacklistScreen} />
          <Stack.Screen name="Devices" component={DevicesScreen} />
          <Stack.Screen name="LinkDeviceGuide" component={LinkDeviceGuideScreen} />
          <Stack.Screen name="ProtectedCode" component={ProtectedCodeScreen} />
          <Stack.Screen name="ProtectedHome" component={ProtectedHomeScreen} />
          <Stack.Screen name="ProtectionSetup" component={ProtectionSetupScreen} />
          <Stack.Screen name="ProtectionComplete" component={ProtectionCompleteScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashRoot: {
    alignItems: 'center',
    backgroundColor: C.purple,
    flex: 1,
    justifyContent: 'center',
  },
  splashText: {
    color: C.white,
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
  },
  safeRoot: {
    backgroundColor: C.purple,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: C.purple,
    flexDirection: 'row',
    height: 74,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  headerBack: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  brandTitle: {
    color: C.white,
    fontSize: 26,
    fontWeight: '700',
  },
  pageBody: {
    backgroundColor: C.white,
    flex: 1,
  },
  bodyContent: {
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  pageTitle: {
    color: C.purpleText,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: C.purple,
    borderColor: C.purple,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom: 8,
    minHeight: 44,
    paddingHorizontal: 14,
    width: '100%',
  },
  buttonText: {
    color: C.white,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  outlineButton: {
    backgroundColor: C.white,
  },
  outlineButtonText: {
    color: C.purpleText,
  },
  disabledButton: {
    backgroundColor: C.disabled,
    borderColor: C.disabled,
  },
  fieldWrap: {
    marginBottom: 6,
  },
  fieldLabel: {
    color: C.purpleText,
    fontSize: 12,
    marginBottom: 4,
  },
  fieldRow: {
    alignItems: 'center',
    borderColor: C.border,
    borderRadius: 2,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 38,
  },
  input: {
    color: C.purpleText,
    flex: 1,
    fontSize: 13,
    minHeight: 36,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  passwordToggle: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    minWidth: 34,
  },
  passwordToggleText: {
    color: C.muted,
    fontSize: 11,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: C.purpleText,
    borderWidth: 1,
    height: 14,
    justifyContent: 'center',
    marginRight: 7,
    width: 14,
  },
  checkedBox: {
    backgroundColor: C.purple,
  },
  checkOption: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    marginTop: 10,
    minHeight: 26,
  },
  checkLabel: {
    color: C.purpleText,
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
  },
  formActions: {
    marginTop: 18,
  },
  mailHero: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: C.lilac,
    borderRadius: 35,
    height: 70,
    justifyContent: 'center',
    marginBottom: 16,
    width: 70,
  },
  mailTitle: {
    color: C.purpleText,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  mailMessage: {
    color: C.purpleText,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
    textAlign: 'center',
  },
  emailHint: {
    color: C.muted,
    fontSize: 12,
    marginTop: 14,
    textAlign: 'center',
  },
  recoverLink: {
    alignSelf: 'center',
    marginTop: 12,
  },
  successHero: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: C.green,
    borderRadius: 36,
    borderWidth: 3,
    height: 72,
    justifyContent: 'center',
    marginBottom: 16,
    width: 72,
  },
  successMessage: {
    color: C.purpleText,
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 10,
    textAlign: 'center',
  },
  pinLabel: {
    color: C.purpleText,
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  pinRow: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    marginVertical: 8,
    position: 'relative',
    width: '100%',
  },
  pinCell: {
    alignItems: 'center',
    backgroundColor: C.lilac,
    borderColor: C.purple,
    borderRadius: 5,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  pinDigit: {
    color: C.purpleText,
    fontSize: 19,
    fontWeight: '600',
  },
  pinInputOverlay: {
    bottom: 0,
    color: 'transparent',
    height: 44,
    left: 0,
    opacity: 0.02,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
  },
  textLinkWrap: {
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  textLink: {
    color: C.purpleText,
    fontSize: 12,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  paragraph: {
    color: C.purpleText,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
    textAlign: 'center',
  },
  onboardingRoot: {
    backgroundColor: C.white,
    flex: 1,
  },
  onboardingScroll: {
    flex: 1,
  },
  onboardingTop: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  onboardingBrand: {
    color: C.purpleText,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  onboardingTitle: {
    color: C.purpleText,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 23,
    marginTop: 12,
    textAlign: 'center',
  },
  compactOnboardingTitle: {
    fontSize: 16,
    lineHeight: 21,
    marginTop: 20,
  },
  onboardingSubtitle: {
    color: C.purpleText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
    textAlign: 'center',
  },
  onboardingBulletList: {
    alignSelf: 'stretch',
    marginTop: 14,
  },
  onboardingBullet: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginVertical: 7,
  },
  bulletCheck: {
    alignItems: 'center',
    backgroundColor: C.green,
    borderRadius: 8,
    height: 16,
    justifyContent: 'center',
    marginRight: 9,
    marginTop: 1,
    width: 16,
  },
  onboardingBulletText: {
    color: C.purpleText,
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  androidStoreRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 10,
  },
  androidMark: {
    height: 24,
    position: 'relative',
    width: 24,
  },
  androidHead: {
    alignItems: 'center',
    backgroundColor: '#3DDC84',
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
    flexDirection: 'row',
    gap: 5,
    height: 11,
    justifyContent: 'center',
    left: 2,
    position: 'absolute',
    top: 5,
    width: 20,
  },
  androidEye: {
    backgroundColor: C.white,
    borderRadius: 1,
    height: 2,
    width: 2,
  },
  androidBody: {
    backgroundColor: '#3DDC84',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    height: 8,
    left: 4,
    position: 'absolute',
    top: 16,
    width: 16,
  },
  androidAntennaLeft: {
    backgroundColor: '#3DDC84',
    height: 5,
    left: 6,
    position: 'absolute',
    top: 1,
    transform: [{ rotate: '-35deg' }],
    width: 1,
  },
  androidAntennaRight: {
    backgroundColor: '#3DDC84',
    height: 5,
    position: 'absolute',
    right: 6,
    top: 1,
    transform: [{ rotate: '35deg' }],
    width: 1,
  },
  onboardingActions: {
    paddingBottom: 22,
    paddingHorizontal: 20,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipText: {
    color: C.purpleText,
    fontSize: 15,
    fontWeight: '600',
  },
  progressTrack: {
    backgroundColor: C.lilac,
    borderRadius: 3,
    height: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: C.purple,
    height: 4,
  },
  landingBody: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  landingTitle: {
    color: C.purpleText,
    fontSize: 21,
    fontWeight: '600',
    lineHeight: 27,
    marginTop: 6,
    textAlign: 'center',
  },
  landingActions: {
    marginTop: 'auto',
    paddingBottom: 28,
    width: '100%',
  },
  centerSubtitle: {
    color: C.purpleText,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
    textAlign: 'center',
  },
  noticeCard: {
    borderColor: C.border,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
    padding: 16,
  },
  smallText: {
    color: C.purpleText,
    fontSize: 11,
    lineHeight: 15,
  },
  bulletText: {
    color: C.purpleText,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  modeDescription: {
    color: C.purpleText,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 18,
    textAlign: 'center',
  },
  modeTile: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 66,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modeTileIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    marginRight: 10,
    width: 36,
  },
  modeTileText: {
    flex: 1,
  },
  modeTileTitle: {
    color: C.white,
    fontSize: 14,
    fontWeight: '700',
  },
  modeTileSubtitle: {
    color: C.white,
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3,
  },
  cardTitle: {
    color: C.purpleText,
    fontSize: 14,
    fontWeight: '700',
  },
  cardDescription: {
    color: C.purpleText,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 3,
  },
  radio: {
    borderColor: C.border,
    borderRadius: 9,
    borderWidth: 1,
    height: 17,
    marginLeft: 8,
    width: 17,
  },
  radioSelected: {
    backgroundColor: C.purple,
    borderColor: C.purple,
  },
  homeActions: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  homeCard: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 7,
    minHeight: 66,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  homeIcon: {
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    marginRight: 10,
    width: 30,
  },
  homeCardText: {
    flex: 1,
  },
  homeCardTitle: {
    color: C.white,
    fontSize: 13,
    fontWeight: '700',
  },
  homeCardSubtitle: {
    color: C.white,
    fontSize: 10,
    lineHeight: 13,
    marginTop: 2,
  },
  tabs: {
    alignItems: 'center',
    backgroundColor: C.purple,
    flexDirection: 'row',
    justifyContent: 'space-around',
    minHeight: 48,
    paddingBottom: 4,
    paddingTop: 4,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
  },
  tabLabel: {
    color: C.white,
    fontSize: 9,
    marginTop: 2,
  },
  activeTabLabel: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  historyList: {
    borderColor: C.purple,
    borderWidth: 1,
  },
  historyEntry: {
    borderBottomColor: C.purple,
    borderBottomWidth: 1,
    minHeight: 49,
    paddingHorizontal: 9,
    paddingVertical: 7,
    position: 'relative',
  },
  unreadDot: {
    backgroundColor: C.orange,
    borderRadius: 4,
    height: 8,
    position: 'absolute',
    right: 6,
    top: 5,
    width: 8,
  },
  historyDate: {
    color: C.purpleText,
    fontSize: 10,
    marginBottom: 2,
  },
  historyText: {
    color: C.purpleText,
    fontSize: 9,
    lineHeight: 12,
  },
  settingRow: {
    alignItems: 'center',
    borderColor: C.border,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  settingText: {
    flex: 1,
    paddingRight: 10,
  },
  listOption: {
    alignItems: 'center',
    borderColor: C.purple,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    minHeight: 54,
    paddingHorizontal: 10,
  },
  listOptionIcon: {
    alignItems: 'center',
    backgroundColor: C.lilac,
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    marginRight: 10,
    width: 32,
  },
  listOptionText: {
    color: C.purpleText,
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeading: {
    color: C.purpleText,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 18,
  },
  siteRow: {
    alignItems: 'center',
    borderBottomColor: C.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 42,
  },
  siteText: {
    color: C.purpleText,
    flex: 1,
    fontSize: 13,
  },
  removeSite: {
    color: C.purpleText,
    fontSize: 12,
    padding: 8,
    textDecorationLine: 'underline',
  },
  deviceRow: {
    alignItems: 'center',
    borderBottomColor: C.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 52,
  },
  deviceIcon: {
    alignItems: 'center',
    backgroundColor: C.lilac,
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    marginRight: 10,
    width: 34,
  },
  deviceName: {
    color: C.purpleText,
    flex: 1,
    fontSize: 13,
  },
  deviceStatus: {
    color: C.green,
    fontSize: 11,
  },
  guideIcon: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: C.lilac,
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    marginBottom: 14,
    width: 80,
  },
  noticeTitle: {
    color: C.orange,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 28,
    textAlign: 'center',
  },
  noticeSubtitle: {
    color: C.orange,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
    textAlign: 'center',
  },
  codeInput: {
    alignSelf: 'center',
    backgroundColor: C.lilac,
    borderRadius: 10,
    color: C.purpleText,
    fontSize: 23,
    letterSpacing: 12,
    marginTop: 28,
    minHeight: 54,
    paddingLeft: 15,
    textAlign: 'center',
    width: '88%',
  },
  protectionStepTitle: {
    color: C.purpleText,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 9,
    textAlign: 'center',
  },
  protectionStepDescription: {
    color: C.purpleText,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  protectionInstructions: {
    borderColor: C.purple,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  protectionInstruction: {
    color: C.purpleText,
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 5,
  },
  protectionHelpButton: {
    alignSelf: 'flex-start',
    marginTop: 9,
    paddingVertical: 3,
  },
  protectionHelpText: {
    color: C.purpleText,
    fontSize: 10,
    textDecorationLine: 'underline',
  },
  protectionWarning: {
    color: C.purpleText,
    fontSize: 8,
    lineHeight: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  protectionCompleteTitle: {
    color: C.purpleText,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 14,
    marginTop: 18,
    textAlign: 'center',
  },
  inlineNotice: {
    color: C.muted,
    fontSize: 11,
    textAlign: 'center',
  },
  protectedCard: {
    alignItems: 'center',
    backgroundColor: C.purple,
    borderRadius: 16,
    marginBottom: 14,
    padding: 24,
  },
  protectedTitle: {
    color: C.white,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  protectedCaption: {
    color: C.white,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
    textAlign: 'center',
  },
});
