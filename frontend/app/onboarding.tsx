import React, { useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Dimensions,
  TouchableOpacity, ListRenderItemInfo, Image,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIcon from '../components/AppIcon';
import { COLORS } from '../constants/colors';
import { setOnboarded } from '../utils/storage';

const { width } = Dimensions.get('window');

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  image: any;
  bullets?: string[];
  showPlayStore?: boolean;
  showPin?: boolean;
};

const SLIDES: Slide[] = [
  {
    id: '1',
    title: 'Navegación más segura\npara tus hijos',
    subtitle: 'Control parental para prevenir el acceso a sitios de apuestas ilegales y otros contenidos riesgosos.',
    image: require('../assets/onboarding/BAProtege-logo.png'),
  },
  {
    id: '2',
    title: '1. Registrate',
    subtitle: 'Creá tu cuenta para empezar a proteger a tus hijos.',
    image: require('../assets/onboarding/registrate.png'),
    bullets: ['Es rápido y seguro', 'Podés ser el responsable', 'Gestioná todos tus dispositivos'],
  },
  {
    id: '3',
    title: '2. Configurá el modo responsable',
    subtitle: 'Elegí el modo responsable para gestionar la protección de tus hijos.',
    image: require('../assets/onboarding/modoresponsable.png'),
    bullets: ['Activá el VPN y configurá tu celular', 'Bloqueá sitios de apuestas ilegales', 'Recibí alertas de actividad'],
  },
  {
    id: '4',
    title: '3. Instalá la aplicación en el dispositivo del menor',
    subtitle: 'Descargá BA Protege+ en el dispositivo que usarán tus hijos.',
    image: require('../assets/onboarding/Instalaraplicacion.png'),
    showPlayStore: true,
  },
  {
    id: '5',
    title: '4. Vinculá el dispositivo con la clave de acceso',
    subtitle: 'Ingresá la clave para vincular el dispositivo del menor.',
    image: require('../assets/onboarding/VincularDispositivo.png'),
  },
  {
    id: '6',
    title: '¡Todo listo!',
    subtitle: 'Tu familia está protegida con BA Protege+.',
    image: require('../assets/onboarding/listo.png'),
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  const insets = useSafeAreaInsets();

  const finishOnboarding = useCallback(async () => {
    await setOnboarded(true);
    router.replace('/bienvenida');
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      finishOnboarding();
    }
  }, [currentIndex, finishOnboarding]);

  const handleSkip = useCallback(() => {
    finishOnboarding();
  }, [finishOnboarding]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const getItemLayout = (data: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  const renderItem = ({ item }: ListRenderItemInfo<Slide>) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>

      {item.bullets && (
        <View style={styles.bulletsContainer}>
          {item.bullets.map((bullet, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <AppIcon name="checkCircle" size={16} color={COLORS.green} />
              <Text style={styles.bulletText}>{bullet}</Text>
            </View>
          ))}
        </View>
      )}

      {item.showPlayStore && (
        <View style={styles.playStoreContainer}>
          <AppIcon name="phone" size={32} color={COLORS.black} />
          <Text style={styles.playStoreText}>Disponible en Google Play</Text>
        </View>
      )}

      {item.showPin && (
        <View style={styles.pinContainer}>
          {[1, 2, 3, 4, 5].map((_, i) => (
            <View key={i} style={styles.pinBox}>
              <Text style={styles.pinText}>*</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={getItemLayout}
          scrollEventThrottle={16}
        />
      </View>

      <View style={styles.pagination}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === currentIndex ? COLORS.primary : COLORS.gray },
              i === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      <View style={[styles.footer, { paddingBottom: 20 + insets.bottom }]}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === SLIDES.length - 1 ? 'Comenzar' : 'Siguiente'}
          </Text>
        </TouchableOpacity>
        {currentIndex < SLIDES.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Omitir</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  imageContainer: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.primary, textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 14, color: COLORS.grayText, textAlign: 'center', marginBottom: 20 },
  bulletsContainer: { alignSelf: 'stretch', marginBottom: 20 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  bulletText: { fontSize: 13, color: COLORS.black, marginLeft: 8 },
  playStoreContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  playStoreText: { fontSize: 14, fontWeight: '600', color: COLORS.black, marginLeft: 8 },
  pinContainer: { flexDirection: 'row', gap: 10, marginTop: 20 },
  pinBox: { width: 40, height: 50, borderRadius: 8, backgroundColor: COLORS.lightPurple, alignItems: 'center', justifyContent: 'center' },
  pinText: { fontSize: 24, color: COLORS.primary },
  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  dotActive: { width: 24 },
  footer: { paddingHorizontal: 30, paddingTop: 10 },
  button: { backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  skipButton: { alignItems: 'center', paddingVertical: 10 },
  skipText: { color: COLORS.grayText, fontSize: 14 },
});