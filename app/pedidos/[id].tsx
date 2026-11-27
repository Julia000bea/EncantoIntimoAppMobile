import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Platform, StyleSheet, View } from 'react-native';

import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/molecules/EmptyState';
import { Header } from '@/components/molecules/Header';
import { statusTone } from '@/components/molecules/OrderCard';
import { ProductImage } from '@/components/molecules/ProductImage';
import { Screen } from '@/components/molecules/Screen';
import { TotalsBox } from '@/components/molecules/TotalsBox';
import { BrandColors, Radius } from '@/constants/brand';
import { STATUS_FLOW, STATUS_LABEL, useApp } from '@/store/AppContext';
import { PRODUCTS } from '@/data/products';
import { formatBRL, formatDateTime } from '@/utils/format';

const PAYMENT_LABEL = { cartao: 'Cartão', pix: 'Pix', outras: 'Outras formas' } as const;

/** Tela 18 — Detalhes do pedido, com linha do tempo. */
export default function PedidoDetalhe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, advanceOrder, cancelOrder } = useApp();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <Screen scroll={false} header={<Header title="Pedido" />}>
        <EmptyState icon="alert-circle-outline" message="Pedido não encontrado." actionLabel="Meus pedidos" onAction={() => router.replace('/pedidos')} />
      </Screen>
    );
  }

  const cancelled = order.status === 'cancelado';
  const currentIdx = STATUS_FLOW.indexOf(order.status);
  const canCancel = order.status === 'realizado' || order.status === 'pagamento';
  const canAdvance = !cancelled && currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1;

  const confirmCancel = () => {
    if (Platform.OS === 'web') return cancelOrder(order.id);
    Alert.alert('Cancelar pedido', 'Deseja cancelar este pedido?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Cancelar pedido', style: 'destructive', onPress: () => cancelOrder(order.id) },
    ]);
  };

  return (
    <Screen header={<Header title={`Pedido #${order.id}`} />}>
      <View style={styles.rowBetween}>
        <Text variant="caption">Feito em {formatDateTime(order.createdAt)}</Text>
        <Badge label={STATUS_LABEL[order.status]} tone={statusTone(order.status)} />
      </View>

      <Text variant="heading" style={styles.h}>Acompanhamento</Text>
      <View style={styles.card}>
        {cancelled ? (
          <Step done label={STATUS_LABEL.cancelado} date={order.stageDates.cancelado} last danger />
        ) : (
          STATUS_FLOW.map((s, i) => <Step key={s} done={i <= currentIdx} current={i === currentIdx} label={s === 'pagamento' ? 'Pagamento' : s === 'preparacao' ? 'Preparação' : STATUS_LABEL[s]} date={order.stageDates[s]} last={i === STATUS_FLOW.length - 1} />)
        )}
      </View>

      <Text variant="heading" style={styles.h}>Itens</Text>
      <View style={{ gap: 10 }}>
        {order.items.map((it, i) => (
          <View key={i} style={[styles.card, { flexDirection: 'row', gap: 12 }]}>
            <ProductImage tint={it.tint} source={PRODUCTS.find((p) => p.id === it.productId)?.images?.[0]} iconSize={24} style={{ width: 60, height: 70, borderRadius: Radius.md }} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text variant="label" numberOfLines={2}>{it.name}</Text>
              <Text variant="caption">Tamanho {it.size} · {it.color} · {it.quantity}x</Text>
              <Text variant="label" color={BrandColors.roseDeep}>{formatBRL(it.price * it.quantity)}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text variant="heading" style={styles.h}>Entrega</Text>
      <View style={[styles.card, { gap: 2 }]}>
        <Text variant="label">{order.address.recipient}</Text>
        <Text variant="caption">{order.address.street}, {order.address.number}{order.address.complement ? ` — ${order.address.complement}` : ''}</Text>
        <Text variant="caption">{order.address.district} · {order.address.city}/{order.address.state} · {order.address.zip}</Text>
      </View>

      <Text variant="heading" style={styles.h}>Pagamento</Text>
      <View style={[styles.card, { gap: 2, marginBottom: 12 }]}>
        <Text variant="label">{PAYMENT_LABEL[order.payment.method]}</Text>
        {order.payment.detail ? <Text variant="caption">{order.payment.detail}</Text> : null}
      </View>
      <TotalsBox totals={order} />

      <View style={{ gap: 10, marginTop: 20 }}>
        {canAdvance ? (
          <Button title="Avançar etapa (demonstração)" variant="secondary" onPress={() => advanceOrder(order.id)} />
        ) : null}
        {canCancel ? <Button title="Cancelar pedido" variant="outline" onPress={confirmCancel} /> : null}
      </View>
      {canAdvance ? (
        <Text variant="caption" center style={{ marginTop: 8 }}>
          O botão de demonstração simula o andamento do pedido; na loja real o status vem do sistema de pedidos.
        </Text>
      ) : null}
    </Screen>
  );
}

function Step({ done, current, label, date, last, danger }: { done: boolean; current?: boolean; label: string; date?: string; last?: boolean; danger?: boolean }) {
  const color = danger ? BrandColors.danger : done ? BrandColors.roseDeep : BrandColors.line;
  return (
    <View style={styles.step}>
      <View style={{ alignItems: 'center' }}>
        <View style={[styles.dot, { backgroundColor: done ? color : BrandColors.panel, borderColor: color }]}>
          {done ? <Ionicons name={danger ? 'close' : 'checkmark'} size={14} color={BrandColors.white} /> : null}
        </View>
        {!last ? <View style={[styles.line, { backgroundColor: done ? color : BrandColors.line }]} /> : null}
      </View>
      <View style={{ flex: 1, paddingBottom: last ? 0 : 18 }}>
        <Text variant="label" color={done ? undefined : BrandColors.inkSoft}>{label}</Text>
        <Text variant="caption">{date ? formatDateTime(date) : current ? 'Em andamento' : 'Aguardando'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  h: { marginTop: 22, marginBottom: 10 },
  card: { padding: 16, borderRadius: Radius.lg, backgroundColor: BrandColors.panel, borderWidth: 1, borderColor: BrandColors.line },
  step: { flexDirection: 'row', gap: 14 },
  dot: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  line: { width: 2, flex: 1, minHeight: 20, marginTop: 2 },
});
