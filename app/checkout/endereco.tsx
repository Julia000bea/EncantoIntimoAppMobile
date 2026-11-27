import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { AddressForm } from '@/components/molecules/AddressForm';
import { CheckoutSteps } from '@/components/molecules/CheckoutSteps';
import { Header } from '@/components/molecules/Header';
import { Screen } from '@/components/molecules/Screen';
import { BrandColors, Radius } from '@/constants/brand';
import { useApp } from '@/store/AppContext';

/** Tela 14 — Endereço de entrega. */
export default function Endereco() {
  const { addresses, saveAddress, checkout, setCheckout, user } = useApp();
  const [adding, setAdding] = useState(addresses.length === 0);
  const selected = checkout.addressId ?? addresses.find((a) => a.isMain)?.id ?? addresses[0]?.id ?? null;

  const next = () => {
    if (!selected) return;
    setCheckout({ addressId: selected });
    router.push('/checkout/pagamento');
  };

  return (
    <Screen
      header={<Header title="Finalizar compra" />}
      footer={!adding ? <Button title="Continuar" onPress={next} disabled={!selected} /> : undefined}
    >
      <CheckoutSteps current={1} />
      <Text variant="heading" style={{ marginBottom: 14 }}>Endereço de entrega</Text>
      {!adding ? (
        <View style={{ gap: 12 }}>
          {addresses.map((a) => {
            const on = a.id === selected;
            return (
              <Pressable
                key={a.id}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                onPress={() => setCheckout({ addressId: a.id })}
                style={[styles.card, on && styles.cardOn]}
              >
                <Ionicons name={on ? 'radio-button-on' : 'radio-button-off'} size={22} color={BrandColors.roseDeep} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text variant="label">{a.recipient}</Text>
                  <Text variant="caption">{a.street}, {a.number}{a.complement ? ` — ${a.complement}` : ''}</Text>
                  <Text variant="caption">{a.district} · {a.city}/{a.state} · {a.zip}</Text>
                  {a.isMain ? <View style={{ marginTop: 4 }}><Badge label="Principal" /></View> : null}
                </View>
              </Pressable>
            );
          })}
          <Button title="Adicionar novo endereço" variant="outline" onPress={() => setAdding(true)} />
        </View>
      ) : (
        <AddressForm
          defaultRecipient={user?.name}
          submitLabel="Salvar e continuar"
          onSubmit={(v) => {
            const saved = saveAddress(v);
            setCheckout({ addressId: saved.id });
            setAdding(false);
            router.push('/checkout/pagamento');
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: Radius.lg, backgroundColor: BrandColors.panel, borderWidth: 1, borderColor: BrandColors.line },
  cardOn: { borderColor: BrandColors.rose, backgroundColor: BrandColors.blushSoft },
});
