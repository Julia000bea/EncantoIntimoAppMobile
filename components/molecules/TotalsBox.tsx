import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { BrandColors, Radius } from '@/constants/brand';
import type { Totals } from '@/store/AppContext';
import { formatBRL } from '@/utils/format';

function Row({ label, value, color, strong }: { label: string; value: string; color?: string; strong?: boolean }) {
  return (
    <View style={styles.row}>
      <Text variant={strong ? 'subtitle' : 'body'}>{label}</Text>
      <Text variant={strong ? 'heading' : 'body'} color={color ?? (strong ? BrandColors.roseDeep : undefined)}>{value}</Text>
    </View>
  );
}

/** Resumo de valores: subtotal, desconto, frete e total. */
export function TotalsBox({ totals }: { totals: Pick<Totals, 'subtotal' | 'discount' | 'shipping' | 'total'> }) {
  return (
    <View style={styles.box}>
      <Row label="Subtotal" value={formatBRL(totals.subtotal)} />
      {totals.discount > 0 ? <Row label="Desconto" value={`- ${formatBRL(totals.discount)}`} color={BrandColors.success} /> : null}
      <Row label="Frete" value={totals.shipping === 0 ? 'Grátis' : formatBRL(totals.shipping)} />
      <View style={styles.sep} />
      <Row label="Total" value={formatBRL(totals.total)} strong />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: 10, padding: 18, backgroundColor: BrandColors.panel, borderRadius: Radius.lg, borderWidth: 1, borderColor: BrandColors.line },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sep: { height: 1, backgroundColor: BrandColors.line },
});
