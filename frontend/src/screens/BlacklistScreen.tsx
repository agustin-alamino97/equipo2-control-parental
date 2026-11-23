import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { Globe2, Plus, Trash2 } from 'lucide-react-native';
import TextField from '../components/TextField';
import {
  FigmaScreen,
  PageTitle,
  SurfaceCard,
  FIGMA_COLORS,
} from '../components';
import { api, type CustomRule } from '../services/api';
import type { AppScreenProps } from '../navigation/types';

export default function BlacklistScreen({ navigation }: AppScreenProps<'Blacklist'>) {
  const [site, setSite] = useState('');
  const [sites, setSites] = useState<CustomRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canAdd = site.trim().length > 0;

  useEffect(() => {
    fetchSites();
  }, []);

  // const fetchSites = async () => {
  //   try {
  //     setLoading(true);
  //     console.log('[Blacklist] Fetching sites...');
  //     const data = await api.getCustomRules();
  //     console.log('[Blacklist] Sites fetched:', data);
  //     setSites(data);
  //   } catch (error: any) {
  //     console.error('[Blacklist] Error fetching:', error);
  //     Alert.alert('Error', error.message || 'No se pudo cargar la lista negra');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchSites = async () => {
    try {
      setLoading(true);
      console.log('[Blacklist] Fetching sites...'); // ← ya lo tenés
      const data = await api.getCustomRules();
      console.log('[Blacklist] Sites fetched:', data); // ← ya lo tenés
      setSites(data);
      console.log('[Blacklist] setSites called with:', data.length, 'items');
    } catch (error: any) {
      console.error('[Blacklist] Error fetching:', error);
      Alert.alert('Error', error.message || 'No se pudo cargar la lista negra');
    } finally {
      setLoading(false);
      console.log('[Blacklist] Loading complete');
    }
  };

  // const addSite = async () => {
  //   const newSite = site.trim();
  //   if (!newSite) return;
  //
  //   try {
  //     setIsSubmitting(true);
  //     console.log('[Blacklist] Adding site:', newSite);
  //     const newRule = await api.addCustomRule(newSite);
  //     console.log('[Blacklist] Rule created:', newRule);
  //     setSites(current => [newRule, ...current]);
  //     setSite('');
  //   } catch (error: any) {
  //     console.error('[Blacklist] Error adding:', error);
  //     Alert.alert('Error', error.message || 'No se pudo agregar el sitio');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const addSite = async () => {
    const newSite = site.trim().toLowerCase();
    if (!newSite) return;

    // Validación en cliente: ¿ya está en la lista?
    const alreadyExists = sites.some(
        s => s.value.toLowerCase() === newSite
    );

    if (alreadyExists) {
      Alert.alert(
          'Sitio ya bloqueado',
          `${newSite} ya está en tu lista de sitios bloqueados.`
      );
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('[Blacklist] Adding site:', newSite);
      const newRule = await api.addCustomRule(newSite);
      console.log('[Blacklist] Rule created:', newRule);

      // Por si el backend igual devuelve un duplicado (por race conditions),
      // evitamos agregarlo dos veces en el estado local
      setSites(current => {
        if (current.some(s => s.id === newRule.id)) {
          return current.map(s =>
              s.id === newRule.id ? newRule : s
          );
        }
        return [newRule, ...current];
      });

      setSite('');
    } catch (error: any) {
      console.error('[Blacklist] Error adding:', error);
      Alert.alert('Error', error.message || 'No se pudo agregar el sitio');
    } finally {
      setIsSubmitting(false);
    }
  };



  const removeSite = async (id: string, value: string) => {
    try {
      await api.deleteCustomRule(id);
      setSites(current => current.filter(s => s.id !== id));
    } catch (error: any) {
      Alert.alert('Error', `No se pudo quitar ${value}`);
    }
  };

  console.log('[Blacklist] RENDER - sites:', sites.length, 'loading:', loading);

  return (
      <FigmaScreen onBack={() => navigation.goBack()}>
        <PageTitle
            title="Lista negra"
            subtitle="Agregá sitios que quieras bloquear manualmente."
        />
        <View style={styles.inputRow}>
          <View style={styles.inputWrap}>
            <TextField
                placeholder="sitio.com"
                value={site}
                onChangeText={setSite}
            />
          </View>
          <TouchableOpacity
              accessibilityLabel="Agregar sitio"
              accessibilityRole="button"
              disabled={!canAdd || isSubmitting}
              onPress={addSite}
              style={[styles.addButton, (!canAdd || isSubmitting) && styles.disabled]}
          >
            {isSubmitting ? (
                <ActivityIndicator color={FIGMA_COLORS.surface} size="small" />
            ) : (
                <Plus color={FIGMA_COLORS.surface} size={22} />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Sitios bloqueados ({sites.length})</Text>

        <SurfaceCard style={styles.list}>
          {loading ? (
              <ActivityIndicator color={FIGMA_COLORS.primary} style={{ marginVertical: 30 }} />
          ) : sites.length === 0 ? (
              <Text style={styles.empty}>Todavía no agregaste sitios.</Text>
          ) : (
              sites.map((item, index) => (
                  <View
                      key={item.id}
                      style={[styles.siteRow, index > 0 && styles.divided]}
                  >
                    <View style={styles.siteIcon}>
                      <Globe2 color={FIGMA_COLORS.primary} size={18} />
                    </View>
                    <Text style={styles.siteName}>{item.value}</Text>
                    <TouchableOpacity
                        accessibilityLabel={`Quitar ${item.value}`}
                        accessibilityRole="button"
                        onPress={() => removeSite(item.id, item.value)}
                        style={styles.removeButton}
                    >
                      <Trash2 color={FIGMA_COLORS.muted} size={18} />
                    </TouchableOpacity>
                  </View>
              ))
          )}
        </SurfaceCard>
      </FigmaScreen>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 25,
  },
  inputWrap: {
    flex: 1,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: FIGMA_COLORS.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    marginLeft: 10,
    width: 50,
  },
  disabled: {
    opacity: 0.45,
  },
  sectionTitle: {
    color: FIGMA_COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  list: {
    paddingHorizontal: 14,
    paddingVertical: 0,
  },
  siteRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 58,
  },
  divided: {
    borderTopColor: FIGMA_COLORS.border,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  siteIcon: {
    alignItems: 'center',
    backgroundColor: FIGMA_COLORS.softPurple,
    borderRadius: 10,
    height: 34,
    justifyContent: 'center',
    marginRight: 11,
    width: 34,
  },
  siteName: {
    color: FIGMA_COLORS.text,
    flex: 1,
    fontSize: 14,
  },
  removeButton: {
    padding: 8,
  },
  empty: {
    color: FIGMA_COLORS.muted,
    fontSize: 14,
    paddingVertical: 20,
    textAlign: 'center',
  },
});