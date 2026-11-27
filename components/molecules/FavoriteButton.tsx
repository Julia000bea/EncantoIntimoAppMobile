import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { BrandColors, Shadow } from '@/constants/brand';
import { useApp } from '@/store/AppContext';

export function FavoriteButton({ productId, size = 36 }: { productId: string; size?: number }) {
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite(productId);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      hitSlop={8}
      onPress={() => toggleFavorite(productId)}
      style={[styles.btn, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <Ionicons name={fav ? 'heart' : 'heart-outline'} size={size * 0.55} color={fav ? BrandColors.roseDeep : BrandColors.inkSoft} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: BrandColors.white, alignItems: 'center', justifyContent: 'center', ...Shadow.card },
});
