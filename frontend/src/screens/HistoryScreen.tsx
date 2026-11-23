import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Clock3, Globe2, ShieldCheck } from 'lucide-react-native';
import {
  FigmaScreen,
  PageTitle,
  SurfaceCard,
  FIGMA_COLORS,
  figmaStyles,
} from '../components/FigmaScreen';
import { RECENT_HISTORY } from '../data/historyEntries';
import type { AppScreenProps } from '../navigation/types';

export default function HistoryScreen({ navigation }: AppScreenProps<'History'>) {
  return (
      <FigmaScreen onBack={() => navigation.goBack()}>
        <PageTitle
            title="Historial"
            subtitle="Actividad reciente del dispositivo protegido."
        />
        <Text style={figmaStyles.sectionTitle}>Hoy</Text>
        <SurfaceCard>
          {RECENT_HISTORY.map((item, index) => (
              <View
                  key={item.id}
                  style={[styles.event, index > 0 && styles.dividedEvent]}
              >
                <View
                    style={[
                      styles.eventIcon,
                      item.blocked ? styles.blockedIcon : styles.allowedIcon,
                    ]}
                >
                  {item.blocked ? (
                      <ShieldCheck color={FIGMA_COLORS.primary} size={20} />
                  ) : (
                      <Globe2 color={FIGMA_COLORS.positive} size={20} />
                  )}
                </View>
                <View style={styles.eventBody}>
                  <Text style={styles.site}>{item.site}</Text>
                  <Text style={styles.detail}>{item.detail}</Text>
                </View>
                <View style={styles.time}>
                  <Clock3 color={FIGMA_COLORS.muted} size={13} />
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
              </View>
          ))}
        </SurfaceCard>
        <Text style={styles.footnote}>
          El historial se actualiza cuando el dispositivo protegido tiene conexión.
        </Text>
      </FigmaScreen>
  );
}

const styles = StyleSheet.create({
  event: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 13,
  },
  dividedEvent: {
    borderTopColor: FIGMA_COLORS.border,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  eventIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    marginRight: 12,
    width: 42,
  },
  blockedIcon: {
    backgroundColor: FIGMA_COLORS.softPurple,
  },
  allowedIcon: {
    backgroundColor: '#E8F7EF',
  },
  eventBody: {
    flex: 1,
  },
  site: {
    ...figmaStyles.rowTitle,
  },
  detail: {
    color: FIGMA_COLORS.muted,
    fontSize: 12,
    marginTop: 4,
  },
  time: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginLeft: 8,
  },
  timeText: {
    color: FIGMA_COLORS.muted,
    fontSize: 11,
  },
  footnote: {
    color: FIGMA_COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 16,
    textAlign: 'center',
  },
});