import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FIGMA_COLORS } from './FigmaScreen';

type ButtonVariant = 'filled' | 'outline';

type ButtonProps = {
    label: string;
    onPress: () => void;
    variant?: ButtonVariant;
    disabled?: boolean;
    accessibilityLabel?: string;
};

export default function Button({
                                   label,
                                   onPress,
                                   variant = 'filled',
                                   disabled = false,
                                   accessibilityLabel,
                               }: ButtonProps) {
    const isOutline = variant === 'outline';
    return (
        <TouchableOpacity
            accessibilityLabel={accessibilityLabel ?? label}
            accessibilityRole="button"
            disabled={disabled}
            onPress={onPress}
            style={[
                styles.base,
                isOutline ? styles.outline : styles.filled,
                disabled && styles.disabled,
            ]}
        >
            <Text
                style={[
                    styles.label,
                    isOutline ? styles.outlineLabel : styles.filledLabel,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        alignItems: 'center',
        borderRadius: 12,
        justifyContent: 'center',
        minHeight: 52,
        paddingHorizontal: 18,
    },
    filled: {
        backgroundColor: FIGMA_COLORS.primary,
    },
    outline: {
        backgroundColor: FIGMA_COLORS.surface,
        borderColor: FIGMA_COLORS.primary,
        borderWidth: 1,
    },
    disabled: {
        opacity: 0.55,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
    },
    filledLabel: {
        color: FIGMA_COLORS.surface,
    },
    outlineLabel: {
        color: FIGMA_COLORS.primary,
    },
});