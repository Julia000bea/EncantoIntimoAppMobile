import type { ImageSourcePropType } from 'react-native';

export type CategoryId = 'lingeries' | 'sutias' | 'calcinhas' | 'conjuntos' | 'pijamas' | 'bodies' | 'outros';

export type Category = {
  id: CategoryId;
  name: string;
  icon: string; // nome de ícone Ionicons
};

export type ProductColor = { name: string; hex: string };

export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  oldPrice?: number;
  description: string;
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  sold: number; // para ordenar por "mais vendidos"
  order: number; // maior = mais recente
  tint: string; // cor do placeholder (até existirem fotos reais)
  images?: ImageSourcePropType[]; // galeria de fotos (a primeira é a capa)
};

export type CartLine = {
  key: string; // productId|size|color
  productId: string;
  size: string;
  color: string;
  quantity: number;
};

export type Address = {
  id: string;
  recipient: string;
  zip: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  isMain: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
};

export type OrderStatus = 'realizado' | 'pagamento' | 'preparacao' | 'enviado' | 'entregue' | 'cancelado';

export type PaymentMethod = 'cartao' | 'pix' | 'outras';

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  oldPrice?: number;
  size: string;
  color: string;
  quantity: number;
  tint: string;
};

export type Order = {
  id: string; // ex.: 000123
  createdAt: string; // ISO
  status: OrderStatus;
  stageDates: Partial<Record<OrderStatus, string>>;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  address: Address;
  payment: { method: PaymentMethod; detail?: string };
  customerName: string;
};

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};
