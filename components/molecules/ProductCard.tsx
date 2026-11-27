import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge } from '@/components/atoms/Badge';
import { Price } from '@/components/atoms/Price';
import { Text } from '@/components/atoms/Text';
import { BrandColors, Radius, Shadow } from '@/constants/brand';
import type { Product } from '@/types';
import { discountPercent } from '@/utils/format';
import { FavoriteButton } from './FavoriteButton';
import { ProductImage } from './ProductImage';

export function ProductCard({ product, width }: { product: Product; width?: number }) {
  const off = discountPercent(product.price, product.oldPrice);
  const soldOut = product.stock <= 0;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${product.price.toFixed(2)} reais`}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
      style={[styles.card, width ? { width } : { flex: 1 }]}
    >
      <View>
        <ProductImage tint={product.tint} imageUrl={product.imageUrl} style={styles.image} label={product.name} />
        {off ? (
          <View style={styles.topLeft}>
            <Badge label={`-${off}%`} tone="rose" />
          </View>
        ) : null}
        {soldOut ? (
          <View style={styles.topLeft}>
            <Badge label="Esgotado" tone="ink" />
          </View>
        ) : null}
        <View style={styles.topRight}>
          <FavoriteButton productId={product.id} size={34} />
        </View>
      </View>
      <View style={styles.info}>
        <Text variant="label" numberOfLines={2} style={styles.name}>{product.name}</Text>
        <Price value={product.price} oldValue={product.oldPrice} size="sm" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: BrandColors.panel, borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: BrandColors.line, ...Shadow.card },
  image: { width: '100%', aspectRatio: 1 / 1.15 },
  topLeft: { position: 'absolute', top: 10, left: 10 },
  topRight: { position: 'absolute', top: 8, right: 8 },
  info: { padding: 12, gap: 6 },
  name: { minHeight: 36 },
});
