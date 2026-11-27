import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { BrandColors, Fonts, Radius } from '@/constants/brand';

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
};

export function SearchBar({ value, onChangeText, onSubmit, placeholder = 'Buscar produtos', autoFocus }: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="search" size={20} color={BrandColors.inkSoft} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={BrandColors.inkSoft}
        returnKeyType="search"
        autoFocus={autoFocus}
        accessibilityLabel="Buscar produtos"
        style={styles.input}
      />
      {value.length > 0 ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Limpar busca" hitSlop={10} onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={20} color={BrandColors.inkSoft} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48, paddingHorizontal: 16, borderRadius: Radius.pill, backgroundColor: BrandColors.panel, borderWidth: 1, borderColor: BrandColors.line },
  input: { flex: 1, fontFamily: Fonts.body, fontSize: 15, color: BrandColors.ink, paddingVertical: 8, outlineStyle: 'none' as never },
});
