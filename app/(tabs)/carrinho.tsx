import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { CartItem } from '@/components/molecules/CartItem';
import { EmptyState } from '@/components/molecules/EmptyState';
import { TotalsBox } from '@/components/molecules/TotalsBox';
import { BrandColors } from '@/constants/brand';
import { FREE_SHIPPING_FROM, useApp } from '@/store/AppContext';
import { formatBRL } from '@/utils/format';

/** Tela 10 — Carrinho. */
export default function Carrinho() {
  const { cart, totals } = useApp();

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <Text variant="title" style={styles.title} accessibilityRole="header">Carrinho</Text>
        <EmptyState icon="bag-outline" message="Seu carrinho está vazio." actionLabel="Ver produtos" onAction={() => router.push('/(tabs)')} />
      </SafeAreaView>
    );
  }

  const missing = FREE_SHIPPING_FROM - (totals.subtotal - totals.discount);
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <Text variant="title" accessibilityRole="header">Carrinho</Text>
        {cart.map((l) => (
          <CartItem key={l.key} line={l} />
        ))}
        {missing > 0 ? (
          <Text variant="caption" center>Faltam {formatBRL(missing)} para frete grátis.</Text>
        ) : (
          <Text variant="caption" center color={BrandColors.success}>Você ganhou frete grátis!</Text>
        )}
        <TotalsBox totals={totals} />
        <Button title="Continuar para pagamento" onPress={() => router.push('/checkout/identificacao')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BrandColors.cream },
  title: { paddingHorizontal: 20, paddingTop: 12 },
});
