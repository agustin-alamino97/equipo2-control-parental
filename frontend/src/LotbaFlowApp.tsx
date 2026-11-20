import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
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
import {
  NavigationContainer,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
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
  Search,
  Shield,
  Smartphone,
  Tablet,
  UserRound,
} from 'lucide-react-native';
import LotbaBrandMark from './components/LotbaBrandMark';
import OnboardingArtwork from './components/OnboardingArtwork';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import * as api from './services/api';
import type { ApiAlert, ApiDevice, ApiEvent, ApiRule } from './services/api';

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
  DeviceDetail: { device: ApiDevice };
  Alerts: undefined;
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
const lotbaLogo = require('../assets/logo blanco lotba_Mesa de trabajo 1 1.png');

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
  'BlockedSites',
  'CustomList',
  'Blacklist',
  'Devices',
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
  immersiveHeader = false,
}: {
  title?: string;
  children: React.ReactNode;
  bottom?: React.ReactNode;
  scroll?: boolean;
  immersiveHeader?: boolean;
}) {
  const navigation = useNavigation();
  const routeName = useRoute().name;
  const showBack = !BACK_HIDDEN_ROUTES.has(routeName);
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeRoot}>
      <StatusBar barStyle="light-content" />
      {immersiveHeader ? (
        <View style={styles.usageHeader}>
          <View style={styles.usageBrand}>
            <Text style={styles.usageBrandTitle}>BA Protege+</Text>
            <Image
              accessibilityLabel="Lotería de la Ciudad"
              resizeMode="contain"
              source={lotbaLogo}
              style={styles.usageLotbaLogo}
            />
          </View>
          {bottom}
        </View>
      ) : (
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
      )}
      {scroll ? (
        <ScrollView
          style={styles.pageBody}
          contentContainerStyle={[
            styles.bodyContent,
            immersiveHeader && styles.immersiveBodyContent,
          ]}
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
      {!immersiveHeader ? bottom : null}
    </SafeAreaView>
  );
}

