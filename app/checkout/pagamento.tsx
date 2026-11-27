import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Text } from '@/components/atoms/Text';
import { CheckoutSteps } from '@/components/molecules/CheckoutSteps';
import { Header } from '@/components/molecules/Header';
import { Screen } from '@/components/molecules/Screen';
import { TotalsBox } from '@/components/molecules/TotalsBox';
import { BrandColors, Radius } from '@/constants/brand';
import { useApp } from '@/store/AppContext';
import type { PaymentMethod } from '@/types';
import { maskCardNumber, maskExpiry, onlyDigits } from '@/utils/format';

const METHODS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: 'cartao', label: 'Cartão', icon: 'card-outline' },
  { id: 'pix', label: 'Pix', icon: 'qr-code-outline' },
  { id: 'outras', label: 'Outras formas', icon: 'wallet-outline' },
];

/** Tela 15 — Pagamento. O pagamento é SIMULADO: nenhum dado de cartão é guardado ou enviado. */
export default function Pagamento() {
  const { totals, placeOrder, cart } = useApp();
  const [method, setMethod] = useState<PaymentMethod>('cartao');
  const [number, setNumber] = useState('');
  const [holder, setHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const e: Record<string, string> = {};
    if (method === 'cartao') {
      if (onlyDigits(number).length < 13) e.number = 'Número do cartão inválido.';
      if (holder.trim().length < 3) e.holder = 'Informe o nome impresso no cartão.';
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) e.expiry = 'Use MM/AA.';
      if (onlyDigits(cvv).length < 3) e.cvv = 'CVV inválido.';
    }
    setErrors(e);
    if (Object.keys(e).length) return;
    const detail = method === 'cartao' ? `Cartão final ${onlyDigits(number).slice(-4)}` : undefined;
    const order = placeOrder({ method, detail });
    if (order) router.replace({ pathname: '/checkout/confirmado', params: { id: order.id } });
  };

  if (cart.length === 0) {
    return (
      <Screen scroll={false} header={<Header title="Pagamento" />}>
        <Text center style={{ padding: 32 }}>Seu carrinho está vazio.</Text>
      </Screen>
    );
  }

  return (
    <Screen header={<Header title="Finalizar compra" />} footer={<Button title="Finalizar pedido" onPress={submit} />}>
      <CheckoutSteps current={2} />
      <Text variant="heading" style={{ marginBottom: 14 }}>Forma de pagamento</Text>
      <View style={{ gap: 10, marginBottom: 18 }}>
        {METHODS.map((m) => {
          const on = method === m.id;
          return (
            <Pressable key={m.id} accessibilityRole="radio" accessibilityState={{ selected: on }} onPress={() => setMethod(m.id)} style={[styles.method, on && styles.methodOn]}>
              <Ionicons name={m.icon as never} size={22} color={BrandColors.roseDeep} />
              <Text variant="subtitle" style={{ flex: 1 }}>{m.label}</Text>
              <Ionicons name={on ? 'radio-button-on' : 'radio-button-off'} size={22} color={BrandColors.roseDeep} />
            </Pressable>
          );
        })}
      </View>

      {method === 'cartao' ? (
        <View>
          <Input label="Número do cartão" value={number} onChangeText={(t) => setNumber(maskCardNumber(t))} error={errors.number} keyboardType="number-pad" placeholder="0000 0000 0000 0000" />
          <Input label="Nome impresso no cartão" value={holder} onChangeText={setHolder} error={errors.holder} autoCapitalize="characters" />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Input label="Validade" value={expiry} onChangeText={(t) => setExpiry(maskExpiry(t))} error={errors.expiry} keyboardType="number-pad" placeholder="MM/AA" />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="CVV" value={cvv} onChangeText={(t) => setCvv(onlyDigits(t).slice(0, 4))} error={errors.cvv} keyboardType="number-pad" secureTextEntry />
            </View>
          </View>
        </View>
      ) : method === 'pix' ? (
        <View style={styles.note}>
          <Text variant="label">Pix</Text>
          <Text variant="caption">O código de pagamento é exibido depois de finalizar o pedido (demonstração).</Text>
        </View>
      ) : (
        <View style={styles.note}>
          <Text variant="label">Outras formas</Text>
          <Text variant="caption">Boleto bancário e pagamento na entrega serão combinados com a loja (demonstração).</Text>
        </View>
      )}

      <View style={{ marginTop: 18 }}>
        <TotalsBox totals={totals} />
      </View>
      <Text variant="caption" center style={{ marginTop: 14 }}>
        Pagamento de demonstração: nenhuma cobrança é realizada e os dados do cartão não são guardados.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  method: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: Radius.lg, backgroundColor: BrandColors.panel, borderWidth: 1, borderColor: BrandColors.line },
  methodOn: { borderColor: BrandColors.rose, backgroundColor: BrandColors.blushSoft },
  note: { gap: 4, padding: 16, borderRadius: Radius.lg, backgroundColor: BrandColors.blushSoft },
});
