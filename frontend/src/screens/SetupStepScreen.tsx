import React, { type ReactNode } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import {
  FigmaScreen,
  FIGMA_COLORS,
  PageTitle,
  PrimaryAction,
  ScreenFooter,
  SurfaceCard,
  figmaStyles,
} from '../components/FigmaScreen';

export type SetupStepScreenProps = {
  onBack: () => void;
  onContinue: () => void;
  title: string;
  subtitle: string;
  icon: ReactNode;
  instructions: string[];
  actionLabel?: string;
  stepLabel?: string;
};

export default function SetupStepScreen({
  onBack,
  onContinue,
  title,
  subtitle,
  icon,
  instructions,
  actionLabel = 'Continuar',
  stepLabel,
}: SetupStepScreenProps) {
  return (
    <FigmaScreen onBack={onBack}>
      <PageTitle title={title} subtitle={subtitle} />
      <View style={styles.hero}>{icon}</View>
      {stepLabel ? <Text style={styles.stepLabel}>{stepLabel}</Text> : null}
      <SurfaceCard>
        {instructions.map((instruction, index) => (
          <View key={instruction} style={styles.instructionRow}>
            <View style={styles.number}>
              <Text style={styles.numberText}>{index + 1}</Text>
            </View>
            <Text style={[figmaStyles.body, styles.instructionText]}>{instruction}</Text>
          </View>
        ))}
        <View style={styles.note}>
          <CheckCircle2 color={FIGMA_COLORS.primary} size={19} />
          <Text style={styles.noteText}>Podés cambiar esta opción más adelante.</Text>
        </View>
      </SurfaceCard>
      <ScreenFooter>
        <PrimaryAction
          label={actionLabel}
          onPress={onContinue}
        />
      </ScreenFooter>
    </FigmaScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: FIGMA_COLORS.softPurple,
    borderRadius: 34,
    height: 68,
    justifyContent: 'center',
    marginBottom: 18,
    width: 68,
  },
  stepLabel: {
    color: FIGMA_COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  instructionRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 16,
  },
  number: {
    alignItems: 'center',
    backgroundColor: FIGMA_COLORS.softPurple,
    borderRadius: 12,
    height: 26,
    justifyContent: 'center',
    marginRight: 12,
    width: 26,
  },
  numberText: {
    color: FIGMA_COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  instructionText: {
    flex: 1,
  },
  note: {
    alignItems: 'center',
    borderTopColor: FIGMA_COLORS.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
    paddingTop: 14,
  },
  noteText: {
    color: FIGMA_COLORS.muted,
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});