function Button({
  label,
  onPress,
  disabled = false,
  outline = false,
  loading = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  outline?: boolean;
  loading?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        outline && styles.outlineButton,
        disabled && styles.disabledButton,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={outline ? C.purpleText : C.white} />
      ) : (
        <Text style={[styles.buttonText, outline && styles.outlineButtonText]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

function InlineError({ message }: { message: string | null }) {
  if (!message) return null;
  return <Text accessibilityRole="alert" style={styles.inlineError}>{message}</Text>;
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
  length = 5,
}: {
  value: string;
  onChangeText: (value: string) => void;
  accessibilityLabel: string;
  masked?: boolean;
  length?: number;
}) {
  const inputRef = useRef<TextInputInstance | null>(null);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ingresar ${accessibilityLabel}`}
      onPress={() => inputRef.current?.focus()}
      style={styles.pinRow}
    >
      {Array.from({ length }, (_, index) => (
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
        maxLength={length}
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
  const { isReady, storageError } = useAuth();
  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => navigation.replace('Onboarding1'), 900);
    return () => clearTimeout(timer);
  }, [isReady, navigation]);

  return (
    <SafeAreaView style={styles.splashRoot}>
      <StatusBar barStyle="light-content" />
      <LotbaBrandMark size={176} />
      <Text style={styles.splashText}>BA Protege+</Text>
      {storageError ? <InlineError message={storageError} /> : null}
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
    'Navegación más segura para tus dispositivos',
    '1. Registrate',
    '2. Configurá el modo responsable',
    '3. Instalá la aplicación en el dispositivo protegido',
    '4. Vinculá el dispositivo con la clave de acceso',
  ];
  const subtitles = [
    'Control parental para prevenir el acceso a sitios de apuestas ilegales y otros contenidos riesgosos.',
    'Creá tu cuenta para empezar a proteger tus dispositivos.',
    'Elegí el modo responsable para gestionar los dispositivos vinculados.',
    'Descargá BA Protege+ en el dispositivo que querés proteger.',
    'Ingresá el código para vincular el dispositivo protegido.',
  ];
  const bullets = [
    [],
    ['Es rápido y seguro', 'Podés ser el responsable', 'Gestioná todos tus dispositivos.'],
    ['Activá el VPN y configurá tu celular', 'Bloqueá sitios de apuestas ilegales', 'Recibí alertas de actividad'],
    [],
    ['Configurá el dispositivo protegido en Modo Protegido para evitar desactivar BA Protege+.'],
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
            <View style={styles.onboardingLotbaLogo}>
              <Image
                accessible
                accessibilityLabel="Logo de Lotería de la Ciudad"
                resizeMode="contain"
                source={lotbaLogo}
                style={styles.onboardingLotbaImage}
              />
            </View>
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
  const { setAuthSession } = useAuth();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canContinue =
    name.trim().length > 0 &&
    surname.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length > 0;
  const submitRegistration = async () => {
    setLoading(true);
    setError(null);
    try {
      const emailAddress = email.trim();
      const registeredUser = await api.register({
        name: name.trim(),
        surname: surname.trim(),
        email: emailAddress,
        password,
      });
      const session = await api.login(emailAddress, password, registeredUser);
      await setAuthSession(session);
      navigation.navigate('EmailConfirmation', { email: emailAddress });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo completar el registro.'
      );
    } finally {
      setLoading(false);
    }
  };
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
        <InlineError message={error} />
        <View style={styles.formActions}>
          <Button
            label="Confirmar"
            disabled={!canContinue}
            loading={loading}
            onPress={submitRegistration}
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
      <Text style={styles.mailTitle}>Registro creado</Text>
      <Text style={styles.mailMessage}>
        El registro se creó en el servidor. La API todavía no ofrece confirmación de correo; este paso es una simulación local.
      </Text>
      <Text style={styles.pinLabel}>Ingresá un código de prueba de cinco dígitos</Text>
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
  const { setAuthSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const canContinue = email.includes('@') && password.length > 0;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const session = await api.login(email.trim(), password);
      await setAuthSession(session);
      navigation.navigate('UsageMode');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo iniciar sesión.'
      );
    } finally {
      setLoading(false);
    }
  };
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
        <InlineError message={error} />
        <View style={styles.formActions}>
          <Button
            label="Iniciar sesión"
            disabled={!canContinue}
            loading={loading}
            onPress={submitLogin}
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
  const email = route.params?.email || '';
  return (
    <Page title="Recuperar contraseña">
      <View style={styles.mailHero}>
        <Mail color={C.purple} size={28} strokeWidth={1.8} />
      </View>
      <Text style={styles.mailTitle}>Recuperación no disponible</Text>
      <Text style={styles.mailMessage}>
        La API integrada todavía no ofrece recuperación de contraseña. Volvé al inicio de sesión para continuar.
      </Text>
      {email ? <Text style={styles.emailHint}>{email}</Text> : null}
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('Login')}
        style={styles.recoverLink}
      >
        <Text style={styles.textLink}>¿Recordaste tu contraseña?</Text>
      </Pressable>
      <View style={styles.formActions}>
        <Button
          label="Volver al inicio de sesión"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </Page>
  );
}

function UsageModeScreen({ navigation }: ScreenProps<'UsageMode'>) {
  return (
    <Page
      title="Modo de uso"
      immersiveHeader
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
        subtitle="Gestioná la protección de los dispositivos vinculados."
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

function getDeviceConnectionState(device: ApiDevice): string {
  if (device.status === 'pending') return 'Actualización pendiente';
  if (device.status !== 'linked') return 'Desconectado';
  if (!device.last_ping) return 'Sin conexión registrada';
  const lastPing = Date.parse(device.last_ping);
  if (!Number.isFinite(lastPing) || Date.now() - lastPing > 5 * 60 * 1000) {
    return 'Desconectado';
  }
  return 'Conectado';
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
    </Pressable>
  );
}

function HistoryScreen({ navigation }: ScreenProps<'History'>) {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api.getEvents()
      .then(items => {
        if (active) setEvents(items);
      })
      .catch(requestError => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'No se pudo cargar el historial.'
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

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
    {loading ? <ActivityIndicator color={C.purple} /> : null}
    <InlineError message={error} />
      <View style={styles.historyList}>
      {events.map(event => (
        <View key={event.id} style={styles.historyEntry}>
          <Text style={styles.historyDate}>
            {new Date(event.event_time).toLocaleDateString('es-AR')}
          </Text>
          <Text style={styles.historyText}>
            {`El dispositivo ${event.alias_name || 'vinculado'} registró ${event.action || event.event_type}: ${event.value}`}
          </Text>
          </View>
        ))}
      </View>
    {!loading && events.length === 0 && !error ? (
      <Text style={styles.paragraph}>Todavía no hay actividad registrada.</Text>
    ) : null}
    {error ? (
      <Button
        label="Reintentar"
        outline
        onPress={() => navigation.replace('History')}
      />
    ) : null}
    </Page>
  );
}

function AlertsScreen({ navigation }: ScreenProps<'Alerts'>) {
  const [alerts, setAlerts] = useState<ApiAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setAlerts(await api.getAlerts());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudieron cargar las alertas.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadAlerts();
    }, [loadAlerts])
  );

  const markRead = async (alert: ApiAlert) => {
    if (alert.read) return;
    setMarkingId(alert.id);
    setError(null);
    try {
      await api.markAlertRead(alert.id);
      setAlerts(current =>
        current.map(item =>
          item.id === alert.id ? { ...item, read: true } : item
        )
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo actualizar la alerta.'
      );
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <Page
      title="Alertas"
      bottom={
        <BottomTabs
          active="home"
          onHome={() => navigation.navigate('ResponsibleHome')}
          onHistory={() => navigation.navigate('History')}
          onProfile={() => navigation.navigate('Profile')}
        />
      }
    >
      <Text style={styles.paragraph}>
        Notificaciones relevantes sobre la protección de tus dispositivos.
      </Text>
      {loading ? <ActivityIndicator color={C.purple} /> : null}
      <InlineError message={error} />
      {!loading && alerts.length === 0 && !error ? (
        <Text style={styles.emptyStateText}>Todavía no hay alertas.</Text>
      ) : null}
      {alerts.map(alert => (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: alert.read || markingId === alert.id }}
          disabled={alert.read || markingId === alert.id}
          key={alert.id}
          onPress={() => void markRead(alert)}
          style={[styles.alertCard, alert.read && styles.readAlertCard]}
        >
          <View style={styles.alertHeader}>
            <Text style={styles.alertTitle}>
              {alert.severity === 'critical'
                ? 'Alerta crítica'
                : alert.severity === 'warning'
                  ? 'Advertencia'
                  : 'Notificación'}
            </Text>
            {!alert.read ? (
              markingId === alert.id ? (
                <ActivityIndicator color={C.purple} size="small" />
              ) : (
                <Text style={styles.unreadBadge}>Nueva</Text>
              )
            ) : null}
          </View>
          <Text style={styles.alertMessage}>{alert.message}</Text>
          <Text style={styles.alertMeta}>
            {alert.device_name} ·{' '}
            {new Date(alert.alert_time).toLocaleString('es-AR')}
          </Text>
        </Pressable>
      ))}
      {error ? (
        <Button label="Reintentar" outline onPress={() => void loadAlerts()} />
      ) : null}
    </Page>
  );
}

function ProfileScreen({ navigation }: ScreenProps<'Profile'>) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [surname, setSurname] = useState(user?.surname ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('12345');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

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
        label="Confirmar"
        onPress={() =>
          setSaveMessage(
            'No se guardaron los cambios: el backend aún no ofrece edición de perfil.'
          )
        }
      />
      <InlineError message={saveMessage} />
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
    <Page
      title="Bloquear Sitios"
      bottom={
        <BottomTabs
          active="home"
          onHome={() => navigation.navigate('ResponsibleHome')}
          onHistory={() => navigation.navigate('History')}
          onProfile={() => navigation.navigate('Profile')}
        />
      }
    >
      <Text style={styles.centerSubtitle}>Gestioná los sitios bloqueados</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('Blacklist')}
        style={styles.blockedListOption}
      >
        <View style={styles.blockedListOptionIcon}>
          <ListChecks color={C.purple} size={22} />
        </View>
        <View style={styles.blockedListOptionText}>
          <Text style={styles.blockedListOptionTitle}>Lista Personalizada</Text>
          <Text style={styles.blockedListOptionDescription}>
            Editá los sitios bloqueados por el adulto responsable.
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('CustomList')}
        style={styles.blockedListOption}
      >
        <View style={styles.blockedListOptionIcon}>
          <ListChecks color={C.purple} size={22} />
        </View>
        <View style={styles.blockedListOptionText}>
          <Text style={styles.blockedListOptionTitle}>Lista negra</Text>
          <Text style={styles.blockedListOptionDescription}>
            Accede a la lista oficial de LOTBA.
          </Text>
        </View>
      </Pressable>
      <View style={styles.blockedSitesBack}>
        <Button label="Atrás" outline onPress={() => navigation.goBack()} />
      </View>
    </Page>
  );
}

function CustomListScreen({ navigation }: ScreenProps<'CustomList'>) {
  const [items, setItems] = useState<{ key: string; value: string; type: string }[]>([]);
  const [siteCount, setSiteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    setError(null);
    setSyncStatus('Actualización pendiente…');
    try {
      const result = await api.getSystemBlocklist();
      const rules = [
        ...result.domain.map(value => ({ key: `domain-${value}`, value, type: 'Dominio' })),
        ...result.keyword.map(value => ({ key: `keyword-${value}`, value, type: 'Palabra clave' })),
        ...result.regex.map(value => ({ key: `regex-${value}`, value, type: 'Patrón' })),
      ];
      setItems(rules);
      setSiteCount(result.total);
      setSyncStatus(
        result.status === 'RESET'
          ? 'Lista oficial sincronizada.'
          : 'La lista oficial ya estaba actualizada.'
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo cargar la lista oficial.'
      );
      setSyncStatus('Desconectado: no se pudo consultar la lista oficial.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void loadList();
    }, [loadList])
  );

  return (
    <Page
      title="Lista negra"
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
      <View style={styles.listPageContent}>
        <Text style={styles.listDescription}>
          Reglas oficiales de bloqueo publicadas para todos los dispositivos.
        </Text>
        <Text style={styles.listStatus}>
          {loading
            ? 'Actualización pendiente…'
            : `${siteCount} reglas · ${syncStatus ?? ''}`}
        </Text>
        <InlineError message={error} />
        {error ? (
          <Button
            label="Reintentar"
            outline
            onPress={() => {
              setRefreshing(true);
              void loadList();
            }}
          />
        ) : null}
        <FlatList
          data={items}
          initialNumToRender={12}
          keyExtractor={item => item.key}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator color={C.purple} />
            ) : error ? undefined : (
              <Text style={styles.emptyStateText}>La lista oficial está vacía.</Text>
            )
          }
          onRefresh={() => {
            setRefreshing(true);
            void loadList();
          }}
          refreshing={refreshing}
          renderItem={({ item }) => (
            <View style={styles.officialRuleRow}>
              <View style={styles.officialRuleText}>
                <Text style={styles.siteText}>{item.value}</Text>
                <Text style={styles.ruleType}>{item.type}</Text>
              </View>
              <Shield color={C.purple} size={17} />
            </View>
          )}
          style={styles.officialRulesList}
          windowSize={7}
        />
        <Button label="Volver" outline onPress={() => navigation.goBack()} />
      </View>
    </Page>
  );
}

function BlacklistScreen({ navigation }: ScreenProps<'Blacklist'>) {
  const [site, setSite] = useState('');
  const [sites, setSites] = useState<ApiRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loadSites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSites(await api.getCustomRules());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo cargar la lista personalizada.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    api.getCustomRules()
      .then(items => {
        if (active) setSites(items);
      })
      .catch(requestError => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'No se pudo cargar la lista personalizada.'
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const addSite = async () => {
    const value = site.trim();
    if (!value) return;
    setSaving(true);
    setError(null);
    try {
      await api.addCustomRule(value, 'domain');
      setSite('');
      await loadSites();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo guardar el sitio.'
      );
    } finally {
      setSaving(false);
    }
  };

  const removeSite = async (ruleId: string) => {
    setDeletingId(ruleId);
    setError(null);
    try {
      await api.deleteCustomRule(ruleId);
      await loadSites();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo quitar el sitio.'
      );
    } finally {
      setDeletingId(null);
    }
  };
  const visibleSites = sites.filter(item =>
    item.value.toLowerCase().includes(site.trim().toLowerCase())
  );
  return (
    <Page
      title="Bloquear Sitios"
      bottom={
        <BottomTabs
          active="home"
          onHome={() => navigation.navigate('ResponsibleHome')}
          onHistory={() => navigation.navigate('History')}
          onProfile={() => navigation.navigate('Profile')}
        />
      }
    >
      <Text style={styles.centerSubtitle}>Añade sitios a la lista personalizada</Text>
      <View style={styles.customListSearch}>
        <Search color={C.purpleText} size={18} />
        <TextInput
          accessibilityLabel="Buscar o añadir sitio"
          autoCapitalize="none"
          keyboardType="url"
          onChangeText={setSite}
          placeholder="Buscar"
          placeholderTextColor={C.muted}
          style={styles.customListSearchInput}
          value={site}
        />
      </View>
      <InlineError message={error} />
      {loading ? <ActivityIndicator color={C.purple} /> : null}
      {visibleSites.map(item => (
        <View key={item.id} style={styles.customListSiteRow}>
          <Text numberOfLines={1} style={styles.customListSiteText}>{item.value}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Quitar ${item.value} de la lista personalizada`}
            disabled={deletingId === item.id}
            onPress={() => void removeSite(item.id)}
            style={styles.customListCheck}
          >
            {deletingId === item.id ? (
              <ActivityIndicator color={C.purple} size="small" />
            ) : (
              <Check color={C.white} size={13} strokeWidth={3} />
            )}
          </Pressable>
        </View>
      ))}
      {!loading && sites.length === 0 && !error ? (
        <Text style={styles.emptyStateText}>Todavía no agregaste reglas personalizadas.</Text>
      ) : null}
      {!loading && sites.length > 0 && visibleSites.length === 0 ? (
        <Text style={styles.emptyStateText}>No hay sitios que coincidan con la búsqueda.</Text>
      ) : null}
      {error ? (
        <Button label="Reintentar" outline onPress={() => void loadSites()} />
      ) : null}
      <View style={styles.customListActions}>
        <Button
          label="Aceptar"
          disabled={!site.trim()}
          loading={saving}
          onPress={() => void addSite()}
        />
        <Button label="Atrás" outline onPress={() => navigation.goBack()} />
      </View>
    </Page>
  );
}

