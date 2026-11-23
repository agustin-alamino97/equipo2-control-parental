import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Clock3, Home, UserRound } from 'lucide-react-native';
import { FIGMA_COLORS } from './FigmaScreen';

export type BottomTabKey = 'home' | 'history' | 'profile';

type BottomTabsProps = {
    active: BottomTabKey;
    onHome: () => void;
    onHistory: () => void;
    onProfile: () => void;
};

export default function BottomTabs({
                                       active,
                                       onHome,
                                       onHistory,
                                       onProfile,
                                   }: BottomTabsProps) {
    return (
        <View style={styles.bar}>
            <Tab
                active={active === 'home'}
                icon={<Home color={FIGMA_COLORS.surface} size={20} />}
                label="Home"
                onPress={onHome}
            />
            <Tab
                active={active === 'history'}
                icon={<Clock3 color={FIGMA_COLORS.surface} size={20} />}
                label="Historial"
                onPress={onHistory}
            />
            <Tab
                active={active === 'profile'}
                icon={<UserRound color={FIGMA_COLORS.surface} size={20} />}
                label="Perfil"
                onPress={onProfile}
            />
        </View>
    );
}

function Tab({
                 icon,
                 label,
                 active,
                 onPress,
             }: {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            accessibilityLabel={label}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={onPress}
            style={styles.tab}
        >
            {icon}
            <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    bar: {
        alignItems: 'center',
        backgroundColor: FIGMA_COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'space-around',
        minHeight: 58,
        paddingBottom: 6,
        paddingTop: 6,
    },
    tab: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        minHeight: 46,
    },
    label: {
        color: FIGMA_COLORS.surface,
        fontSize: 11,
        marginTop: 3,
        opacity: 0.75,
    },
    labelActive: {
        fontWeight: '700',
        opacity: 1,
    },
});