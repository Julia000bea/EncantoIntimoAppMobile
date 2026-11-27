import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { AddressForm } from '@/components/molecules/AddressForm';
import { EmptyState } from '@/components/molecules/EmptyState';
import { Header } from '@/components/molecules/Header';
import { Screen } from '@/components/molecules/Screen';
import { BrandColors, Radius } from '@/constants/brand';
import { useApp } from '@/store/AppContext';
import type { Address } from '@/types';

/** Tela 20 — Endereços: adicionar, editar, remover e definir principal. */
export default function Enderecos() {
  const { addresses, saveAddress, removeAddress, setMainAddress, user, showToast } = useApp();
  const [editing, setEditing] = useState<Address | 'new' | null>(null);

  const confirmRemove = (a: Address) => {
    if (Platform.OS === 'web') return removeAddress(a.id);
    Alert.alert('Remover endereço', 'Deseja remover este endereço?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => removeAddress(a.id) },
    ]);
  };

  if (editing) {
    return (
      <Screen header={<Header title={editing === 'new' ? 'Novo endereço' : 'Editar endereço'} />}>
        <AddressForm
          initial={editing === 'new' ? undefined : editing}
          defaultRecipient={user?.name}
          onSubmit={(v) => {
            saveAddress(editing === 'new' ? v : { ...v, id: editing.id });
            setEditing(null);
            showToast('✓ Endereço salvo');
          }}
        />
        <Button title="Cancelar" variant="ghost" onPress={() => setEditing(null)} />
      </Screen>
    );
  }

  return (
    <Screen
      scroll={addresses.length > 0}
      header={<Header title="Meus endereços" />}
      footer={<Button title="Adicionar endereço" onPress={() => setEditing('new')} />}
    >
      {addresses.length === 0 ? (
        <EmptyState icon="location-outline" message="Você ainda não cadastrou nenhum endereço." />
      ) : (
        <View style={{ gap: 12 }}>
          {addresses.map((a) => (
            <View key={a.id} style={styles.card}>
              <View style={styles.rowBetween}>
                <Text variant="label">{a.recipient}</Text>
                {a.isMain ? <Badge label="Principal" /> : null}
              </View>
              <Text variant="caption">{a.street}, {a.number}{a.complement ? ` — ${a.complement}` : ''}</Text>
              <Text variant="caption">{a.district} · {a.city}/{a.state} · {a.zip}</Text>
              <View style={styles.actions}>
                {!a.isMain ? (
                  <Pressable accessibilityRole="button" onPress={() => setMainAddress(a.id)} style={styles.action}>
                    <Ionicons name="star-outline" size={16} color={BrandColors.roseDeep} />
                    <Text variant="label" color={BrandColors.roseDeep}>Tornar principal</Text>
                  </Pressable>
                ) : null}
                <Pressable accessibilityRole="button" onPress={() => setEditing(a)} style={styles.action}>
                  <Ionicons name="create-outline" size={16} color={BrandColors.roseDeep} />
                  <Text variant="label" color={BrandColors.roseDeep}>Editar</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={() => confirmRemove(a)} style={styles.action}>
                  <Ionicons name="trash-outline" size={16} color={BrandColors.danger} />
                  <Text variant="label" color={BrandColors.danger}>Remover</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: 3, padding: 16, borderRadius: Radius.lg, backgroundColor: BrandColors.panel, borderWidth: 1, borderColor: BrandColors.line },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 10 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 5 },
});
