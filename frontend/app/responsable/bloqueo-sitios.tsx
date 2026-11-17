import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import Header from '../../components/Header';
import OptionCard from '../../components/OptionCard';
import PrimaryButton from '../../components/PrimaryButton';
import AppIcon from '../../components/AppIcon';
import { COLORS } from '../../constants/colors';
import { getSitiosPersonalizados, addSitioPersonalizado, removeSitioPersonalizado, getListaNegra, addSitioListaNegra, removeSitioListaNegra } from '../../utils/sites';

type Screen = 'menu' | 'personalizado' | 'lista-negra';

export default function BloqueoSitios() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [sitios, setSitios] = useState<string[]>([]);
  const [negra, setNegra] = useState<string[]>([]);
  const [sitioInput, setSitioInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, n] = await Promise.all([getSitiosPersonalizados(), getListaNegra()]);
      setSitios(s); setNegra(n); setLoading(false);
    })();
  }, []);

  const agregarPersonalizado = async () => {
    if (!sitioInput.trim()) return;
    setSitios(await addSitioPersonalizado(sitioInput));
    setSitioInput('');
  };

  const eliminarPersonalizado = async (site: string) => {
    Alert.alert('Eliminar sitio', `¿Querés quitar "${site}" de la lista?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => setSitios(await removeSitioPersonalizado(site)) },
    ]);
  };

  const eliminarNegra = async (site: string) => {
    Alert.alert('Eliminar sitio', `¿Querés quitar "${site}" de la lista negra?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => setNegra(await removeSitioListaNegra(site)) },
    ]);
  };

  if (loading) return <View style={[styles.container, styles.center]}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  if (screen === 'personalizado') {
    return (
      <View style={styles.container}>
        <Header title="BA Protege+" subtitle="Bloquear Sitios" />
        <Text style={styles.caption}>Añadí sitios a la lista personalizada</Text>
        <View style={styles.searchWrap}>
          <AppIcon name="globe" size={16} color={COLORS.grayText} />
          <TextInput style={styles.search} placeholder="ej. www.instagram.com" value={sitioInput} onChangeText={setSitioInput} autoCapitalize="none" autoCorrect={false} onSubmitEditing={agregarPersonalizado} returnKeyType="done" />
          <TouchableOpacity onPress={agregarPersonalizado} hitSlop={10}><AppIcon name="next" size={20} color={COLORS.primary} /></TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}>
          {sitios.length === 0 && <View style={styles.emptyBox}><AppIcon name="list" size={32} color={COLORS.grayText} /><Text style={styles.emptyText}>No hay sitios personalizados todavía.</Text></View>}
          {sitios.map((s) => (
            <View key={s} style={styles.listItem}>
              <AppIcon name="globe" size={16} color={COLORS.primary} />
              <Text style={styles.listText}>{s}</Text>
              <TouchableOpacity onPress={() => eliminarPersonalizado(s)} hitSlop={10}><AppIcon name="removeCircle" size={20} color={COLORS.orange} /></TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <View style={{ paddingHorizontal: 16 }}><PrimaryButton title="Atrás" variant="outline" onPress={() => setScreen('menu')} /></View>
      </View>
    );
  }

  if (screen === 'lista-negra') {
    return (
      <View style={styles.container}>
        <Header title="BA Protege+" subtitle="Lista Negra" />
        <Text style={styles.caption}>Lista bloqueada por LUTIXA</Text>
        <ScrollView style={styles.blackList}>
          {negra.map((s) => (
            <View key={s} style={styles.blackItemRow}>
              <AppIcon name="removeCircle" size={16} color={COLORS.primary} />
              <Text style={styles.blackItem}>{s}</Text>
              <TouchableOpacity onPress={() => eliminarNegra(s)} hitSlop={10}><AppIcon name="removeCircle" size={18} color={COLORS.orange} /></TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <View style={{ paddingHorizontal: 16 }}><PrimaryButton title="Atrás" variant="outline" onPress={() => setScreen('menu')} /></View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="BA Protege+" subtitle="Bloquear Sitios" />
      <Text style={styles.caption}>Gestioná los sitios bloqueados</Text>
      <View style={{ paddingHorizontal: 16 }}>
        <OptionCard icon="list" title="Lista Personalizada" subtitle={`${sitios.length} sitio${sitios.length === 1 ? '' : 's'} agregado${sitios.length === 1 ? '' : 's'}`} color="purple" onPress={() => setScreen('personalizado')} />
        <OptionCard icon="ban" title="Lista Negra" subtitle={`${negra.length} sitios bloqueados por LUTIXA`} color="purple" onPress={() => setScreen('lista-negra')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  caption: { textAlign: 'center', color: COLORS.grayText, fontSize: 12, marginVertical: 10 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.white, marginHorizontal: 16, marginBottom: 10, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.gray },
  search: { flex: 1, fontSize: 13, paddingVertical: 2 },
  emptyBox: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 12, color: COLORS.grayText, marginTop: 8 },
  listItem: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.white, marginVertical: 4, padding: 12, borderRadius: 8 },
  listText: { flex: 1, fontSize: 13, color: COLORS.black },
  blackList: { marginHorizontal: 16, backgroundColor: COLORS.white, borderRadius: 10, padding: 12, marginBottom: 12 },
  blackItemRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  blackItem: { flex: 1, fontSize: 13, color: COLORS.primary },
});