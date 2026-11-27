import { CATEGORIES, PRODUCTS } from '@/data/products';
import type { Category, Product } from '@/types';

/**
 * Camada de acesso a dados.
 * Hoje lê o catálogo de demonstração (data/products.ts). Para ligar o app a uma API real,
 * troque o corpo destas funções por chamadas `fetch` — as telas não precisam mudar.
 */

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function fetchProducts(): Promise<Product[]> {
  await delay(450); // simula a rede, para exibir o carregamento (skeleton)
  return PRODUCTS;
}

export async function fetchCategories(): Promise<Category[]> {
  return CATEGORIES;
}

export type CepResult = { street: string; district: string; city: string; state: string } | null;

/** Consulta de CEP pela API pública ViaCEP. Falhas (sem internet etc.) retornam null. */
export async function lookupCep(cep: string): Promise<CepResult> {
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.erro) return null;
    return { street: data.logradouro ?? '', district: data.bairro ?? '', city: data.localidade ?? '', state: data.uf ?? '' };
  } catch {
    return null;
  }
}
