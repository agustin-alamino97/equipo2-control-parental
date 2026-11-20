import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ban, ChevronRight, Globe2, ListFilter, Plus } from 'lucide-react-native';
import {
  FigmaScreen,
  FIGMA_COLORS,
  PageTitle,
  SurfaceCard,
  figmaStyles,
} from '../components/FigmaScreen';
import type { AppScreenProps } from '../navigation/types';

export default function BlockedSitesScreen({
  navigation,
}: AppScreenProps<'BlockedSites'>) {
  return (
    <FigmaScreen onBack={() => navigation.goBack()}>
      <PageTitle
        title="Sitios bloqueados"
        subtitle="Administrá el contenido que no puede abrirse en los dispositivos protegidos."
      />
      <SurfaceCard style={styles.summary}>
        <View style={styles.summaryIcon}>
          <Ban color={FIGMA_COLORS.primary} size={24} />
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.count}>Apuestas</Text>
          <Text style={styles.summaryCaption}>Categoría de protección activa</Text>
        </View>
        <View style={styles.status}>
          <Text style={styles.statusText}>ACTIVO</Text>
        </View>
      </SurfaceCard>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => navigation.navigate('Blacklist')}
        style={styles.sectionLink}
      >
        <View style={styles.sectionIcon}>
          <ListFilter color={FIGMA_COLORS.primary} size={20} />
        </View>
        <View style={styles.linkText}>
          <Text style={figmaStyles.rowTitle}>Lista negra</Text>
          <Text style={styles.summaryCaption}>Sitios agregados manualmente</Text>
        </View>
        <ChevronRight color={FIGMA_COLORS.muted} size={19} />
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Categorías protegidas</Text>
      <SurfaceCard>
        <View style={styles.categoryRow}>
          <View style={styles.categoryIcon}>
            <Globe2 color={FIGMA_COLORS.primary} size={19} />
          </View>
          <View style={styles.linkText}>
            <Text style={figmaStyles.rowTitle}>Sitios de apuestas</Text>
            <Text style={styles.summaryCaption}>Bloqueo de sitios y aplicaciones</Text>
          </View>
          <Text style={styles.activeText}>Activado</Text>
        </View>
      </SurfaceCard>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => navigation.navigate('Blacklist')}
        style={styles.addButton}
      >
        <Plus color={FIGMA_COLORS.primary} size={19} />
        <Text style={styles.addText}>Administrar lista negra</Text>
      </TouchableOpacity>
    </FigmaScreen>
  );
}

const styles = StyleSheet.create({
  summary: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  summaryIcon: {
    alignItems: 'center',
    backgroundColor: FIGMA_COLORS.softPurple,
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    marginRight: 12,
    width: 44,
  },
  summaryText: {
    flex: 1,
  },
  count: {
    color: FIGMA_COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  summaryCaption: {
    color: FIGMA_COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
  status: {
    backgroundColor: '#E8F7EF',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusText: {
    color: FIGMA_COLORS.positive,
    fontSize: 10,
    fontWeight: '700',
  },
  sectionLink: {
    alignItems: 'center',
    backgroundColor: FIGMA_COLORS.surface,
    borderColor: FIGMA_COLORS.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 26,
    padding: 14,
  },
  sectionIcon: {
    alignItems: 'center',
    backgroundColor: FIGMA_COLORS.softPurple,
    borderRadius: 11,
    height: 40,
    justifyContent: 'center',
    marginRight: 12,
    width: 40,
  },
  linkText: {
    flex: 1,
  },
  sectionTitle: {
    color: FIGMA_COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  categoryRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  categoryIcon: {
    alignItems: 'center',
    backgroundColor: FIGMA_COLORS.softPurple,
    borderRadius: 10,
    height: 38,
    justifyContent: 'center',
    marginRight: 11,
    width: 38,
  },
  activeText: {
    color: FIGMA_COLORS.positive,
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    padding: 10,
  },
  addText: {
    color: FIGMA_COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
