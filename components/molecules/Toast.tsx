import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/atoms/Text';
import { BrandColors, Fonts, Radius } from '@/constants/brand';
import { useApp } from '@/store/AppContext';

export function Toast() {
  const { toast } = useApp();
  const insets = useSafeAreaInsets();
  if (!toast) return null;
  return (
    <View pointerEvents="none" style={[styles.wrap, { bottom: insets.bottom + 90 }]} accessibilityLiveRegion="polite">
      <View style={styles.toast}>
        <Text style={{ color: BrandColors.white, fontFamily: Fonts.bodyMedium, fontSize: 14 }}>{toast}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  toast: { backgroundColor: BrandColors.ink, paddingHorizontal: 20, paddingVertical: 12, borderRadius: Radius.pill },
});
