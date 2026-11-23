import React, { useRef } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    type TextInputInstance,
} from 'react-native';
import { FIGMA_COLORS } from './FigmaScreen';

type PinEntryProps = {
    value: string;
    onChangeText: (value: string) => void;
    length?: number;
    masked?: boolean;
    accessibilityLabel: string;
};

export default function PinEntry({
                                     value,
                                     onChangeText,
                                     length = 5,
                                     masked = false,
                                     accessibilityLabel,
                                 }: PinEntryProps) {
    const inputRef = useRef<TextInputInstance | null>(null);

    return (
        <Pressable
            accessibilityLabel={`Ingresar ${accessibilityLabel}`}
            accessibilityRole="button"
            onPress={() => inputRef.current?.focus()}
            style={styles.wrap}
        >
            <View style={styles.row}>
                {Array.from({ length }, (_, index) => (
                    <View key={index} style={styles.cell}>
                        <Text style={styles.digit}>
                            {value[index] ? (masked ? '•' : value[index]) : ''}
                        </Text>
                    </View>
                ))}
            </View>
            <TextInput
                ref={inputRef}
                accessibilityLabel={accessibilityLabel}
                autoComplete="off"
                keyboardType="number-pad"
                maxLength={length}
                onChangeText={text => onChangeText(text.replace(/\D/g, '').slice(0, length))}
                style={styles.hiddenInput}
                textContentType="none"
                value={value}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    wrap: {
        alignSelf: 'stretch',
        position: 'relative',
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        marginVertical: 10,
    },
    cell: {
        alignItems: 'center',
        backgroundColor: FIGMA_COLORS.softPurple,
        borderColor: FIGMA_COLORS.primary,
        borderRadius: 10,
        borderWidth: 1,
        height: 52,
        justifyContent: 'center',
        width: 48,
    },
    digit: {
        color: FIGMA_COLORS.primary,
        fontSize: 22,
        fontWeight: '700',
    },
    hiddenInput: {
        bottom: 0,
        color: 'transparent',
        height: 52,
        left: 0,
        opacity: 0.02,
        position: 'absolute',
        right: 0,
        top: 0,
    },
});