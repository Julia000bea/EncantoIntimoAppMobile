import { StyleSheet, View } from 'react-native';

import { BrandColors, Fonts } from '@/constants/brand';
import { formatBRL } from '@/utils/format';
import { Text } from './Text';

type Props = { value: number; oldValue?: number; size?: 'sm' | 'md' | 'lg' };

export function Price({ value, oldValue, size = 'md' }: Props) {
  const fs = size === 'lg' ? 26 : size === 'md' ? 16 : 14;
  return (
    <View style={styles.row}>
      <Text style={{ fontFamily: Fonts.bodySemi, fontSize: fs, color: BrandColors.roseDeep }}>{formatBRL(value)}</Text>
      {oldValue && oldValue > value ? (
        <Text style={[styles.old, { fontSize: Math.max(12, fs - 4) }]}>{formatBRL(oldValue)}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' },
  old: { fontFamily: Fonts.body, color: BrandColors.inkSoft, textDecorationLine: 'line-through' },
});
