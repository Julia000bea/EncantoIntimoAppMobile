import { useCallback, useEffect, useState } from 'react';

import { fetchProducts } from '@/services/api';
import type { Product } from '@/types';

let cache: Product[] | null = null;

/** Carrega o catálogo com estados de carregamento e erro (com "tentar novamente"). */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (cache) return;
    let cancelled = false;
    fetchProducts()
      .then((list) => {
        cache = list;
        if (!cancelled) {
          setProducts(list);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const reload = useCallback(() => {
    setLoading(true);
    setError(false);
    setAttempt((a) => a + 1);
  }, []);

  return { products, loading, error, reload };
}
