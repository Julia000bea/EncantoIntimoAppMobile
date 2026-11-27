import { router } from 'expo-router';
import { View } from 'react-native';

import { EmptyState } from '@/components/molecules/EmptyState';
import { Header } from '@/components/molecules/Header';
import { OrderCard } from '@/components/molecules/OrderCard';
import { Screen } from '@/components/molecules/Screen';
import { useApp } from '@/store/AppContext';

/** Tela 17 — Meus pedidos. */
export default function Pedidos() {
  const { orders } = useApp();
  return (
    <Screen scroll={orders.length > 0} header={<Header title="Meus pedidos" />}>
      {orders.length === 0 ? (
        <EmptyState icon="receipt-outline" message="Você ainda não fez nenhum pedido." actionLabel="Ver produtos" onAction={() => router.replace('/(tabs)')} />
      ) : (
        <View style={{ gap: 12 }}>
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </View>
      )}
    </Screen>
  );
}
