import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { CategoryCard } from '@/components/molecules/CategoryCard';
import { ErrorState } from '@/components/molecules/ErrorState';
import { LoadingState } from '@/components/molecules/LoadingState';
import { ProductGrid } from '@/components/molecules/ProductGrid';
import { BrandColors, Radius } from '@/constants/brand';
import { BANNER, CATEGORIES } from '@/data/products';
import { useProducts } from '@/hooks/useProducts';
import { useApp } from '@/store/AppContext';

/** Tela 5 — Home. */
export default function Home() {
  const { products, loading, error, reload } = useProducts();
  const { unreadCount } = useApp();
  const featured = [...products].sort((a, b) => b.sold - a.sold).slice(0, 6);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.top}>
          <Image source={require('@/assets/images/logo-wordmark.png')} style={{ width: 120, height: 58 }} resizeMode="contain" accessibilityLabel="Encanto Íntimo" />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable accessibilityRole="button" accessibilityLabel="Favoritos" onPress={() => router.push('/favoritos')} style={styles.iconBtn}>
              <Ionicons name="heart-outline" size={22} color={BrandColors.ink} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Notificações" onPress={() => router.push('/notificacoes')} style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={22} color={BrandColors.ink} />
              {unreadCount > 0 ? <View style={styles.dot} /> : null}
            </Pressable>
          </View>
        </View>

        <Pressable accessibilityRole="search" onPress={() => router.push('/(tabs)/buscar')} style={styles.search}>
          <Ionicons name="search" size={20} color={BrandColors.inkSoft} />
          <Text color={BrandColors.inkSoft}>Buscar produtos</Text>
        </Pressable>

        <View style={styles.hero}>
          <Text variant="caption" style={{ color: BrandColors.roseDeep, letterSpacing: 1.5, textTransform: 'uppercase' }}>Coleção</Text>
          <Text variant="title" style={{ marginTop: 4 }}>Sua essência em cada detalhe</Text>
          <Text color={BrandColors.inkSoft} style={{ marginTop: 6, marginBottom: 16 }}>Descubra nossa coleção.</Text>
          <Button title="Ver produtos" size="sm" onPress={() => router.push({ pathname: '/category/[id]', params: { id: 'todos' } })} style={{ alignSelf: 'flex-start' }} />
        </View>

        <Text variant="heading" style={styles.section}>Categorias</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </ScrollView>

        <Text variant="heading" style={styles.section}>Destaques para você</Text>
        <View style={{ paddingHorizontal: 20 }}>
          {error ? <ErrorState onRetry={reload} /> : loading ? <LoadingState /> : <ProductGrid products={featured} />}
        </View>

        <View style={styles.banner}>
          <Text variant="heading">{BANNER.title}</Text>
          <Text color={BrandColors.inkSoft} style={{ marginTop: 4, marginBottom: 14 }}>{BANNER.subtitle}</Text>
          <Button title={BANNER.cta} variant="outline" size="sm" onPress={() => router.push({ pathname: '/category/[id]', params: { id: 'novidades' } })} style={{ alignSelf: 'flex-start' }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BrandColors.cream },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 4 },
  iconBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: BrandColors.panel, borderWidth: 1, borderColor: BrandColors.line, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 9, right: 10, width: 9, height: 9, borderRadius: 5, backgroundColor: BrandColors.roseDeep },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, marginTop: 8, minHeight: 48, paddingHorizontal: 16, borderRadius: Radius.pill, backgroundColor: BrandColors.panel, borderWidth: 1, borderColor: BrandColors.line },
  hero: { margin: 20, padding: 24, borderRadius: Radius.lg, backgroundColor: BrandColors.blush },
  section: { paddingHorizontal: 20, marginTop: 8, marginBottom: 12 },
  catRow: { paddingHorizontal: 20, gap: 12, paddingBottom: 12 },
  banner: { margin: 20, padding: 24, borderRadius: Radius.lg, backgroundColor: BrandColors.nude },
});
