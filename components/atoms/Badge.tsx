import { StyleSheet, View } from 'react-native';

import { BrandColors, Fonts, Radius } from '@/constants/brand';
import { Text } from './Text';

type Tone = 'rose' | 'ink' | 'success' | 'neutral' | 'danger';

const TONES: Record<Tone, { bg: string; fg: string }> = {
  rose: { bg: BrandColors.roseDeep, fg: BrandColors.white },
  ink: { bg: BrandColors.ink, fg: BrandColors.white },
  success: { bg: '#E3EEE1', fg: '#3F6B3B' },
  neutral: { bg: BrandColors.blush, fg: BrandColors.roseDeep },
  danger: { bg: '#F6DCD8', fg: BrandColors.danger },
};

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const t = TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text style={{ color: t.fg, fontFamily: Fonts.bodySemi, fontSize: 11 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: Radius.pill, alignSelf: 'flex-start' },
});