function DevicesScreen({ navigation }: ScreenProps<'Devices'>) {
  const [devices, setDevices] = useState<ApiDevice[]>([]);
  const [protectionEnabled, setProtectionEnabled] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadDevices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setDevices(await api.getDevices());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudieron cargar los dispositivos.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadDevices();
    }, [loadDevices])
  );

  return (
    <Page
      title="Dispositivos Vinculados"
      bottom={
        <BottomTabs
          active="home"
          onHome={() => navigation.navigate('ResponsibleHome')}
          onHistory={() => navigation.navigate('History')}
          onProfile={() => navigation.navigate('Profile')}
        />
      }
    >
      <HomeCard
        icon={<Smartphone color={C.purple} size={22} />}
        title="Vincular nuevo dispositivo"
        subtitle="Generá un código de vinculación."
        color={C.purple}
        onPress={() => navigation.navigate('LinkDeviceGuide')}
      />
      <Text style={styles.centerSubtitle}>Administrá tus dispositivos</Text>
      {loading ? <ActivityIndicator color={C.purple} /> : null}
      <InlineError message={error} />
      {devices.map(device => {
        const connected = getDeviceConnectionState(device) === 'Conectado';
        const deviceIcon = device.os_model?.toLowerCase().includes('tablet')
          ? <Tablet color={C.purple} size={22} />
          : device.os_model?.toLowerCase().includes('notebook')
            ? <Laptop color={C.purple} size={22} />
            : <Smartphone color={C.purple} size={22} />;
        return (
          <View
            key={device.id}
            style={[
              styles.deviceCard,
              connected ? styles.connectedDeviceCard : styles.disconnectedDeviceCard,
            ]}
          >
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate('DeviceDetail', { device })}
              style={styles.deviceCardMain}
            >
              <View style={styles.deviceCardIcon}>{deviceIcon}</View>
              <View style={styles.deviceCardText}>
                <Text style={styles.deviceCardName}>{device.alias_name}</Text>
                <Text style={styles.deviceCardStatus}>
                  {getDeviceConnectionState(device)}
                </Text>
              </View>
            </Pressable>
            <Switch
              accessibilityLabel={`Protección para ${device.alias_name}`}
              onValueChange={value =>
                setProtectionEnabled(current => ({ ...current, [device.id]: value }))
              }
              thumbColor={C.white}
              trackColor={{ false: '#B9B5C9', true: C.purple }}
              value={protectionEnabled[device.id] ?? connected}
            />
          </View>
        );
      })}
      {!loading && devices.length === 0 && !error ? (
        <Text style={styles.emptyStateText}>
          Todavía no hay dispositivos vinculados.
        </Text>
      ) : null}
      {error ? (
        <Button label="Reintentar" outline onPress={() => void loadDevices()} />
      ) : null}
    </Page>
  );
}

