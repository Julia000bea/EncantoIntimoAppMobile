import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { BrandColors, Radius } from '@/constants/brand';

function Pulse({ style }: { style: object }) {
  const o = useSharedValue(0.55);
  useEffect(() => {
    o.value = withRepeat(withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [o]);
  const anim = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[{ backgroundColor: BrandColors.blush }, style, anim]} />;
}

/** Esqueleto de carregamento (skeleton) em grade de 2 colunas. */
export function LoadingState({ items = 4 }: { items?: number }) {
  return (
    <View style={styles.grid} accessibilityLabel="Carregando produtos" accessibilityRole="progressbar">
      {Array.from({ length: items }).map((_, i) => (
        <View key={i} style={styles.cell}>
          <Pulse style={{ width: '100%', aspectRatio: 1 / 1.15, borderRadius: Radius.lg }} />
          <Pulse style={{ height: 14, width: '80%', borderRadius: 7, marginTop: 10 }} />
          <Pulse style={{ height: 14, width: '40%', borderRadius: 7, marginTop: 8 }} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, paddingHorizontal: 20 },
  cell: { width: '47%', flexGrow: 1 },
});
