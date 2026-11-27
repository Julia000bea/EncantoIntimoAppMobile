import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { PRODUCTS } from '@/data/products';
import type {
  Address,
  AppNotification,
  CartLine,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  Product,
  User,
} from '@/types';

const STORAGE_KEY = '@encanto-intimo/v1';

export const SHIPPING_FLAT = 15;
export const FREE_SHIPPING_FROM = 299;

export const STATUS_FLOW: OrderStatus[] = ['realizado', 'pagamento', 'preparacao', 'enviado', 'entregue'];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  realizado: 'Pedido realizado',
  pagamento: 'Pagamento aprovado',
  preparacao: 'Em preparação',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

type StoredUser = User & { passwordHash: string };

type Persisted = {
  firstRun: boolean;
  users: StoredUser[];
  currentUserId: string | null;
  cart: CartLine[];
  favorites: string[];
  history: string[];
  orders: Order[];
  addresses: Address[];
  notifications: AppNotification[];
  orderCounter: number;
};

const INITIAL: Persisted = {
  firstRun: true,
  users: [],
  currentUserId: null,
  cart: [],
  favorites: [],
  history: [],
  orders: [],
  addresses: [],
  notifications: [],
  orderCounter: 122, // o primeiro pedido será #000123
};

// Hash simples apenas para não guardar a senha em texto puro neste protótipo.
// Em produção a autenticação deve ficar em um servidor (ver README).
function hashPassword(p: string): string {
  let h = 5381;
  for (let i = 0; i < p.length; i++) h = ((h << 5) + h + p.charCodeAt(i)) | 0;
  return `h${h}`;
}

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export type CartDetailed = CartLine & { product: Product };

export type Totals = { subtotal: number; discount: number; shipping: number; total: number; count: number };

export type CheckoutDraft = {
  addressId: string | null;
  payment: { method: PaymentMethod; detail?: string } | null;
};

type Result = { ok: true } | { ok: false; error: string };

type AppContextValue = {
  ready: boolean;
  firstRun: boolean;
  completeFirstRun: () => void;

  user: User | null;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Result;
  login: (email: string, password: string) => Result;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, 'name' | 'email' | 'phone' | 'cpf'>>) => Result;
  changePassword: (current: string, next: string) => Result;

  cart: CartDetailed[];
  totals: Totals;
  addToCart: (productId: string, size: string, color: string, quantity: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;

  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;

  history: string[];
  addHistory: (term: string) => void;
  clearHistory: () => void;

  addresses: Address[];
  saveAddress: (a: Omit<Address, 'id' | 'isMain'> & { id?: string }) => Address;
  removeAddress: (id: string) => void;
  setMainAddress: (id: string) => void;

  orders: Order[];
  checkout: CheckoutDraft;
  setCheckout: (patch: Partial<CheckoutDraft>) => void;
  placeOrder: (payment?: { method: PaymentMethod; detail?: string }) => Order | null;
  advanceOrder: (id: string) => void;
  cancelOrder: (id: string) => void;

  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => void;

  toast: string | null;
  showToast: (message: string) => void;
};

const Ctx = createContext<AppContextValue | null>(null);

