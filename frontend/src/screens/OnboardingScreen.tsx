import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import OnboardingArtwork from '../components/OnboardingArtwork';
import OnboardingBullet from '../components/OnboardingBullet';
import LotbaBrandMark from '../components/LotbaBrandMark';
import { FIGMA_COLORS } from '../components';
import { ONBOARDING_CONTENT, type OnboardingStep } from '../data';
import type { AppScreenProps } from '../navigation/types';

export default function OnboardingScreen({
                                             navigation,
                                             route,
                                         }: AppScreenProps<'Onboarding'>) {
    const step: OnboardingStep = (route.params?.step ?? 1) as OnboardingStep;
    const content = ONBOARDING_CONTENT[step];

    const goNext = () => {
        if (step < 5) {
            navigation.replace('Onboarding', { step: (step + 1) as OnboardingStep });
        } else {
            navigation.replace('Welcome');
        }
    };

    return (
        <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
            <StatusBar barStyle="dark-content" />
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {step === 1 ? (
                    <>
                        <Text style={styles.brand}>BA Protege+</Text>
                        <LotbaBrandMark size={280} />
                    </>
                ) : null}
                <Text style={[styles.title, step > 1 && styles.titleCompact]}>
                    {content.title}
                </Text>
                <Text style={styles.subtitle}>{content.subtitle}</Text>
                {content.artwork ? <OnboardingArtwork kind={content.artwork} /> : null}
                {content.bullets.length > 0 ? (
                    <View style={styles.bullets}>
                        {content.bullets.map(bullet => (
                            <OnboardingBullet key={bullet} text={bullet} />
                        ))}
                    </View>
                ) : null}
            </ScrollView>
            <View style={styles.actions}>
                <Button label="Siguiente" onPress={goNext} />
                <TouchableOpacity
                    accessibilityLabel="Omitir onboarding"
                    accessibilityRole="button"
                    onPress={() => navigation.replace('Welcome')}
                    style={styles.skip}
                >
                    <Text style={styles.skipText}>Omitir</Text>
                </TouchableOpacity>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${(step / 5) * 100}%` }]} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: FIGMA_COLORS.surface,
        flex: 1,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 24,
    },
    brand: {
        color: FIGMA_COLORS.primary,
        fontSize: 30,
        fontWeight: '700',
    },
    title: {
        color: FIGMA_COLORS.text,
        fontSize: 28,
        fontWeight: '700',
        lineHeight: 35,
        marginTop: 12,
        marginBottom: 12,
        textAlign: 'center',
    },
    titleCompact: {
        fontSize: 28,
        lineHeight:35,
        marginTop: 30,
    },
    subtitle: {
        color: FIGMA_COLORS.muted,
        fontSize: 16,
        lineHeight: 20,
        marginTop: 10,
        textAlign: 'center',
    },
    bullets: {
        alignSelf: 'stretch',
        marginTop: 16,
    },
    actions: {
        paddingBottom: 22,
        paddingHorizontal: 20,
    },
    skip: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    skipText: {
        color: FIGMA_COLORS.primary,
        fontSize: 15,
        fontWeight: '600',
    },
    progressTrack: {
        backgroundColor: FIGMA_COLORS.softPurple,
        borderRadius: 3,
        height: 4,
        marginTop: 8,
        overflow: 'hidden',
    },
    progressFill: {
        backgroundColor: FIGMA_COLORS.primary,
        height: 4,
    },
});