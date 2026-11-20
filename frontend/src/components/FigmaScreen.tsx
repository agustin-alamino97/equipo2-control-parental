import React, { type ReactNode } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ShieldCheck } from 'lucide-react-native';

export const FIGMA_COLORS = {
  primary: '#4B35A5',
  primaryDark: '#39277F',
  accent: '#6B52D4',
  background: '#F6F5FA',
  surface: '#FFFFFF',
  text: '#292638',
  muted: '#777485',
  border: '#E8E6EF',
  positive: '#24A36A',
  warning: '#F0A733',
  danger: '#D84E5B',
  softPurple: '#EFEDFA',
} as const;

type FigmaScreenProps = {
  children: ReactNode;
  onBack?: () => void;
  footer?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function FigmaScreen({
  children,
  onBack,
  footer,
  contentContainerStyle,
}: FigmaScreenProps) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.headerRow}>
          {onBack ? (
            <TouchableOpacity
              accessibilityLabel="Volver"
              accessibilityRole="button"
              onPress={onBack}
              style={styles.backButton}
            >
              <ArrowLeft color={FIGMA_COLORS.surface} size={22} />
            </TouchableOpacity>
          ) : (
            <View style={styles.backButton} />
          )}
          <View style={styles.brand}>
            <ShieldCheck color={FIGMA_COLORS.surface} size={21} strokeWidth={2.2} />
            <Text style={styles.brandText}>BA Protege+</Text>
          </View>
          <View style={styles.backButton} />
        </View>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      {footer}
    </SafeAreaView>
  );
}

export function PageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.titleBlock}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function PrimaryAction({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.primaryAction, disabled && styles.disabledAction]}
    >
      <Text style={styles.primaryActionText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function ScreenFooter({ children }: { children: ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

export function SurfaceCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function InlineRow({
  icon,
  children,
}: {
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <View style={styles.inlineRow}>
      {icon ? <View style={styles.rowIcon}>{icon}</View> : null}
      <View style={styles.rowBody}>{children}</View>
    </View>
  );
}

export const figmaStyles = StyleSheet.create({
  body: {
    color: FIGMA_COLORS.text,
    fontSize: 15,
    lineHeight: 22,
  },
  caption: {
    color: FIGMA_COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  sectionTitle: {
    color: FIGMA_COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  rowTitle: {
    color: FIGMA_COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
});

const styles = StyleSheet.create({
  root: {
    backgroundColor: FIGMA_COLORS.background,
    flex: 1,
  },
  header: {
    backgroundColor: FIGMA_COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 38,
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 38,
    width: 38,
  },
  brand: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  brandText: {
    color: FIGMA_COLORS.surface,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  titleBlock: {
    marginBottom: 20,
  },
  title: {
    color: FIGMA_COLORS.text,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },
  subtitle: {
    color: FIGMA_COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: FIGMA_COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
  },
  disabledAction: {
    opacity: 0.55,
  },
  primaryActionText: {
    color: FIGMA_COLORS.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    backgroundColor: FIGMA_COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  card: {
    backgroundColor: FIGMA_COLORS.surface,
    borderColor: FIGMA_COLORS.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  inlineRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  rowIcon: {
    alignItems: 'center',
    backgroundColor: FIGMA_COLORS.softPurple,
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    marginRight: 12,
    width: 42,
  },
  rowBody: {
    flex: 1,
  },
});
