import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { BrandColors, Radius } from '@/constants/brand';
import { useApp } from '@/store/AppContext';

type Item = { icon: string; label: string; onPress: () => void; danger?: boolean };

/** Tela 12 — Minha conta. */
export default function Conta() {
  const { user, logout, orders, favorites } = useApp();

  if (!user) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
          <Text variant="title" accessibilityRole="header">Minha conta</Text>
          <View style={styles.guest}>
            <Ionicons name="person-circle-outline" size={64} color={BrandColors.rose} />
            <Text variant="heading" center>Entre para ver seus pedidos</Text>
            <Text center color={BrandColors.inkSoft}>Acompanhe compras, salve endereços e favoritos.</Text>
            <Button title="Entrar" onPress={() => router.push('/login')} style={{ alignSelf: 'stretch' }} />
            <Button title="Criar conta" variant="outline" onPress={() => router.push('/signup')} style={{ alignSelf: 'stretch' }} />
          </View>
          <Row item={{ icon: 'heart-outline', label: 'Favoritos', onPress: () => router.push('/favoritos') }} />
          <Row item={{ icon: 'document-text-outline', label: 'Termos e políticas', onPress: () => router.push('/termos') }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const confirmLogout = () => {
    if (Platform.OS === 'web') return logout();
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  const items: Item[] = [
    { icon: 'person-outline', label: 'Meus dados', onPress: () => router.push('/perfil') },
    { icon: 'receipt-outline', label: 'Meus pedidos', onPress: () => router.push('/pedidos') },
    { icon: 'heart-outline', label: 'Favoritos', onPress: () => router.push('/favoritos') },
    { icon: 'location-outline', label: 'Meus endereços', onPress: () => router.push('/enderecos') },
    { icon: 'notifications-outline', label: 'Notificações', onPress: () => router.push('/notificacoes') },
    { icon: 'lock-closed-outline', label: 'Alterar senha', onPress: () => router.push('/senha') },
    { icon: 'document-text-outline', label: 'Termos e políticas', onPress: () => router.push('/termos') },
    { icon: 'log-out-outline', label: 'Sair', onPress: confirmLogout, danger: true },
  ];

  const first = user.name.trim().split(' ')[0];
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hello}>
          <View style={styles.avatar}>
            <Text variant="heading" color={BrandColors.roseDeep}>{first.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="title" accessibilityRole="header">Olá, {first}!</Text>
            <Text variant="caption">{orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'} · {favorites.length} {favorites.length === 1 ? 'favorito' : 'favoritos'}</Text>
          </View>
        </View>
        {items.map((it) => (
          <Row key={it.label} item={it} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ item }: { item: Item }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={item.label} onPress={item.onPress} style={styles.row}>
      <Ionicons name={item.icon as never} size={22} color={item.danger ? BrandColors.danger : BrandColors.roseDeep} />
      <Text variant="subtitle" color={item.danger ? BrandColors.danger : undefined} style={{ flex: 1 }}>{item.label}</Text>
      {!item.danger ? <Ionicons name="chevron-forward" size={18} color={BrandColors.inkSoft} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BrandColors.cream },
  hello: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 8 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: BrandColors.blush, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: Radius.lg, backgroundColor: BrandColors.panel, borderWidth: 1, borderColor: BrandColors.line },
  guest: { alignItems: 'center', gap: 12, padding: 24, borderRadius: Radius.lg, backgroundColor: BrandColors.blushSoft },
});
