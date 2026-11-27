import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { BrandColors, Fonts, Radius } from '@/constants/brand';

type Props = { value: number; onChange: (v: number) => void; min?: number; max?: number };

export function QuantitySelector({ value, onChange, min = 1, max = 10 }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Diminuir quantidade"
        disabled={value <= min}
        onPress={() => onChange(value - 1)}
        style={[styles.btn, value <= min && { opacity: 0.4 }]}
      >
        <Ionicons name="remove" size={18} color={BrandColors.roseDeep} />
      </Pressable>
      <Text accessibilityLabel={`Quantidade ${value}`} style={styles.value}>{value}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Aumentar quantidade"
        disabled={value >= max}
        onPress={() => onChange(value + 1)}
        style={[styles.btn, value >= max && { opacity: 0.4 }]}
      >
        <Ionicons name="add" size={18} color={BrandColors.roseDeep} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: BrandColors.blushSoft, borderRadius: Radius.pill, padding: 4, alignSelf: 'flex-start' },
  btn: { width: 36, height: 36, borderRadius: 18, backgroundColor: BrandColors.white, alignItems: 'center', justifyContent: 'center' },
  value: { minWidth: 36, textAlign: 'center', fontFamily: Fonts.bodySemi, fontSize: 15 },
});
