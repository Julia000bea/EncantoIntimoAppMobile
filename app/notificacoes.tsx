import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/molecules/EmptyState';
import { Header } from '@/components/molecules/Header';
import { Screen } from '@/components/molecules/Screen';
import { BrandColors, Radius } from '@/constants/brand';
import { useApp } from '@/store/AppContext';
import { formatDateTime } from '@/utils/format';

/** Tela 21 — Notificações. */
export default function Notificacoes() {
  const { notifications, markAllRead, unreadCount } = useApp();
  useEffect(() => {
    // marca como lidas ao sair da tela, para o usuário ainda ver quais eram novas
    return () => {
      if (unreadCount > 0) markAllRead();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen scroll={notifications.length > 0} header={<Header title="Notificações" />}>
      {notifications.length === 0 ? (
        <EmptyState icon="notifications-outline" message="Você não tem notificações." />
      ) : (
        <View style={{ gap: 10 }}>
          {notifications.map((n) => (
            <View key={n.id} style={[styles.card, !n.read && styles.unread]}>
              <Ionicons name="notifications" size={20} color={BrandColors.roseDeep} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="label">{n.title}</Text>
                <Text variant="body" color={BrandColors.inkSoft}>{n.message}</Text>
                <Text variant="caption">{formatDateTime(n.createdAt)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: Radius.lg, backgroundColor: BrandColors.panel, borderWidth: 1, borderColor: BrandColors.line },
  unread: { backgroundColor: BrandColors.blushSoft, borderColor: BrandColors.rose },
});
