import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { BrandColors } from '@/constants/brand';

const STEPS = ['Identificação', 'Endereço', 'Pagamento'];

export function CheckoutSteps({ current }: { current: 0 | 1 | 2 }) {
  return (
    <View style={styles.row} accessibilityLabel={`Etapa ${current + 1} de 3: ${STEPS[current]}`}>
      {STEPS.map((s, i) => (
        <View key={s} style={styles.step}>
          <View style={[styles.bar, i <= current && styles.barOn]} />
          <Text variant="caption" style={i === current ? { color: BrandColors.roseDeep, fontWeight: '600' } : undefined}>{s}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  step: { flex: 1, gap: 6 },
  bar: { height: 4, borderRadius: 2, backgroundColor: BrandColors.line },
  barOn: { backgroundColor: BrandColors.rose },
});
