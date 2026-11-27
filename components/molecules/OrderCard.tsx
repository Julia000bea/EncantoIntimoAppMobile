import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge } from '@/components/atoms/Badge';
import { Text } from '@/components/atoms/Text';
import { BrandColors, Radius, Shadow } from '@/constants/brand';
import { STATUS_LABEL } from '@/store/AppContext';
import type { Order, OrderStatus } from '@/types';
import { formatBRL, formatDate } from '@/utils/format';

export const statusTone = (s: OrderStatus) => (s === 'entregue' ? 'success' : s === 'cancelado' ? 'danger' : 'neutral');

export function OrderCard({ order }: { order: Order }) {
  const units = order.items.reduce((n, i) => n + i.quantity, 0);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Pedido ${order.id}`}
      onPress={() => router.push({ pathname: '/pedidos/[id]', params: { id: order.id } })}
      style={styles.card}
    >
      <View style={styles.row}>
        <Text variant="subtitle">Pedido #{order.id}</Text>
        <Badge label={STATUS_LABEL[order.status]} tone={statusTone(order.status)} />
      </View>
      <Text variant="caption">{formatDate(order.createdAt)} · {units} {units === 1 ? 'item' : 'itens'}</Text>
      <View style={styles.row}>
        <Text style={{ color: BrandColors.roseDeep }} variant="subtitle">{formatBRL(order.total)}</Text>
        <Ionicons name="chevron-forward" size={18} color={BrandColors.inkSoft} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: 8, padding: 16, backgroundColor: BrandColors.panel, borderRadius: Radius.lg, borderWidth: 1, borderColor: BrandColors.line, ...Shadow.card },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
});
