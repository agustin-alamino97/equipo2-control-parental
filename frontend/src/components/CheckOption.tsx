import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { FIGMA_COLORS } from './FigmaScreen';

type CheckOptionProps = {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
};

export default function CheckOption({ label, value, onChange }: CheckOptionProps) {
    return (
        <Pressable
            accessibilityLabel={label}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: value }}
            onPress={() => onChange(!value)}
            style={styles.row}
        >
            <View style={[styles.box, value && styles.boxChecked]}>
                {value ? <Check color={FIGMA_COLORS.surface} size={14} strokeWidth={3} /> : null}
            </View>
            <Text style={styles.label}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        minHeight: 32,
        paddingVertical: 4,
    },
    box: {
        alignItems: 'center',
        borderColor: FIGMA_COLORS.primary,
        borderRadius: 4,
        borderWidth: 1.5,
        height: 20,
        justifyContent: 'center',
        marginRight: 10,
        width: 20,
    },
    boxChecked: {
        backgroundColor: FIGMA_COLORS.primary,
    },
    label: {
        color: FIGMA_COLORS.text,
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
});