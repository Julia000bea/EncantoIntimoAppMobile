import { Pressable, StyleSheet } from 'react-native';

import { BrandColors, Fonts, Radius } from '@/constants/brand';
import { Text } from './Text';

type Props = { label: string; selected?: boolean; disabled?: boolean; onPress: () => void };

export function Chip({ label, selected, disabled, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected, disabled: !!disabled }}
      onPress={onPress}
      disabled={disabled}
      style={[styles.chip, selected && styles.selected, disabled && styles.disabled]}
    >
      <Text
        style={{
          fontFamily: Fonts.bodyMedium,
          fontSize: 13,
          color: selected ? BrandColors.white : BrandColors.ink,
          textDecorationLine: disabled ? 'line-through' : 'none',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 38,
    minWidth: 46,
    paddingHorizontal: 16,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: BrandColors.line,
    backgroundColor: BrandColors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: { backgroundColor: BrandColors.roseDeep, borderColor: BrandColors.roseDeep },
  disabled: { opacity: 0.4 },
});
