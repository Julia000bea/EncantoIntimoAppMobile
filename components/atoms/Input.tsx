import { forwardRef, useState, type ComponentRef } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { BrandColors, Fonts, Radius } from '@/constants/brand';
import { Text } from './Text';

type Props = TextInputProps & { label?: string; error?: string | null };

export const Input = forwardRef<ComponentRef<typeof TextInput>, Props>(function Input({ label, error, style, onFocus, onBlur, ...rest }, ref) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      {label ? <Text variant="label" style={styles.label}>{label}</Text> : null}
      <TextInput
        ref={ref}
        placeholderTextColor={BrandColors.inkSoft}
        accessibilityLabel={label}
        {...rest}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[styles.input, focused && styles.focused, !!error && styles.errorBorder, style]}
      />
      {error ? <Text variant="caption" color={BrandColors.danger} style={styles.error}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { marginBottom: 6, color: BrandColors.ink },
  input: {
    minHeight: 50,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: BrandColors.line,
    backgroundColor: BrandColors.panel,
    paddingHorizontal: 16,
    fontFamily: Fonts.body,
    fontSize: 15,
    color: BrandColors.ink,
  },
  focused: { borderColor: BrandColors.rose },
  errorBorder: { borderColor: BrandColors.danger },
  error: { marginTop: 4 },
});
