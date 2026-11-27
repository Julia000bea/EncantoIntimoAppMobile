import type { CategoryId, Product } from '@/types';

export type SortKey = 'recentes' | 'menor' | 'maior' | 'vendidos';
export type PriceRange = 'ate50' | '50a100' | '100a150' | 'acima150';

export type Filters = {
  query: string;
  category: CategoryId | null;
  size: string | null;
  color: string | null;
  price: PriceRange | null;
  onlyAvailable: boolean;
  sort: SortKey;
};

export const EMPTY_FILTERS: Filters = { query: '', category: null, size: null, color: null, price: null, onlyAvailable: false, sort: 'recentes' };

export const SORT_LABEL: Record<SortKey, string> = {
  recentes: 'Mais recentes',
  menor: 'Menor preço',
  maior: 'Maior preço',
  vendidos: 'Mais vendidos',
};

export const PRICE_LABEL: Record<PriceRange, string> = {
  ate50: 'Até R$ 50',
  '50a100': 'R$ 50 a R$ 100',
  '100a150': 'R$ 100 a R$ 150',
  acima150: 'Acima de R$ 150',
};

const inRange = (p: number, r: PriceRange) =>
  r === 'ate50' ? p <= 50 : r === '50a100' ? p > 50 && p <= 100 : r === '100a150' ? p > 100 && p <= 150 : p > 150;

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function applyFilters(products: Product[], f: Filters): Product[] {
  const q = norm(f.query.trim());
  const out = products.filter((p) => {
    if (q && !norm(`${p.name} ${p.description} ${p.category}`).includes(q)) return false;
    if (f.category && p.category !== f.category) return false;
    if (f.size && !p.sizes.includes(f.size)) return false;
    if (f.color && !p.colors.some((c) => c.name === f.color)) return false;
    if (f.price && !inRange(p.price, f.price)) return false;
    if (f.onlyAvailable && p.stock <= 0) return false;
    return true;
  });
  const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
    recentes: (a, b) => b.order - a.order,
    menor: (a, b) => a.price - b.price,
    maior: (a, b) => b.price - a.price,
    vendidos: (a, b) => b.sold - a.sold,
  };
  return out.sort(sorters[f.sort]);
}

export function activeFilterCount(f: Filters, ignoreCategory = false): number {
  return [!ignoreCategory && f.category, f.size, f.color, f.price, f.onlyAvailable].filter(Boolean).length;
}
