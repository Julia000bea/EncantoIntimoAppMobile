import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ErrorState } from '@/components/molecules/ErrorState';
import { FilterSheet } from '@/components/molecules/FilterSheet';
import { Header } from '@/components/molecules/Header';
import { LoadingState } from '@/components/molecules/LoadingState';
import { ProductGrid } from '@/components/molecules/ProductGrid';
import { Screen } from '@/components/molecules/Screen';
import { BrandColors } from '@/constants/brand';
import { CATEGORIES } from '@/data/products';
import { useProducts } from '@/hooks/useProducts';
import { EMPTY_FILTERS, SORT_LABEL, activeFilterCount, applyFilters, type Filters } from '@/utils/filter';
import type { CategoryId } from '@/types';

/** Tela 8 — Lista de produtos (grade de 2 colunas) de uma categoria, de todos ou das novidades. */
export default function CategoryList() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cat = CATEGORIES.find((c) => c.id === id);
  const title = cat ? cat.name : id === 'novidades' ? 'Nova coleção' : 'Todos os produtos';

  const { products, loading, error, reload } = useProducts();
  const [filters, setFilters] = useState<Filters>({ ...EMPTY_FILTERS, category: (cat?.id as CategoryId) ?? null });
  const [sheet, setSheet] = useState(false);

  const list = useMemo(() => applyFilters(products, filters), [products, filters]);
  const n = activeFilterCount(filters, true);

  return (
    <Screen
      scroll
      header={
        <Header
          title={title}
          right={
            <Pressable accessibilityRole="button" accessibilityLabel="Filtros e ordenação" onPress={() => setSheet(true)} hitSlop={10}>
              <Ionicons name="options-outline" size={24} color={BrandColors.ink} />
            </Pressable>
          }
        />
      }
    >
      <Text variant="caption" style={{ marginBottom: 12 }}>
        {SORT_LABEL[filters.sort]}{n > 0 ? ` · ${n} ${n === 1 ? 'filtro' : 'filtros'}` : ''}
      </Text>
      {error ? (
        <ErrorState onRetry={reload} />
      ) : loading ? (
        <View style={{ marginHorizontal: -20 }}>
          <LoadingState />
        </View>
      ) : list.length === 0 ? (
        <EmptyState icon="search-outline" message="Nenhum produto encontrado." actionLabel="Limpar filtros" onAction={() => setFilters({ ...EMPTY_FILTERS, category: filters.category })} />
      ) : (
        <ProductGrid products={list} />
      )}
      <FilterSheet visible={sheet} value={filters} onChange={setFilters} onClose={() => setSheet(false)} hideCategory />
    </Screen>
  );
}
