import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { Text } from '@/components/atoms/Text';
import { BrandColors } from '@/constants/brand';
import { useApp } from '@/store/AppContext';

/** Tela 1 — Splash: logo com animação e redirecionamento. */
export default function Splash() {
  const { ready, firstRun } = useApp();
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 1800);
    return () => clearTimeout(t);
  }, []);

  if (ready && minTimePassed) return <Redirect href={firstRun ? '/welcome' : '/(tabs)'} />;

  return (
    <View style={styles.root}>
      <Animated.View entering={FadeIn.duration(900)}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" accessibilityLabel="Encanto Íntimo" />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(700).duration(700)}>
        <Text variant="caption" center style={styles.tag}>Sua beleza, seu conforto, seu estilo.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BrandColors.cream, alignItems: 'center', justifyContent: 'center', gap: 20 },
  logo: { width: 240, height: 203 },
  tag: { fontSize: 14, color: BrandColors.roseDeep, letterSpacing: 0.5 },
});
