import { Text as RNText, type TextProps, StyleSheet } from 'react-native';

import { BrandColors, Fonts } from '@/constants/brand';

type Variant = 'title' | 'heading' | 'subtitle' | 'body' | 'label' | 'caption';

type Props = TextProps & { variant?: Variant; color?: string; center?: boolean };

export function Text({ variant = 'body', color, center, style, ...rest }: Props) {
  return <RNText {...rest} style={[styles[variant], color ? { color } : null, center ? { textAlign: 'center' } : null, style]} />;
}

const styles = StyleSheet.create({
  title: { fontFamily: Fonts.title, fontSize: 30, lineHeight: 36, color: BrandColors.ink },
  heading: { fontFamily: Fonts.title, fontSize: 22, lineHeight: 28, color: BrandColors.ink },
  subtitle: { fontFamily: Fonts.bodyMedium, fontSize: 16, lineHeight: 22, color: BrandColors.ink },
  body: { fontFamily: Fonts.body, fontSize: 14, lineHeight: 20, color: BrandColors.ink },
  label: { fontFamily: Fonts.bodySemi, fontSize: 13, lineHeight: 18, color: BrandColors.ink },
  caption: { fontFamily: Fonts.body, fontSize: 12, lineHeight: 16, color: BrandColors.inkSoft },
});
