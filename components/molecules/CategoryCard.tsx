import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { BrandColors, Radius, Shadow } from '@/constants/brand';
import type { Category } from '@/types';

type Props = { category: Category; variant?: 'chip' | 'card' };

export function CategoryCard({ category, variant = 'chip' }: Props) {
  const go = () => router.push({ pathname: '/category/[id]', params: { id: category.id } });
  if (variant === 'card') {
    return (
      <Pressable accessibilityRole="button" accessibilityLabel={category.name} onPress={go} style={styles.card}>
        <View style={styles.cardIcon}>
          <Ionicons name={category.icon as never} size={30} color={BrandColors.roseDeep} />
        </View>
        <Text variant="subtitle">{category.name}</Text>
        <Ionicons name="chevron-forward" size={18} color={BrandColors.inkSoft} style={{ marginLeft: 'auto' }} />
      </Pressable>
    );
  }
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={category.name} onPress={go} style={styles.chipWrap}>
      <View style={styles.chip}>
        <Ionicons name={category.icon as never} size={26} color={BrandColors.roseDeep} />
      </View>
      <Text variant="caption" center numberOfLines={1} style={{ color: BrandColors.ink }}>{category.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chipWrap: { width: 76, alignItems: 'center', gap: 8 },
  chip: { width: 64, height: 64, borderRadius: 32, backgroundColor: BrandColors.blush, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, backgroundColor: BrandColors.panel, borderRadius: Radius.lg, borderWidth: 1, borderColor: BrandColors.line, ...Shadow.card },
  cardIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: BrandColors.blush, alignItems: 'center', justifyContent: 'center' },
});
