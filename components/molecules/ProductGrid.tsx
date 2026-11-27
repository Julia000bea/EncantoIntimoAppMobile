import { StyleSheet, View } from 'react-native';

import type { Product } from '@/types';
import { ProductCard } from './ProductCard';

/** Grade de 2 colunas de produtos. */
export function ProductGrid({ products }: { products: Product[] }) {
  const rows: Product[][] = [];
  for (let i = 0; i < products.length; i += 2) rows.push(products.slice(i, i + 2));
  return (
    <View style={styles.grid}>
      {rows.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {row.length === 1 ? <View style={{ flex: 1 }} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 14 },
  row: { flexDirection: 'row', gap: 14 },
});
