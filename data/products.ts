import type { Category, Product, ProductColor } from '@/types';
import { PRODUCT_IMAGES } from './product-images';

/**
 * ATENÇÃO: catálogo de DEMONSTRAÇÃO.
 * Nomes, preços e estoque são fictícios, criados só para mostrar o app funcionando.
 * Fotos: produtos 1, 5 e 11 usam fotos reais enviadas pela loja; os demais usam ilustrações de demonstração.
 * Quando a loja fornecer o catálogo real, substitua este arquivo (ou troque a função
 * `fetchProducts` em services/api.ts por uma chamada à API).
 */

export const CATEGORIES: Category[] = [
  { id: 'lingeries', name: 'Lingeries', icon: 'heart-outline' },
  { id: 'sutias', name: 'Sutiãs', icon: 'ellipse-outline' },
  { id: 'calcinhas', name: 'Calcinhas', icon: 'triangle-outline' },
  { id: 'conjuntos', name: 'Conjuntos', icon: 'sparkles-outline' },
  { id: 'pijamas', name: 'Pijamas', icon: 'moon-outline' },
  { id: 'bodies', name: 'Bodies', icon: 'body-outline' },
  { id: 'outros', name: 'Outros', icon: 'gift-outline' },
];

export const COLORS: Record<string, ProductColor> = {
  nude: { name: 'Nude', hex: '#E7CDB8' },
  preto: { name: 'Preto', hex: '#2B2420' },
  rose: { name: 'Rosé', hex: '#C98D86' },
  vermelho: { name: 'Vermelho', hex: '#B5202E' },
  malva: { name: 'Malva', hex: '#B27A9A' },
  azul: { name: 'Azul', hex: '#AFC8EE' },
  branco: { name: 'Branco', hex: '#F6F1EC' },
  vinho: { name: 'Vinho', hex: '#7A2E3A' },
};

const c = (...keys: string[]) => keys.map((k) => COLORS[k]);
const SIZES = ['P', 'M', 'G', 'GG'];