function DeviceDetailScreen({
  navigation,
  route,
}: ScreenProps<'DeviceDetail'>) {
  const [device, setDevice] = useState(route.params.device);
  const [loading, setLoading] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setError(null);
      api.getDevices()
        .then(devices => {
          const current = devices.find(item => item.id === route.params.device.id);
          if (active && current) setDevice(current);
        })
        .catch(requestError => {
          if (active) {
            setError(
              requestError instanceof Error
                ? requestError.message
                : 'No se pudo actualizar el estado del dispositivo.'
            );
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [route.params.device.id])
  );

  const unlinkDevice = async () => {
    setUnlinking(true);
    setError(null);
    try {
      await api.requestDeviceUnlink(device.id);
      navigation.navigate('Devices');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo desvincular el dispositivo.'
      );
    } finally {
      setUnlinking(false);
    }
  };

  return (
    <Page title="Detalle del dispositivo">
      <View style={styles.deviceDetailHero}>
        <View style={styles.deviceDetailIcon}>
          <Smartphone color={C.purple} size={29} />
        </View>
        <Text style={styles.deviceDetailAlias}>{device.alias_name}</Text>
        <Text style={styles.deviceStatus}>{getDeviceConnectionState(device)}</Text>
      </View>
      {loading ? <ActivityIndicator color={C.purple} /> : null}
      <InlineError message={error} />
      {error ? (
        <Button
          label="Reintentar"
          outline
          onPress={() => navigation.replace('DeviceDetail', { device })}
        />
      ) : null}
      <View style={styles.deviceInfoCard}>
        <Text style={styles.deviceInfoLabel}>Estado de protección</Text>
        <Text style={styles.deviceInfoValue}>
          {device.protection_status ? 'Reportada activa' : 'Pendiente'}
        </Text>
        <Text style={styles.backendLimitation}>
          El backend informa el estado de vínculo; los permisos del sistema Android aún no se verifican en esta versión.
        </Text>
      </View>
      <View style={styles.deviceInfoCard}>
        <Text style={styles.deviceInfoLabel}>Sistema</Text>
        <Text style={styles.deviceInfoValue}>{device.os_model || 'No informado'}</Text>
      </View>
      <View style={styles.deviceInfoCard}>
        <Text style={styles.deviceInfoLabel}>Última conexión</Text>
        <Text style={styles.deviceInfoValue}>
          {device.last_ping
            ? new Date(device.last_ping).toLocaleString('es-AR')
            : 'Sin conexión registrada'}
        </Text>
      </View>
      <View style={styles.deviceInfoCard}>
        <Text style={styles.deviceInfoLabel}>Alias del dispositivo</Text>
        <Text style={styles.deviceInfoValue}>{device.alias_name}</Text>
      </View>
      <Button
        label="Ver alertas"
        onPress={() => navigation.navigate('Alerts')}
      />
      <Button
        label="Ver historial"
        outline
        onPress={() => navigation.navigate('History')}
      />
      {device.status === 'linked' ? (
        <Button
          label="Desvincular dispositivo"
          disabled={unlinking}
          loading={unlinking}
          outline
          onPress={() => void unlinkDevice()}
        />
      ) : null}
    </Page>
  );
}

