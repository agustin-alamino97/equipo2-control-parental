import type { ComponentProps } from 'react';
import type OnboardingArtwork from '../components/OnboardingArtwork';

type ArtworkKind = ComponentProps<typeof OnboardingArtwork>['kind'];

export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export type OnboardingContent = {
    title: string;
    subtitle: string;
    bullets: string[];
    artwork?: ArtworkKind;
};

export const ONBOARDING_CONTENT: Record<OnboardingStep, OnboardingContent> = {
    1: {
        title: 'Navegación más segura para tus hijos',
        subtitle:
            'Control parental para prevenir el acceso a sitios de apuestas ilegales y otros contenidos riesgosos.',
        bullets: [],
    },
    2: {
        title: '1. Registrate',
        subtitle: 'Creá tu cuenta para empezar a proteger a tus hijos.',
        bullets: [
            'Es rápido y seguro',
            'Podés ser el responsable',
            'Gestioná todos tus dispositivos.',
        ],
        artwork: 'register',
    },
    3: {
        title: '2. Configurá el modo responsable',
        subtitle: 'Elegí el modo responsable para gestionar la protección de tus hijos.',
        bullets: [
            'Activá el VPN y configurá tu celular',
            'Bloqueá sitios de apuestas ilegales',
            'Recibí alertas de actividad',
        ],
        artwork: 'responsible',
    },
    4: {
        title: '3. Instalá la aplicación en el dispositivo del menor',
        subtitle: 'Descargá BA Protege+ en el dispositivo que usarán tus hijos.',
        bullets: [],
        artwork: 'install',
    },
    5: {
        title: '4. Vinculá el dispositivo con la clave de acceso',
        subtitle: 'Ingresá la clave para vincular el dispositivo del menor.',
        bullets: [
            'Configurá el dispositivo del menor en Modo Protegido para que tu hijo no pueda desinstalar BA Protege+.',
        ],
        artwork: 'access',
    },
};

export const ONBOARDING_STEPS: OnboardingStep[] = [1, 2, 3, 4, 5];