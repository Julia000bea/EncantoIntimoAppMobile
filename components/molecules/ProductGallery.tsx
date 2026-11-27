import { useRef, useState } from 'react';
import { FlatList, Pressable, type ImageSourcePropType, StyleSheet, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

import { BrandColors, Radius } from '@/constants/brand';
import type { Product } from '@/types';
import { ProductImage } from './ProductImage';

const SHADES = ['', 'CC', '99', '66']; // variações de intensidade do placeholder

/** Galeria com deslize (swipe) e miniaturas. Usa `product.images` quando houver fotos reais. */
export function ProductGallery({ product, overlay }: { product: Product; overlay?: React.ReactNode }) {
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const slides = product.images?.length
    ? product.images.map((src) => ({ tint: product.tint, src }))
    : SHADES.map((s) => ({ tint: s ? `${product.tint}${s}` : product.tint, src: undefined as ImageSourcePropType | undefined }));

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const goTo = (i: number) => {
    setIndex(i);
    listRef.current?.scrollToOffset({ offset: i * width, animated: true });
  };

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <View>
        {width > 0 ? (
          <FlatList
            ref={listRef}
            data={slides}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <ProductImage tint={item.tint} source={item.src} iconSize={96} style={{ width, height: width * 1.05 }} label={product.name} />
            )}
          />
        ) : (
          <View style={{ height: 320, backgroundColor: product.tint }} />
        )}
        {overlay}
        <View style={styles.dots} pointerEvents="none">
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      </View>
      <View style={styles.thumbs}>
        {slides.map((s, i) => (
          <Pressable
            key={i}
            accessibilityRole="button"
            accessibilityLabel={`Foto ${i + 1}`}
            onPress={() => goTo(i)}
            style={[styles.thumb, i === index && styles.thumbActive]}
          >
            <ProductImage tint={s.tint} source={s.src} iconSize={22} style={StyleSheet.absoluteFill} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dots: { position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.7)' },
  dotActive: { backgroundColor: BrandColors.roseDeep, width: 18 },
  thumbs: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 14 },
  thumb: { width: 62, height: 62, borderRadius: Radius.md, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  thumbActive: { borderColor: BrandColors.roseDeep },
});