export function computeTotals(lines: { price: number; oldPrice?: number; quantity: number }[]): Totals {
  let subtotal = 0;
  let discount = 0;
  let count = 0;
  for (const l of lines) {
    const original = l.oldPrice && l.oldPrice > l.price ? l.oldPrice : l.price;
    subtotal += original * l.quantity;
    discount += (original - l.price) * l.quantity;
    count += l.quantity;
  }
  const net = subtotal - discount;
  const shipping = count === 0 || net >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT;
  return {
    subtotal: round2(subtotal),
    discount: round2(discount),
    shipping,
    total: round2(net + shipping),
    count,
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Persisted>(INITIAL);
  const [ready, setReady] = useState(false);
  const [checkout, setCheckoutState] = useState<CheckoutDraft>({ addressId: null, payment: null });
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Carrega o que foi salvo no aparelho
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setData({ ...INITIAL, ...(JSON.parse(raw) as Partial<Persisted>) });
      } catch {
        // dados corrompidos: começa do zero
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // Salva a cada mudança
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
  }, [data, ready]);

  const update = useCallback((fn: (d: Persisted) => Persisted) => setData((d) => fn(d)), []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const user = useMemo<User | null>(() => {
    const u = data.users.find((x) => x.id === data.currentUserId);
    if (!u) return null;
    const { passwordHash: _ph, ...rest } = u;
    return rest;
  }, [data.users, data.currentUserId]);

  const welcomeNote = (): AppNotification => ({
    id: uid(),
    title: 'Bem-vinda à Encanto Íntimo',
    message: 'Sua beleza, seu conforto, seu estilo. Explore a nova coleção.',
    createdAt: new Date().toISOString(),
    read: false,
  });

  const register: AppContextValue['register'] = (form) => {
    const email = form.email.trim().toLowerCase();
    if (data.users.some((u) => u.email === email)) return { ok: false, error: 'Já existe uma conta com este e-mail.' };
    const newUser: StoredUser = {
      id: uid(),
      name: form.name.trim(),
      email,
      phone: form.phone,
      passwordHash: hashPassword(form.password),
    };
    update((d) => ({
      ...d,
      users: [...d.users, newUser],
      currentUserId: newUser.id,
      notifications: [welcomeNote(), ...d.notifications],
    }));
    return { ok: true };
  };

  const login: AppContextValue['login'] = (emailRaw, password) => {
    const email = emailRaw.trim().toLowerCase();
    const u = data.users.find((x) => x.email === email);
    if (!u || u.passwordHash !== hashPassword(password)) return { ok: false, error: 'E-mail ou senha incorretos.' };
    update((d) => ({ ...d, currentUserId: u.id }));
    return { ok: true };
  };

  const logout = () => update((d) => ({ ...d, currentUserId: null }));

  const updateProfile: AppContextValue['updateProfile'] = (patch) => {
    if (!user) return { ok: false, error: 'Faça login para continuar.' };
    if (patch.email) {
      const email = patch.email.trim().toLowerCase();
      if (data.users.some((u) => u.id !== user.id && u.email === email)) return { ok: false, error: 'Este e-mail já está em uso.' };
      patch = { ...patch, email };
    }
    update((d) => ({ ...d, users: d.users.map((u) => (u.id === user.id ? { ...u, ...patch } : u)) }));
    return { ok: true };
  };

  const changePassword: AppContextValue['changePassword'] = (current, next) => {
    const stored = data.users.find((u) => u.id === data.currentUserId);
    if (!stored) return { ok: false, error: 'Faça login para continuar.' };
    if (stored.passwordHash !== hashPassword(current)) return { ok: false, error: 'A senha atual está incorreta.' };
    update((d) => ({ ...d, users: d.users.map((u) => (u.id === stored.id ? { ...u, passwordHash: hashPassword(next) } : u)) }));
    return { ok: true };
  };

  // ---- Carrinho ----
  const cart = useMemo<CartDetailed[]>(
    () =>
      data.cart
        .map((l) => ({ ...l, product: PRODUCTS.find((p) => p.id === l.productId) as Product }))
        .filter((l) => !!l.product),
    [data.cart],
  );

  const totals = useMemo(
    () => computeTotals(cart.map((l) => ({ price: l.product.price, oldPrice: l.product.oldPrice, quantity: l.quantity }))),
    [cart],
  );

  const addToCart: AppContextValue['addToCart'] = (productId, size, color, quantity) => {
    const key = `${productId}|${size}|${color}`;
    update((d) => {
      const existing = d.cart.find((l) => l.key === key);
      const cartLines = existing
        ? d.cart.map((l) => (l.key === key ? { ...l, quantity: Math.min(l.quantity + quantity, 10) } : l))
        : [...d.cart, { key, productId, size, color, quantity }];
      return { ...d, cart: cartLines };
    });
    showToast('✓ Produto adicionado ao carrinho');
  };

  const setQuantity = (key: string, quantity: number) =>
    update((d) => ({
      ...d,
      cart: quantity <= 0 ? d.cart.filter((l) => l.key !== key) : d.cart.map((l) => (l.key === key ? { ...l, quantity: Math.min(quantity, 10) } : l)),
    }));

  const removeFromCart = (key: string) => update((d) => ({ ...d, cart: d.cart.filter((l) => l.key !== key) }));

  // ---- Favoritos ----
  const isFavorite = (id: string) => data.favorites.includes(id);
  const toggleFavorite = (id: string) =>
    update((d) => ({ ...d, favorites: d.favorites.includes(id) ? d.favorites.filter((f) => f !== id) : [...d.favorites, id] }));

  // ---- Busca ----
  const addHistory = (term: string) => {
    const t = term.trim();
    if (!t) return;
    update((d) => ({ ...d, history: [t, ...d.history.filter((h) => h.toLowerCase() !== t.toLowerCase())].slice(0, 8) }));
  };
  const clearHistory = () => update((d) => ({ ...d, history: [] }));

  // ---- Endereços ----
  const saveAddress: AppContextValue['saveAddress'] = (a) => {
    const id = a.id ?? uid();
    const saved: Address = { ...a, id, isMain: false };
    update((d) => {
      const exists = d.addresses.some((x) => x.id === id);
      const isFirst = d.addresses.length === 0;
      let list: Address[];
      if (exists) {
        list = d.addresses.map((x) => (x.id === id ? { ...saved, isMain: x.isMain } : x));
      } else {
        list = [...d.addresses, { ...saved, isMain: isFirst }];
      }
      return { ...d, addresses: list };
    });
    return saved;
  };

  const removeAddress = (id: string) =>
    update((d) => {
      const list = d.addresses.filter((x) => x.id !== id);
      if (list.length > 0 && !list.some((x) => x.isMain)) list[0] = { ...list[0], isMain: true };
      return { ...d, addresses: list };
    });

  const setMainAddress = (id: string) =>
    update((d) => ({ ...d, addresses: d.addresses.map((x) => ({ ...x, isMain: x.id === id })) }));

  // ---- Checkout / pedidos ----
  const setCheckout = (patch: Partial<CheckoutDraft>) => setCheckoutState((c) => ({ ...c, ...patch }));

  const placeOrder: AppContextValue['placeOrder'] = (paymentOverride) => {
    const payment = paymentOverride ?? checkout.payment;
    if (!user || cart.length === 0 || !payment) return null;
    const address = data.addresses.find((a) => a.id === checkout.addressId);
    if (!address) return null;
    const items: OrderItem[] = cart.map((l) => ({
      productId: l.productId,
      name: l.product.name,
      price: l.product.price,
      oldPrice: l.product.oldPrice,
      size: l.size,
      color: l.color,
      quantity: l.quantity,
      tint: l.product.tint,
    }));
    const t = computeTotals(items);
    const nextCounter = data.orderCounter + 1;
    const now = new Date().toISOString();
    const order: Order = {
      id: String(nextCounter).padStart(6, '0'),
      createdAt: now,
      status: 'realizado',
      stageDates: { realizado: now },
      items,
      subtotal: t.subtotal,
      discount: t.discount,
      shipping: t.shipping,
      total: t.total,
      address,
      payment,
      customerName: user.name,
    };
    const note: AppNotification = {
      id: uid(),
      title: `Pedido #${order.id} realizado`,
      message: 'Recebemos o seu pedido. Obrigada por comprar na Encanto Íntimo.',
      createdAt: now,
      read: false,
    };
    update((d) => ({
      ...d,
      orders: [order, ...d.orders],
      orderCounter: nextCounter,
      cart: [],
      notifications: [note, ...d.notifications],
    }));
    setCheckoutState({ addressId: null, payment: null });
    return order;
  };

  const advanceOrder = (id: string) =>
    update((d) => ({
      ...d,
      orders: d.orders.map((o) => {
        if (o.id !== id || o.status === 'cancelado') return o;
        const idx = STATUS_FLOW.indexOf(o.status);
        if (idx < 0 || idx >= STATUS_FLOW.length - 1) return o;
        const next = STATUS_FLOW[idx + 1];
        return { ...o, status: next, stageDates: { ...o.stageDates, [next]: new Date().toISOString() } };
      }),
      notifications: [
        {
          id: uid(),
          title: `Pedido #${id} atualizado`,
          message: 'O status do seu pedido mudou. Toque em Meus pedidos para acompanhar.',
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...d.notifications,
      ],
    }));

  const cancelOrder = (id: string) =>
    update((d) => ({
      ...d,
      orders: d.orders.map((o) =>
        o.id === id && (o.status === 'realizado' || o.status === 'pagamento')
          ? { ...o, status: 'cancelado', stageDates: { ...o.stageDates, cancelado: new Date().toISOString() } }
          : o,
      ),
    }));

  // ---- Notificações ----
  const unreadCount = data.notifications.filter((n) => !n.read).length;
  const markAllRead = () => update((d) => ({ ...d, notifications: d.notifications.map((n) => ({ ...n, read: true })) }));

  const value: AppContextValue = {
    ready,
    firstRun: data.firstRun,
    completeFirstRun: () => update((d) => ({ ...d, firstRun: false })),
    user,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    cart,
    totals,
    addToCart,
    setQuantity,
    removeFromCart,
    favorites: data.favorites,
    isFavorite,
    toggleFavorite,
    history: data.history,
    addHistory,
    clearHistory,
    addresses: data.addresses,
    saveAddress,
    removeAddress,
    setMainAddress,
    orders: data.orders,
    checkout,
    setCheckout,
    placeOrder,
    advanceOrder,
    cancelOrder,
    notifications: data.notifications,
    unreadCount,
    markAllRead,
    toast,
    showToast,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp deve ser usado dentro de <AppProvider>');
  return v;
}
