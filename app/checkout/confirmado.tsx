import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { BrandColors, Radius } from '@/constants/brand';
import { useApp } from '@/store/AppContext';

/** Tela 16 — Pedido confirmado. */
export default function Confirmado() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useApp();
  const order = orders.find((o) => o.id === id);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.center}>
        <View style={styles.check}>
          <Ionicons name="checkmark" size={56} color={BrandColors.white} />
        </View>
        <Text variant="title" center accessibilityRole="header">Pedido realizado com sucesso!</Text>
        <Text center color={BrandColors.inkSoft}>Obrigada por comprar na Encanto Íntimo.</Text>
        <View style={styles.number}>
          <Text variant="caption">Número do pedido</Text>
          <Text variant="heading" color={BrandColors.roseDeep}>Pedido #{id}</Text>
        </View>
        {order?.payment.method === 'pix' ? (
          <View style={styles.pix}>
            <Text variant="label">Pix (demonstração)</Text>
            <Text variant="caption">Nenhuma cobrança real é feita neste protótipo.</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.actions}>
        <Button title="Acompanhar pedido" onPress={() => router.replace({ pathname: '/pedidos/[id]', params: { id: String(id) } })} />
        <Button title="Continuar comprando" variant="outline" onPress={() => router.replace('/(tabs)')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BrandColors.cream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  check: { width: 104, height: 104, borderRadius: 52, backgroundColor: BrandColors.success, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  number: { marginTop: 12, alignItems: 'center', gap: 2, paddingVertical: 14, paddingHorizontal: 28, borderRadius: Radius.lg, backgroundColor: BrandColors.blush },
  pix: { gap: 2, alignItems: 'center', padding: 12 },
  actions: { padding: 24, gap: 12 },
});
