import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { Chip } from '@/components/atoms/Chip';
import { Text } from '@/components/atoms/Text';
import { BrandColors, Radius } from '@/constants/brand';
import { CATEGORIES, COLORS } from '@/data/products';
import { EMPTY_FILTERS, PRICE_LABEL, SORT_LABEL, type Filters, type PriceRange, type SortKey } from '@/utils/filter';

type Props = {
  visible: boolean;
  value: Filters;
  onChange: (f: Filters) => void;
  onClose: () => void;
  hideCategory?: boolean;
};

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text variant="subtitle" style={{ marginBottom: 10 }}>{title}</Text>
      <View style={styles.wrap}>{children}</View>
    </View>
  );
}

/** Filtros (categoria, tamanho, cor, faixa de preço, disponibilidade) e ordenação. */
export function FilterSheet({ visible, value, onChange, onClose, hideCategory }: Props) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => onChange({ ...value, [k]: v });
  const toggle = <K extends keyof Filters>(k: K, v: Filters[K]) => set(k, value[k] === v ? (null as Filters[K]) : v);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Fechar filtros" />
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <View style={styles.head}>
            <Text variant="heading">Filtros</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Fechar" onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={26} color={BrandColors.ink} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 8 }}>
            <Group title="Ordenar por">
              {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
                <Chip key={k} label={SORT_LABEL[k]} selected={value.sort === k} onPress={() => set('sort', k)} />
              ))}
            </Group>
            {!hideCategory ? (
              <Group title="Categoria">
                {CATEGORIES.map((c) => (
                  <Chip key={c.id} label={c.name} selected={value.category === c.id} onPress={() => toggle('category', c.id)} />
                ))}
              </Group>
            ) : null}
            <Group title="Tamanho">
              {['P', 'M', 'G', 'GG'].map((s) => (
                <Chip key={s} label={s} selected={value.size === s} onPress={() => toggle('size', s)} />
              ))}
            </Group>
            <Group title="Cor">
              {Object.values(COLORS).map((c) => (
                <Chip key={c.name} label={c.name} selected={value.color === c.name} onPress={() => toggle('color', c.name)} />
              ))}
            </Group>
            <Group title="Faixa de preço">
              {(Object.keys(PRICE_LABEL) as PriceRange[]).map((k) => (
                <Chip key={k} label={PRICE_LABEL[k]} selected={value.price === k} onPress={() => toggle('price', k)} />
              ))}
            </Group>
            <View style={styles.switchRow}>
              <Text variant="subtitle">Somente disponíveis</Text>
              <Switch
                value={value.onlyAvailable}
                onValueChange={(v) => set('onlyAvailable', v)}
                trackColor={{ true: BrandColors.rose, false: BrandColors.line }}
                thumbColor={BrandColors.white}
              />
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <Button title="Limpar" variant="outline" style={{ flex: 1 }} onPress={() => onChange({ ...EMPTY_FILTERS, query: value.query, category: hideCategory ? value.category : null })} />
            <Button title="Aplicar" style={{ flex: 1 }} onPress={onClose} />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(43,36,32,0.45)' },
  sheet: { maxHeight: '85%', backgroundColor: BrandColors.cream, borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: Radius.md, backgroundColor: BrandColors.panel, borderWidth: 1, borderColor: BrandColors.line },
  footer: { flexDirection: 'row', gap: 12, padding: 20, paddingTop: 12 },
});
