import React from 'react';
import { Image, StyleSheet } from 'react-native';

type ArtworkKind = 'register' | 'responsible' | 'install' | 'access';

const artworkSources = {
  register: require('../../assets/assetsonboarding-register.png'),
  responsible: require('../../assets/assetsonboarding-responsible.png'),
  install: require('../../assets/assetsonboarding-install.png'),
  access: require('../../assets/assetsonboarding-access.png'),
};

const artworkLabels: Record<ArtworkKind, string> = {
  register: 'Ilustración de registro',
  responsible: 'Ilustración de responsable y menor',
  install: 'Ilustración de menor con teléfono',
  access: 'Ilustración de código de acceso',
};

export default function OnboardingArtwork({ kind }: { kind: ArtworkKind }) {
  return (
    <Image
      accessible
      accessibilityLabel={artworkLabels[kind]}
      resizeMode="contain"
      source={artworkSources[kind]}
      style={styles.artwork}
    />
  );
}

const styles = StyleSheet.create({
  artwork: {
    height: 190,
    width: 230,
  },
});
