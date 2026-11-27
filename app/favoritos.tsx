import { router } from 'expo-router';

import { EmptyState } from '@/components/molecules/EmptyState';
import { Header } from '@/components/molecules/Header';
import { ProductGrid } from '@/components/molecules/ProductGrid';
import { Screen } from '@/components/molecules/Screen';
import { PRODUCTS } from '@/data/products';
import { useApp } from '@/store/AppContext';

/** Tela 11 — Favoritos. */
export default function Favoritos() {
  const { favorites } = useApp();
  const list = PRODUCTS.filter((p) => favorites.includes(p.id));
  return (
    <Screen scroll={list.length > 0} header={<Header title="Favoritos" />}>
      {list.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          message="Você ainda não adicionou nenhum produto aos favoritos."
          actionLabel="Ver produtos"
          onAction={() => router.push({ pathname: '/category/[id]', params: { id: 'todos' } })}
        />
      ) : (
        <ProductGrid products={list} />
      )}
    </Screen>
  );
}
