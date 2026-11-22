import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { FIGMA_COLORS } from './FigmaScreen';

export default function OnboardingBullet({ text }: { text: string }) {
    return (
        <View style={styles.row}>
            <View style={styles.check}>
                <Check color={FIGMA_COLORS.surface} size={12} strokeWidth={3} />
            </View>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginVertical: 6,
    },
    check: {
        alignItems: 'center',
        backgroundColor: FIGMA_COLORS.positive,
        borderRadius: 10,
        height: 20,
        justifyContent: 'center',
        marginRight: 10,
        marginTop: 1,
        width: 20,
    },
    text: {
        color: FIGMA_COLORS.text,
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
});