function LinkDeviceGuideScreen({ navigation }: ScreenProps<'LinkDeviceGuide'>) {
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestNewCode = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
      setError(null);
      setCode(null);
      setSecondsRemaining(null);
      setExpiresAt(null);
    }
    try {
      const result = await api.generatePairingCode();
      setCode(result.code);
      setExpiresAt(result.expiresAt);
      setSecondsRemaining(
        Math.max(0, Math.ceil((Date.parse(result.expiresAt) - Date.now()) / 1000))
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo generar el código de vinculación.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void requestNewCode(false);
    }, 0);
    return () => clearTimeout(timeout);
  }, [requestNewCode]);

  useEffect(() => {
    if (!expiresAt) return undefined;
    const updateRemaining = () => {
      const seconds = Math.max(
        0,
        Math.ceil((Date.parse(expiresAt) - Date.now()) / 1000)
      );
      setSecondsRemaining(seconds);
    };
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <Page title="Vincular dispositivo">
      <View style={styles.guideIcon}>
        <Smartphone color={C.purple} size={46} />
      </View>
      <Text style={styles.paragraph}>
        En el dispositivo protegido, elegí Modo Protegido e ingresá este código temporal.
      </Text>
      <View style={styles.noticeCard}>
        <Text style={styles.smallText}>
          El código vence en 10 minutos y solo puede utilizarse una vez. Asigná un alias al dispositivo durante la configuración.
        </Text>
      </View>
      {loading ? <ActivityIndicator color={C.purple} /> : null}
      <InlineError message={error} />
      {code ? (
        <>
          <Text style={styles.pairingCodeLabel}>Código temporal de vinculación</Text>
          {secondsRemaining === 0 ? (
            <Text style={styles.expiredCode}>Código vencido</Text>
          ) : (
            <>
              <Text style={styles.pairingCode}>{code}</Text>
              <Text style={styles.pairingExpiry}>
                Vence en {Math.floor((secondsRemaining ?? 0) / 60)}:
                {String((secondsRemaining ?? 0) % 60).padStart(2, '0')}
              </Text>
            </>
          )}
        </>
      ) : null}
      {secondsRemaining === 0 || error ? (
        <Button
          label="Generar un nuevo código"
          loading={loading}
          onPress={() => void requestNewCode()}
        />
      ) : (
        <Button label="Aceptar" onPress={() => navigation.goBack()} />
      )}
    </Page>
  );
}

