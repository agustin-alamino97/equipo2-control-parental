import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import OptionCard from '../../components/OptionCard';
import PrimaryButton from '../../components/PrimaryButton';
import AppIcon from '../../components/AppIcon';
import { COLORS } from '../../constants/colors';

export default function Perfil() {
  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro que querés salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: async () => { await AsyncStorage.multiRemove(['@baprotege:onboarded', '@baprotege:user']); router.replace('/bienvenida'); } },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <Header subtitle="Mi Perfil" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View style={styles.userCard}>
          <View style={styles.avatar}><AppIcon name="profile" size={36} color={COLORS.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>Darío Rubeo</Text>
            <Text style={styles.userEmail}>darorodevsk@gmail.com</Text>
            <View style={styles.badge}><AppIcon name="shieldCheck" size={12} color={COLORS.white} /><Text style={styles.badgeText}>Cuenta verificada</Text></View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Cuenta</Text>
        <OptionCard icon="profile" title="Datos personales" subtitle="Editá tu nombre, email y contraseña" color="purple" onPress={() => {}} />
        <OptionCard icon="lock" title="Seguridad" subtitle="Cambiar contraseña y PIN de acceso" color="purple" onPress={() => {}} />

        <Text style={styles.sectionTitle}>Dispositivos</Text>
        <OptionCard icon="tablet" title="Dispositivos vinculados" subtitle="3 dispositivos activos" color="green" onPress={() => router.push('/(tabs)/proteccion')} />
        <OptionCard icon="link" title="Vincular nuevo dispositivo" subtitle="Agregá un dispositivo a tu cuenta" color="green" onPress={() => router.push('/responsable/vincular-dispositivo')} />

        <Text style={styles.sectionTitle}>Preferencias</Text>
        <OptionCard icon="warning" title="Notificaciones" subtitle="Configurá las alertas que querés recibir" color="orange" onPress={() => router.push('/notificaciones')} />
        <OptionCard icon="settings" title="Configuraciones" subtitle="Ajustes generales de la app" color="orange" onPress={() => router.push('/ajustes')} />

        <View style={styles.appInfo}>
          <Image source={require('../../assets/logo.png')} style={styles.appLogo} resizeMode="contain" />
          <Text style={styles.appVersion}>BA Protege+ v1.0.0</Text>
          <Text style={styles.appCopy}>© 2026 BAProtege+. Todos los derechos reservados.</Text>
        </View>

        <PrimaryButton title="Cerrar sesión" variant="outline" onPress={handleLogout} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 20 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.lightPurple, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  userName: { fontSize: 16, fontWeight: '700', color: COLORS.black },
  userEmail: { fontSize: 12, color: COLORS.grayText, marginTop: 2 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.green, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, marginTop: 6, alignSelf: 'flex-start' },
  badgeText: { color: COLORS.white, fontSize: 10, fontWeight: '600', marginLeft: 4 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginTop: 12, marginBottom: 6, paddingHorizontal: 4 },
  appInfo: { alignItems: 'center', marginTop: 24, marginBottom: 16 },
  appLogo: { width: 48, height: 48, marginBottom: 6 },
  appVersion: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  appCopy: { fontSize: 10, color: COLORS.grayText, marginTop: 2 },
});