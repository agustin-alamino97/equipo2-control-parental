import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { FIGMA_COLORS } from './FigmaScreen';

type SettingRowProps = {
    title: string;
    description?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
};

export default function SettingRow({
                                       title,
                                       description,
                                       value,
                                       onValueChange,
                                   }: SettingRowProps) {
    return (
        <View style={styles.row}>
            <View style={styles.body}>
                <Text style={styles.title}>{title}</Text>
                {description ? <Text style={styles.description}>{description}</Text> : null}
            </View>
            <Switch
                accessibilityLabel={title}
                onValueChange={onValueChange}
                thumbColor={FIGMA_COLORS.surface}
                trackColor={{ false: FIGMA_COLORS.border, true: FIGMA_COLORS.positive }}
                value={value}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        alignItems: 'center',
        backgroundColor: FIGMA_COLORS.surface,
        borderColor: FIGMA_COLORS.border,
        borderRadius: 14,
        borderWidth: 1,
        flexDirection: 'row',
        marginBottom: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    body: {
        flex: 1,
        paddingRight: 12,
    },
    title: {
        color: FIGMA_COLORS.text,
        fontSize: 15,
        fontWeight: '600',
    },
    description: {
        color: FIGMA_COLORS.muted,
        fontSize: 12,
        lineHeight: 17,
        marginTop: 3,
    },
});