import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FIGMA_COLORS } from '../components';
import type { RootStackParamList } from './types';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RegistrationSuccessScreen from '../screens/RegistrationSuccessScreen';
import LoginScreen from '../screens/LoginScreen';
import RecoverScreen from '../screens/RecoverScreen';
import UsageModeScreen from '../screens/UsageModeScreen';
import ActivateScreen from '../screens/ActivateScreen';
import AddDeviceScreen from '../screens/AddDeviceScreen';
import ConfigureAccessScreen from '../screens/ConfigureAccessScreen';
import LinkDeviceScreen from '../screens/LinkDeviceScreen';
import LinkedScreen from '../screens/LinkedScreen';
import ConfigProtectionScreen from '../screens/ConfigProtectionScreen';
import SummaryScreen from '../screens/SummaryScreen';
import ActivatingScreen from '../screens/ActivatingScreen';
import ResponsibleModeScreen from '../screens/ResponsibleModeScreen';
import InterruptedScreen from '../screens/InterruptedScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BlockedSitesScreen from '../screens/BlockedSitesScreen';
import BlacklistScreen from '../screens/BlacklistScreen';
import LinkNewDeviceGuideScreen from '../screens/LinkNewDeviceGuideScreen';
import AccessibilitySetupScreen from '../screens/AccessibilitySetupScreen';
import KeepAppPinnedScreen from '../screens/KeepAppPinnedScreen';
import AutoStartSetupScreen from '../screens/AutoStartSetupScreen';
import UninstallProtectionScreen from '../screens/UninstallProtectionScreen';
import NotificationPermissionScreen from '../screens/NotificationPermissionScreen';
import BackgroundWorkScreen from '../screens/BackgroundWorkScreen';
import AccessCodeSetupScreen from '../screens/AccessCodeSetupScreen';
import AccessCodeConfirmationScreen from '../screens/AccessCodeConfirmationScreen';
import ProtectedCodeScreen from '../screens/ProtectedCodeScreen';
import ProtectedHomeScreen from '../screens/ProtectedHomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CustomListScreen from '../screens/CustomListScreen';
import DevicesScreen from '../screens/DevicesScreen';
import ScreenGalleryScreen from '../screens/ScreenGalleryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    contentStyle: { backgroundColor: FIGMA_COLORS.background },
                }}
            >
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="RegistrationSuccess" component={RegistrationSuccessScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Recover" component={RecoverScreen} />
                <Stack.Screen name="UsageMode" component={UsageModeScreen} />
                <Stack.Screen name="Activate" component={ActivateScreen} />
                <Stack.Screen name="AddDevice" component={AddDeviceScreen} />
                <Stack.Screen name="ConfigureAccess" component={ConfigureAccessScreen} />
                <Stack.Screen name="LinkDevice" component={LinkDeviceScreen} />
                <Stack.Screen name="Linked" component={LinkedScreen} />
                <Stack.Screen name="ConfigProtection" component={ConfigProtectionScreen} />
                <Stack.Screen name="Summary" component={SummaryScreen} />
                <Stack.Screen name="Activating" component={ActivatingScreen} />
                <Stack.Screen name="ResponsibleMode" component={ResponsibleModeScreen} />
                <Stack.Screen name="Interrupted" component={InterruptedScreen} />
                <Stack.Screen name="History" component={HistoryScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="BlockedSites" component={BlockedSitesScreen} />
                <Stack.Screen name="Blacklist" component={BlacklistScreen} />
                <Stack.Screen name="LinkNewDeviceGuide" component={LinkNewDeviceGuideScreen} />
                <Stack.Screen name="AccessibilitySetup" component={AccessibilitySetupScreen} />
                <Stack.Screen name="KeepAppPinned" component={KeepAppPinnedScreen} />
                <Stack.Screen name="AutoStartSetup" component={AutoStartSetupScreen} />
                <Stack.Screen name="UninstallProtection" component={UninstallProtectionScreen} />
                <Stack.Screen name="NotificationPermission" component={NotificationPermissionScreen} />
                <Stack.Screen name="BackgroundWork" component={BackgroundWorkScreen} />
                <Stack.Screen name="AccessCodeSetup" component={AccessCodeSetupScreen} />
                <Stack.Screen name="AccessCodeConfirmation" component={AccessCodeConfirmationScreen} />
                <Stack.Screen name="ProtectedCode" component={ProtectedCodeScreen} />
                <Stack.Screen name="ProtectedHome" component={ProtectedHomeScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="CustomList" component={CustomListScreen} />
                <Stack.Screen name="Devices" component={DevicesScreen} />
                {__DEV__ ? (
                    <Stack.Screen name="ScreenGallery" component={ScreenGalleryScreen} />
                ) : null}
            </Stack.Navigator>
        </NavigationContainer>
    );
}