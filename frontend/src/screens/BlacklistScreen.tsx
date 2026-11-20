import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Globe2, Plus, Trash2 } from 'lucide-react-native';
import {
  FigmaScreen,
  FIGMA_COLORS,
  PageTitle,
  SurfaceCard,
} from '../components/FigmaScreen';
import type { AppScreenProps } from '../navigation/types';

export default function BlacklistScreen({ navigation }: AppScreenProps<'Blacklist'>) {
  const [site, setSite] = useState('');
  const [sites, setSites] = useState(['ejemplo-apuestas.com', 'casino-ejemplo.net']);
  const canAdd = site.trim().length > 0;

  const addSite = () => {
    const newSite = site.trim();
    if (!newSite) return;
    setSites(current => [newSite, ...current]);
    setSite('');
  };

  return (
    <FigmaScreen onBack={() => navigation.goBack()}>
      <PageTitle
        title="Lista negra"
        subtitle="Agregá sitios que quieras bloquear manualmente."
      />
      <View style={styles.inputRow}>
        <TextInput
          accessibilityLabel="Dirección del sitio"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          onChangeText={setSite}
          onSubmitEditing={addSite}
          placeholder="sitio.com"
          placeholderTextColor={FIGMA_COLORS.muted}
          returnKeyType="done"
          style={styles.input}
          value={site}
        />
        <TouchableOpacity
          accessibilityLabel="Agregar sitio"
          accessibilityRole="button"
          disabled={!canAdd}
          onPress={addSite}
          style={[styles.addButton, !canAdd && styles.disabled]}
        >
          <Plus color={FIGMA_COLORS.surface} size={22} />
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Sitios bloqueados ({sites.length})</Text>
      <SurfaceCard style={styles.list}>
        {sites.map((item, index) => (
          <View
            key={`${item}-${index}`}
            style={[styles.siteRow, index > 0 && styles.divided]}
          >
            <View style={styles.siteIcon}>
              <Globe2 color={FIGMA_COLORS.primary} size={18} />
            </View>
            <Text style={styles.siteName}>{item}</Text>
            <TouchableOpacity
              accessibilityLabel={`Quitar ${item}`}
              accessibilityRole="button"
              onPress={() => setSites(current => current.filter((_, i) => i !== index))}
              style={styles.removeButton}
            >
              <Trash2 color={FIGMA_COLORS.muted} size={18} />
            </TouchableOpacity>
          </View>
        ))}
        {sites.length === 0 ? (
          <Text style={styles.empty}>Todavía no agregaste sitios.</Text>
        ) : null}
      </SurfaceCard>
    </FigmaScreen>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 25,
  },
  input: {
    backgroundColor: FIGMA_COLORS.surface,
    borderColor: FIGMA_COLORS.border,
    borderRadius: 12,
    borderWidth: 1,
    color: FIGMA_COLORS.text,
    flex: 1,
    fontSize: 15,
    height: 50,
    paddingHorizontal: 14,
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
