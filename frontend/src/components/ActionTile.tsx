import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { FIGMA_COLORS } from './FigmaScreen';

type ActionTileProps = {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    onPress: () => void;
    tone?: 'primary' | 'positive';
    variant?: 'mode' | 'card';
};

export default function ActionTile({
                                       icon,
                                       title,
                                       subtitle,
                                       onPress,
                                       tone = 'primary',
                                       variant = 'mode',
                                   }: ActionTileProps) {
    const bg = tone === 'positive' ? FIGMA_COLORS.positive : FIGMA_COLORS.primary;
    const isCard = variant === 'card';

    return (
        <TouchableOpacity
            accessibilityLabel={title}
            accessibilityRole="button"
            onPress={onPress}
            style={[styles.tile, { backgroundColor: bg }, isCard && styles.card]}
        >
            <View style={[styles.iconWrap, isCard && styles.iconWrapCard]}>
                {icon}
            </View>
            <View style={styles.body}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            <ChevronRight color={FIGMA_COLORS.surface} size={20} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    tile: {
        alignItems: 'center',
        borderRadius: 14,
        flexDirection: 'row',
        marginBottom: 12,
        minHeight: 74,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    card: {
        minHeight: 78,
    },
    iconWrap: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: 22,
        height: 44,
        justifyContent: 'center',
        marginRight: 12,
        width: 44,
    },
    iconWrapCard: {
        backgroundColor: FIGMA_COLORS.surface,
        borderRadius: 18,
        height: 36,
        width: 36,
    },
    body: {
        flex: 1,
    },
    title: {
        color: FIGMA_COLORS.surface,
        fontSize: 15,
        fontWeight: '700',
    },
    subtitle: {
        color: FIGMA_COLORS.surface,
        fontSize: 12,
        lineHeight: 16,
        marginTop: 3,
        opacity: 0.9,
    },
});