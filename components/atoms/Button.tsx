import { ActivityIndicator, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { BrandColors, Fonts, Radius } from '@/constants/brand';
import { Text } from './Text';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'md' | 'sm';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ title, onPress, variant = 'primary', size = 'md', disabled, loading, style }: Props) {
  const isDisabled = disabled || loading;
  const textColor = variant === 'primary' ? BrandColors.white : variant === 'secondary' ? BrandColors.roseDeep : variant === 'outline' ? BrandColors.roseDeep : BrandColors.inkSoft;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!isDisabled }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' && styles.sm,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        isDisabled && styles.disabled,
        pressed && !isDisabled && { opacity: 0.85 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={{ color: textColor, fontFamily: Fonts.bodySemi, fontSize: size === 'sm' ? 13 : 15 }}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 50, paddingHorizontal: 22, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  sm: { minHeight: 38, paddingHorizontal: 16 },
  primary: { backgroundColor: BrandColors.roseDeep },
  secondary: { backgroundColor: BrandColors.blush },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: BrandColors.rose },
  disabled: { opacity: 0.5 },
});
