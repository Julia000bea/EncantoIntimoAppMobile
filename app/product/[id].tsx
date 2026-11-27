import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Share, StyleSheet, View } from 'react-native';

import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Chip } from '@/components/atoms/Chip';
import { Price } from '@/components/atoms/Price';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/molecules/EmptyState';
import { FavoriteButton } from '@/components/molecules/FavoriteButton';
import { Header } from '@/components/molecules/Header';
import { ProductGallery } from '@/components/molecules/ProductGallery';
import { QuantitySelector } from '@/components/molecules/QuantitySelector';
import { Screen } from '@/components/molecules/Screen';
import { BrandColors, Radius } from '@/constants/brand';
import { PRODUCTS } from '@/data/products';
import { FREE_SHIPPING_FROM, SHIPPING_FLAT, useApp } from '@/store/AppContext';
import { discountPercent, formatBRL } from '@/utils/format';

/** Tela 9 — Detalhes do produto. */
export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = PRODUCTS.find((p) => p.id === id);
  const { addToCart } = useApp();
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [warn, setWarn] = useState<string | null>(null);

  if (!product) {
    return (
      <Screen scroll={false} header={<Header title="Produto" />}>
        <EmptyState icon="alert-circle-outline" message="Produto não encontrado." actionLabel="Voltar ao início" onAction={() => router.replace('/(tabs)')} />
      </Screen>
    );
  }

  const off = discountPercent(product.price, product.oldPrice);
  const soldOut = product.stock <= 0;

  const onAdd = () => {
    if (!size) return setWarn('Escolha o tamanho.');
    if (!color) return setWarn('Escolha a cor.');
    setWarn(null);
    addToCart(product.id, size, color, qty);
  };

  const onShare = () => {
    Share.share({ message: `Olha o que achei na Encanto Íntimo: ${product.name} por ${formatBRL(product.price)}.` }).catch(() => {});
  };

  return (
    <Screen
      scroll
      contentStyle={{ padding: 0, paddingBottom: 24 }}
      header={
        <Header
          title=""
          right={
            <Pressable accessibilityRole="button" accessibilityLabel="Compartilhar" hitSlop={10} onPress={onShare}>
              <Ionicons name="share-outline" size={24} color={BrandColors.ink} />
            </Pressable>
          }
        />
      }
      footer={
        <Button
          title={soldOut ? 'Produto esgotado' : 'Adicionar ao carrinho'}
          onPress={onAdd}
          disabled={soldOut}
        />
      }
    >
      <ProductGallery
        product={product}
        overlay={
          <View style={styles.fav}>
            <FavoriteButton productId={product.id} size={42} />
          </View>
        }
      />

      <View style={styles.body}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {off ? <Badge label={`-${off}%`} tone="rose" /> : null}
          {soldOut ? <Badge label="Esgotado" tone="ink" /> : product.stock <= 5 ? <Badge label={`Últimas ${product.stock} unidades`} tone="neutral" /> : null}
        </View>
        <Text variant="title" accessibilityRole="header">{product.name}</Text>
        <Price value={product.price} oldValue={product.oldPrice} size="lg" />
        <Text color={BrandColors.inkSoft} style={{ marginTop: 4 }}>{product.description}</Text>

        <Text variant="subtitle" style={styles.label}>Escolha o tamanho</Text>
        <View style={styles.wrap}>
          {product.sizes.map((s) => (
            <Chip key={s} label={s} selected={size === s} onPress={() => setSize(s)} />
          ))}
        </View>

        <Text variant="subtitle" style={styles.label}>Escolha a cor{color ? ` · ${color}` : ''}</Text>
        <View style={styles.wrap}>
          {product.colors.map((c) => {
            const sel = color === c.name;
            return (
              <Pressable
                key={c.name}
                accessibilityRole="button"
                accessibilityLabel={`Cor ${c.name}`}
                accessibilityState={{ selected: sel }}
                onPress={() => setColor(c.name)}
                style={[styles.swatchRing, sel && { borderColor: BrandColors.roseDeep }]}
              >
                <View style={[styles.swatch, { backgroundColor: c.hex }]} />
              </Pressable>
            );
          })}
        </View>

        <Text variant="subtitle" style={styles.label}>Quantidade</Text>
        <QuantitySelector value={qty} onChange={setQty} max={Math.max(1, Math.min(10, product.stock))} />

        {warn ? <Text color={BrandColors.danger} style={{ marginTop: 12 }}>{warn}</Text> : null}

        <View style={styles.info}>
          <InfoRow icon="car-outline" title="Entrega" text={`Frete de ${formatBRL(SHIPPING_FLAT)}. Grátis acima de ${formatBRL(FREE_SHIPPING_FROM)}.`} />
          <InfoRow icon="refresh-outline" title="Trocas e devoluções" text="Você tem até 7 dias após o recebimento para solicitar a devolução. Por higiene, a peça deve estar com a etiqueta e sem uso." />
        </View>
      </View>
    </Screen>
  );
}

function InfoRow({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon as never} size={22} color={BrandColors.roseDeep} />
      <View style={{ flex: 1 }}>
        <Text variant="label">{title}</Text>
        <Text variant="caption" style={{ marginTop: 2 }}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fav: { position: 'absolute', top: 14, right: 14 },
  body: { padding: 20, gap: 8 },
  label: { marginTop: 18, marginBottom: 6 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  swatchRing: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  swatch: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: BrandColors.line },
  info: { marginTop: 24, gap: 14, padding: 16, borderRadius: Radius.lg, backgroundColor: BrandColors.panel, borderWidth: 1, borderColor: BrandColors.line },
  infoRow: { flexDirection: 'row', gap: 12 },
});