const RAW_PRODUCTS: Omit<Product, 'images'>[] = [
  { id: '1', name: 'Conjunto Renda Vermelho', category: 'conjuntos', price: 129.9, description: 'Conjunto de sutiã e calcinha em renda com detalhes de laço e argolas em coração, para momentos especiais.', sizes: SIZES, colors: c('vermelho', 'preto', 'nude'), stock: 14, sold: 120, order: 16, tint: '#F1DCD8' },
  { id: '2', name: 'Sutiã Sem Costura Nude', category: 'sutias', price: 79.9, oldPrice: 99.9, description: 'Sutiã sem costura, invisível sob a roupa, com bojo leve e tecido que se adapta ao corpo.', sizes: SIZES, colors: c('nude', 'preto', 'branco'), stock: 30, sold: 210, order: 15, tint: '#E7CDB8' },
  { id: '3', name: 'Calcinha Algodão Conforto', category: 'calcinhas', price: 29.9, description: 'Calcinha de algodão com elastano, cós macio e modelagem que não marca.', sizes: SIZES, colors: c('nude', 'preto', 'branco', 'rose'), stock: 80, sold: 340, order: 14, tint: '#F7EAE7' },
  { id: '4', name: 'Body Renda Elegance', category: 'bodies', price: 159.9, oldPrice: 189.9, description: 'Body em renda com decote delicado e fechamento por colchetes.', sizes: SIZES, colors: c('preto', 'vinho'), stock: 8, sold: 75, order: 13, tint: '#E3C6C1' },
  { id: '5', name: 'Pijama Short Malva', category: 'pijamas', price: 189.9, description: 'Pijama curto de malha macia com alças finas, acabamento em contraste e cordão na cintura.', sizes: SIZES, colors: c('malva', 'rose'), stock: 12, sold: 98, order: 12, tint: '#EBCFCB' },
  { id: '6', name: 'Camisola Seda Fluida', category: 'lingeries', price: 119.9, description: 'Camisola curta com caimento fluido e alças ajustáveis.', sizes: SIZES, colors: c('vinho', 'preto', 'nude'), stock: 10, sold: 64, order: 11, tint: '#F1DCD8' },
  { id: '7', name: 'Sutiã Bojo Suave', category: 'sutias', price: 89.9, description: 'Sutiã com bojo suave e alças ajustáveis, sustentação leve e macia.', sizes: SIZES, colors: c('nude', 'preto'), stock: 22, sold: 150, order: 10, tint: '#EFD9C9' },
  { id: '8', name: 'Calcinha Renda Fio', category: 'calcinhas', price: 34.9, oldPrice: 44.9, description: 'Calcinha de renda com lateral fina e toque delicado.', sizes: SIZES, colors: c('preto', 'rose', 'vinho'), stock: 0, sold: 180, order: 9, tint: '#F7EAE7' },
  { id: '9', name: 'Conjunto Microfibra Liso', category: 'conjuntos', price: 109.9, description: 'Conjunto em microfibra lisa, acabamento sem costuras laterais.', sizes: SIZES, colors: c('nude', 'preto', 'branco'), stock: 18, sold: 132, order: 8, tint: '#E7CDB8' },
  { id: '10', name: 'Body Modelador Nude', category: 'bodies', price: 139.9, description: 'Body com leve compressão que valoriza a silhueta com conforto.', sizes: SIZES, colors: c('nude', 'preto'), stock: 9, sold: 59, order: 7, tint: '#EFD9C9' },
  { id: '11', name: 'Pijama Corações Azul', category: 'pijamas', price: 149.9, oldPrice: 179.9, description: 'Pijama curto de malha macia com estampa de corações e cordão na cintura.', sizes: SIZES, colors: c('azul', 'rose'), stock: 16, sold: 87, order: 6, tint: '#F1DCD8' },
  { id: '12', name: 'Robe Acetinado', category: 'lingeries', price: 99.9, description: 'Robe leve e acetinado com faixa na cintura e bolsos.', sizes: SIZES, colors: c('vinho', 'rose', 'preto'), stock: 11, sold: 46, order: 5, tint: '#E3C6C1' },
  { id: '13', name: 'Meia-calça Fina Nude', category: 'outros', price: 24.9, description: 'Meia-calça fina com elastano, ótima para o dia a dia.', sizes: ['P', 'M', 'G'], colors: c('nude', 'preto'), stock: 40, sold: 90, order: 4, tint: '#F7EAE7' },
  { id: '14', name: 'Conjunto Cetim Noite', category: 'conjuntos', price: 169.9, oldPrice: 199.9, description: 'Conjunto em cetim com detalhes em renda para ocasiões especiais.', sizes: SIZES, colors: c('vinho', 'preto'), stock: 7, sold: 71, order: 3, tint: '#EBCFCB' },
  { id: '15', name: 'Sutiã Top Algodão', category: 'sutias', price: 59.9, description: 'Top de algodão sem aro, confortável para usar o dia todo.', sizes: SIZES, colors: c('branco', 'preto', 'rose'), stock: 25, sold: 110, order: 2, tint: '#F7EAE7' },
  { id: '16', name: 'Kit Sachê Perfumado', category: 'outros', price: 19.9, description: 'Sachês perfumados para gavetas e guarda-roupas, aroma suave.', sizes: ['Único'], colors: c('rose'), stock: 50, sold: 40, order: 1, tint: '#F1DCD8' },
];

export const PRODUCTS: Product[] = RAW_PRODUCTS.map((p) => ({ ...p, images: PRODUCT_IMAGES[p.id] }));

export const BANNER = {
  title: 'Nova coleção',
  subtitle: 'Renda, cetim e conforto em cada peça.',
  cta: 'Conhecer coleção',
};
