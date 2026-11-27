import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/atoms/Text';
import { Chip } from '@/components/atoms/Chip';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ErrorState } from '@/components/molecules/ErrorState';
import { FilterSheet } from '@/components/molecules/FilterSheet';
import { LoadingState } from '@/components/molecules/LoadingState';
import { ProductGrid } from '@/components/molecules/ProductGrid';
import { SearchBar } from '@/components/molecules/SearchBar';
import { BrandColors } from '@/constants/brand';
import { useProducts } from '@/hooks/useProducts';
import { useApp } from '@/store/AppContext';
import { EMPTY_FILTERS, activeFilterCount, applyFilters, type Filters } from '@/utils/filter';

/** Tela 7 — Busca, com histórico, filtros e ordenação. */
export default function Buscar() {
  const { products, loading, error, reload } = useProducts();
  const { history, addHistory, clearHistory } = useApp();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sheet, setSheet] = useState(false);

  const filterCount = activeFilterCount(filters);
  const searching = filters.query.trim().length > 0 || filterCount > 0;
  const results = useMemo(() => applyFilters(products, filters), [products, filters]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.top}>
        <View style={{ flex: 1 }}>
          <SearchBar value={filters.query} onChangeText={(t) => setFilters((f) => ({ ...f, query: t }))} onSubmit={() => addHistory(filters.query)} />
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Filtros" onPress={() => setSheet(true)} style={styles.filterBtn}>
          <Ionicons name="options-outline" size={22} color={BrandColors.ink} />
          {filterCount > 0 ? (
            <View style={styles.count}>
              <Text style={{ color: BrandColors.white, fontSize: 10 }}>{filterCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {!searching ? (
          <View>
            <View style={styles.histHead}>
              <Text variant="heading">Buscas recentes</Text>
              {history.length > 0 ? (
                <Pressable onPress={clearHistory} accessibilityRole="button">
                  <Text color={BrandColors.roseDeep} variant="label">Limpar</Text>
                </Pressable>
              ) : null}
            </View>
            {history.length === 0 ? (
              <Text color={BrandColors.inkSoft}>Suas buscas aparecem aqui. Experimente “renda”, “pijama” ou “nude”.</Text>
            ) : (
              <View style={styles.wrap}>
                {history.map((h) => (
                  <Chip key={h} label={h} onPress={() => setFilters((f) => ({ ...f, query: h }))} />
                ))}
              </View>
            )}
          </View>
        ) : error ? (
          <ErrorState onRetry={reload} />
        ) : loading ? (
          <LoadingState />
        ) : results.length === 0 ? (
          <EmptyState icon="search-outline" message="Nenhum produto encontrado." actionLabel="Limpar filtros" onAction={() => setFilters(EMPTY_FILTERS)} />
        ) : (
          <View style={{ gap: 12 }}>
            <Text variant="caption">{results.length} {results.length === 1 ? 'produto' : 'produtos'}</Text>
            <ProductGrid products={results} />
          </View>
        )}
      </ScrollView>

      <FilterSheet visible={sheet} value={filters} onChange={setFilters} onClose={() => setSheet(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BrandColors.cream },
  top: { flexDirection: 'row', gap: 10, padding: 20, paddingBottom: 4, alignItems: 'center' },
  filterBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: BrandColors.panel, borderWidth: 1, borderColor: BrandColors.line, alignItems: 'center', justifyContent: 'center' },
  count: { position: 'absolute', top: 2, right: 2, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: BrandColors.roseDeep, alignItems: 'center', justifyContent: 'center' },
  histHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});