function ProtectedCodeScreen({ navigation }: ScreenProps<'ProtectedCode'>) {
  const [code, setCode] = useState('');
  const [alias, setAlias] = useState('');
  const [messageVisible, setMessageVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeExpired, setCodeExpired] = useState(false);
  const [deviceUuid] = useState(createDeviceUuid);
  const ready = code.length === 6 && alias.trim().length > 0;

  const submitCode = async () => {
    setLoading(true);
    setError(null);
    setCodeExpired(false);
    try {
      const osModel = `${Platform.OS} ${String(Platform.Version)}`;
      await api.consumePairingCode({
        code,
        alias_name: alias.trim(),
        device_uuid: deviceUuid,
        os_model: osModel,
      });
      navigation.navigate('ProtectionSetup', { step: 1 });
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo vincular este dispositivo.';
      const expired =
        /vencid|expir|inválido|invalido|INVALID_OR_EXPIRED_CODE/i.test(message);
      setCodeExpired(expired);
      setError(
        expired
          ? 'El código venció o no es válido. Pedile al responsable que genere uno nuevo.'
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Modo Protegido">
      <Text style={styles.noticeTitle}>Vinculá este dispositivo</Text>
      <Text style={styles.noticeSubtitle}>
        Ingresá el código temporal que aparece en el dispositivo del responsable.
      </Text>
      <Field
        label="Alias del dispositivo"
        value={alias}
        onChangeText={setAlias}
        placeholder="Por ejemplo: Celular"
        maxLength={40}
      />
      <PinEntry
        accessibilityLabel="Código temporal de vinculación"
        value={code}
        onChangeText={value => {
          setCode(value);
          setError(null);
          setCodeExpired(false);
        }}
        masked
        length={6}
      />
      <Pressable
        accessibilityRole="button"
        onPress={() => setMessageVisible(true)}
        style={styles.textLinkWrap}
      >
        <Text style={styles.textLink}>¿No tenés el código?</Text>
      </Pressable>
      {messageVisible ? (
        <Text style={styles.inlineNotice}>
          Pedile al responsable que genere un código temporal desde Dispositivos.
        </Text>
      ) : null}
      {codeExpired ? (
        <Text style={styles.expiredCode}>
          El código venció. El dispositivo debe recibir uno nuevo del responsable.
        </Text>
      ) : null}
      <InlineError message={codeExpired ? null : error} />
      <View style={styles.formActions}>
        <Button
          label="Confirmar"
          disabled={!ready}
          loading={loading}
          onPress={() => void submitCode()}
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
    subtitle: 'Fijá BA Protege+ en el dispositivo protegido.',
    description: 'De esta manera no se podrá apagar la aplicación fácilmente.',
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
    description: 'Para evitar que se borre accidentalmente la aplicación.',
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
      'Para que puedas desbloquear fácilmente el dispositivo protegido si es necesario.',
    warning:
      'No uses combinaciones simples como “1234” o una fecha de nacimiento, dado que podría descifrarse fácilmente.',
    instructions: [],
    help: false,
  },
  {
    subtitle: 'Repetí el código de acceso',
    description:
      'Para que puedas desbloquear fácilmente el dispositivo protegido si es necesario.',
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
  const { step, newCode } = route.params;
  const currentStep = Math.min(Math.max(step, 1), protectionSteps.length);
  const details = protectionSteps[currentStep - 1];
  const [code, setCode] = useState('');
  const [helpVisible, setHelpVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ready =
    code.length === 5 && (currentStep !== 8 || code === newCode);
  const isCodeStep = currentStep >= 7;

  const continueSetup = async () => {
    if (currentStep === 7) {
      navigation.push('ProtectionSetup', {
        step: 8,
        newCode: code,
      });
      return;
    }

    if (currentStep === 8) {
      setSaving(true);
      setError(null);
      try {
        await api.completeProtectedDeviceSetup(code);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'No se pudo guardar la configuración.'
        );
        setSaving(false);
        return;
      }
      setSaving(false);
      navigation.navigate('ProtectionComplete');
      return;
    }

    navigation.push('ProtectionSetup', {
      step: currentStep + 1,
      newCode,
    });
  };

  return (
    <Page title="Configurar Protección">
      {currentStep < 7 ? (
        <Text style={styles.backendLimitation}>
          Confirmá cada paso después de habilitarlo en los ajustes de Android. La app muestra la guía, pero esta versión no puede validar permisos del sistema.
        </Text>
      ) : null}
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
            loading={saving}
            onPress={() => void continueSetup()}
          />
          <Button
            label="Cancelar"
            outline
            onPress={() => navigation.navigate('UsageMode')}
          />
        </View>
      )}
      <InlineError message={error} />
    </Page>
  );
}

function ProtectionCompleteScreen({
  navigation,
}: ScreenProps<'ProtectionComplete'>) {
  const [syncing, setSyncing] = useState(true);
  const [syncMessage, setSyncMessage] = useState('Actualización pendiente…');
  const [error, setError] = useState<string | null>(null);

  const syncRules = useCallback(async () => {
    setSyncing(true);
    setError(null);
    setSyncMessage('Actualización pendiente…');
    try {
      const result = await api.syncProtectedRules();
      setSyncMessage(
        result.status === 'RESET'
          ? 'Reglas personalizadas actualizadas.'
          : 'Las reglas personalizadas ya están actualizadas.'
      );
    } catch (requestError) {
      setSyncMessage('Actualización pendiente: sin conexión con el servidor.');
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudieron actualizar las reglas.'
      );
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void syncRules();
    }, 0);
    return () => clearTimeout(timeout);
  }, [syncRules]);

  return (
    <Page>
      <View style={styles.successHero}>
        <Check color={C.green} size={32} strokeWidth={3} />
      </View>
      <Text style={styles.protectionCompleteTitle}>
        Ahora podés gestionar el bloqueo de sitios de apuestas ilegales en el dispositivo protegido.
      </Text>
      <Text style={styles.successMessage}>
        BA Protege+ se mantendrá en este dispositivo y aplicará las reglas disponibles cuando los permisos de Android estén habilitados.
      </Text>
      <View style={styles.syncStatusCard}>
        {syncing ? <ActivityIndicator color={C.purple} size="small" /> : null}
        <Text style={styles.syncStatusText}>{syncMessage}</Text>
      </View>
      <InlineError message={error} />
      {error ? (
        <Button
          label="Reintentar sincronización"
          outline
          onPress={() => void syncRules()}
        />
      ) : null}
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
  const [pin, setPin] = useState('');
  const [deviceAlias, setDeviceAlias] = useState('');
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api.getProtectedDeviceDetails().then(device => {
      if (active && device) {
        setDeviceAlias(device.aliasName);
        setAccessCode(device.localAccessCode ?? null);
        setSetupComplete(Boolean(device.protectionSetupComplete));
      }
    }).catch(requestError => {
      if (active) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'No se pudo consultar la configuración local.'
        );
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const unlock = () => {
    if (pin === accessCode && accessCode) {
      setUnlocked(true);
      setError(null);
    } else {
      setError('El código ingresado no coincide.');
    }
  };

  return (
    <Page title="Modo Protegido">
      <View style={styles.protectedCard}>
        <Shield color={C.white} size={36} />
        <Text style={styles.protectedTitle}>
          {deviceAlias || 'Dispositivo protegido'}
        </Text>
        <Text style={styles.protectedCaption}>
          {setupComplete
            ? 'Configuración completada. Los permisos del sistema deben mantenerse activos.'
            : 'La configuración de protección está pendiente.'}
        </Text>
      </View>
      {unlocked ? (
        <>
          <Text style={styles.deviceInfoValue}>Estado: configuración completada</Text>
          <Button
            label="Ocultar estado"
            outline
            onPress={() => setUnlocked(false)}
          />
        </>
      ) : (
        <>
          <Text style={styles.paragraph}>
            Ingresá el código de acceso local para consultar el estado.
          </Text>
          <PinEntry
            accessibilityLabel="Código de acceso local"
            value={pin}
            onChangeText={value => {
              setPin(value);
              setError(null);
            }}
            masked
          />
          <InlineError message={error} />
          <Button
            label="Ver estado de protección"
            disabled={pin.length !== 5}
            onPress={unlock}
          />
        </>
      )}
      <Button label="Cancelar" outline onPress={() => navigation.popToTop()} />
    </Page>
  );
}

function createDeviceUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, character => {
    const random = Math.floor(Math.random() * 16);
    const value = character === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export default function LotbaFlowApp() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
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
          <Stack.Screen name="DeviceDetail" component={DeviceDetailScreen} />
          <Stack.Screen name="Alerts" component={AlertsScreen} />
          <Stack.Screen name="LinkDeviceGuide" component={LinkDeviceGuideScreen} />
          <Stack.Screen name="ProtectedCode" component={ProtectedCodeScreen} />
          <Stack.Screen name="ProtectedHome" component={ProtectedHomeScreen} />
          <Stack.Screen name="ProtectionSetup" component={ProtectionSetupScreen} />
          <Stack.Screen name="ProtectionComplete" component={ProtectionCompleteScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
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
    height: 156,
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
    fontSize: 32,
    fontWeight: '700',
  },
  usageHeader: {
    backgroundColor: C.purple,
    height: 192,
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  usageBrand: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  usageBrandTitle: {
    color: C.white,
    fontSize: 32,
    fontWeight: '700',
  },
  usageLotbaLogo: {
    height: 30,
    marginTop: 2,
    width: 112,
  },
  pageBody: {
    backgroundColor: C.white,
    flex: 1,
  },
  bodyContent: {
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  immersiveBodyContent: {
    paddingTop: 30,
  },
  pageTitle: {
    color: C.purpleText,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
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
    minHeight: 64,
    paddingHorizontal: 14,
    width: '100%',
  },
  buttonText: {
    color: C.white,
    fontSize: 18,
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
  onboardingLotbaLogo: {
    alignItems: 'center',
    backgroundColor: C.purple,
    borderRadius: 8,
    height: 92,
    justifyContent: 'center',
    marginBottom: 14,
    width: 156,
  },
  onboardingLotbaImage: {
    height: 82,
    width: 118,
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
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 18,
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
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 22,
    textAlign: 'center',
  },
  modeTile: {
    alignItems: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    marginBottom: 14,
    minHeight: 120,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  modeTileIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 26,
    height: 52,
    justifyContent: 'center',
    marginRight: 14,
    width: 52,
  },
  modeTileText: {
    flex: 1,
  },
  modeTileTitle: {
    color: C.white,
    fontSize: 18,
    fontWeight: '700',
  },
  modeTileSubtitle: {
    color: C.white,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
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
    paddingHorizontal: 0,
    paddingTop: 20,
  },
  homeSummary: {
    paddingHorizontal: 18,
    paddingTop: 4,
  },
  homeSummaryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  homeDeviceRow: {
    alignItems: 'center',
    borderBottomColor: C.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 50,
    paddingVertical: 5,
  },
  emptyStateText: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
    textAlign: 'center',
  },
  homeCard: {
    alignItems: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 124,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  homeIcon: {
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    marginRight: 14,
    width: 50,
  },
  homeCardText: {
    flex: 1,
  },
  homeCardTitle: {
    color: C.white,
    fontSize: 18,
    fontWeight: '700',
  },
  homeCardSubtitle: {
    color: C.white,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  tabs: {
    alignItems: 'center',
    backgroundColor: C.purple,
    flexDirection: 'row',
    justifyContent: 'space-around',
    minHeight: 62,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 52,
  },
  tabLabel: {
    color: C.white,
    fontSize: 11,
    marginTop: 3,
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
  blockedListOption: {
    alignItems: 'center',
    backgroundColor: C.purple,
    borderRadius: 16,
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 124,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  blockedListOptionIcon: {
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginRight: 14,
    width: 48,
  },
  blockedListOptionText: {
    flex: 1,
  },
  blockedListOptionTitle: {
    color: C.white,
    fontSize: 18,
    fontWeight: '700',
  },
  blockedListOptionDescription: {
    color: C.white,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  blockedSitesBack: {
    marginTop: 100,
  },
  customListSearch: {
    alignItems: 'center',
    backgroundColor: C.pale,
    borderRadius: 32,
    flexDirection: 'row',
    height: 58,
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  customListSearchInput: {
    color: C.purpleText,
    flex: 1,
    fontSize: 15,
    marginLeft: 8,
    minHeight: 48,
    paddingVertical: 0,
  },
  customListSiteRow: {
    alignItems: 'center',
    borderColor: C.purple,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 44,
    paddingHorizontal: 10,
  },
  customListSiteText: {
    color: C.purpleText,
    flex: 1,
    fontSize: 13,
  },
  customListCheck: {
    alignItems: 'center',
    backgroundColor: C.purple,
    borderRadius: 2,
    height: 20,
    justifyContent: 'center',
    marginLeft: 8,
    width: 20,
  },
  customListActions: {
    marginTop: 72,
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
  listPageContent: {
    flex: 1,
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  listDescription: {
    color: C.purpleText,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 6,
    textAlign: 'center',
  },
  listStatus: {
    color: C.muted,
    fontSize: 11,
    marginBottom: 4,
    textAlign: 'center',
  },
  officialRulesList: {
    flex: 1,
    marginBottom: 8,
  },
  officialRuleRow: {
    alignItems: 'center',
    borderBottomColor: C.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 48,
    paddingHorizontal: 4,
    paddingVertical: 5,
  },
  officialRuleText: {
    flex: 1,
    paddingRight: 10,
  },
  ruleType: {
    color: C.muted,
    fontSize: 10,
    marginTop: 2,
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
  deviceCard: {
    alignItems: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 104,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  connectedDeviceCard: {
    backgroundColor: C.green,
  },
  disconnectedDeviceCard: {
    backgroundColor: C.orange,
  },
  deviceCardMain: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    minHeight: 56,
  },
  deviceCardIcon: {
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginRight: 12,
    width: 48,
  },
  deviceCardText: {
    flex: 1,
  },
  deviceCardName: {
    color: C.white,
    fontSize: 16,
    fontWeight: '700',
  },
  deviceCardStatus: {
    color: C.white,
    fontSize: 12,
    marginTop: 4,
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
  deviceDetails: {
    flex: 1,
  },
  deviceStatus: {
    color: C.green,
    fontSize: 11,
  },
  deviceDetailHero: {
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceDetailIcon: {
    alignItems: 'center',
    backgroundColor: C.lilac,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginBottom: 8,
    width: 56,
  },
  deviceDetailAlias: {
    color: C.purpleText,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 3,
    textAlign: 'center',
  },
  deviceInfoCard: {
    borderColor: C.border,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 9,
    padding: 12,
  },
  deviceInfoLabel: {
    color: C.muted,
    fontSize: 11,
    marginBottom: 4,
  },
  deviceInfoValue: {
    color: C.purpleText,
    fontSize: 13,
    fontWeight: '600',
  },
  unlinkButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    minWidth: 75,
  },
  pairingCodeLabel: {
    color: C.purpleText,
    fontSize: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  pairingCode: {
    color: C.purpleText,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 7,
    marginBottom: 12,
    textAlign: 'center',
  },
  pairingExpiry: {
    color: C.muted,
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  expiredCode: {
    color: '#B3261E',
    fontSize: 12,
    lineHeight: 17,
    marginVertical: 8,
    textAlign: 'center',
  },
  backendLimitation: {
    color: C.muted,
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  inlineError: {
    color: '#B3261E',
    fontSize: 12,
    lineHeight: 17,
    marginVertical: 8,
    textAlign: 'center',
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
  syncStatusCard: {
    alignItems: 'center',
    backgroundColor: C.pale,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 38,
    paddingHorizontal: 10,
  },
  syncStatusText: {
    color: C.purpleText,
    fontSize: 11,
    marginLeft: 7,
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: C.pale,
    borderColor: C.purple,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    padding: 12,
  },
  readAlertCard: {
    borderColor: C.border,
    opacity: 0.78,
  },
  alertHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  alertTitle: {
    color: C.purpleText,
    fontSize: 13,
    fontWeight: '700',
  },
  unreadBadge: {
    color: C.orange,
    fontSize: 10,
    fontWeight: '700',
  },
  alertMessage: {
    color: C.purpleText,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 7,
  },
  alertMeta: {
    color: C.muted,
    fontSize: 10,
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
