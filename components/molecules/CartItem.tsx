import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Price } from '@/components/atoms/Price';
import { Text } from '@/components/atoms/Text';
import { BrandColors, Radius } from '@/constants/brand';
import { useApp, type CartDetailed } from '@/store/AppContext';
import { ProductImage } from './ProductImage';
import { QuantitySelector } from './QuantitySelector';

export function CartItem({ line }: { line: CartDetailed }) {
  const { setQuantity, removeFromCart } = useApp();
  const p = line.product;
  return (
    <View style={styles.card}>
      <Pressable onPress={() => router.push({ pathname: '/product/[id]', params: { id: p.id } })}>
        <ProductImage tint={p.tint} source={p.images?.[0]} iconSize={30} style={styles.image} label={p.name} />
      </Pressable>
      <View style={styles.body}>
        <View style={styles.top}>
          <Text variant="label" numberOfLines={2} style={{ flex: 1 }}>{p.name}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={`Remover ${p.name}`} hitSlop={10} onPress={() => removeFromCart(line.key)}>
            <Ionicons name="trash-outline" size={20} color={BrandColors.inkSoft} />
          </Pressable>
        </View>
        <Text variant="caption">Tamanho {line.size} · {line.color}</Text>
        <View style={styles.bottom}>
          <QuantitySelector value={line.quantity} onChange={(q) => setQuantity(line.key, q)} />
          <Price value={p.price * line.quantity} size="sm" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 14, padding: 12, backgroundColor: BrandColors.panel, borderRadius: Radius.lg, borderWidth: 1, borderColor: BrandColors.line },
  image: { width: 86, height: 100, borderRadius: Radius.md },
  body: { flex: 1, gap: 6, justifyContent: 'space-between' },
  top: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
});
