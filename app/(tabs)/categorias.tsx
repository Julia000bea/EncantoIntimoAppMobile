import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { CategoryCard } from '@/components/molecules/CategoryCard';
import { Button } from '@/components/atoms/Button';
import { BrandColors } from '@/constants/brand';
import { CATEGORIES } from '@/data/products';

/** Tela 6 — Categorias. */
export default function Categorias() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrandColors.cream }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }} showsVerticalScrollIndicator={false}>
        <Text variant="title" accessibilityRole="header">Categorias</Text>
        <View style={{ gap: 12, marginTop: 8 }}>
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.id} category={c} variant="card" />
          ))}
        </View>
        <Button title="Ver todos os produtos" variant="secondary" onPress={() => router.push({ pathname: '/category/[id]', params: { id: 'todos' } })} style={{ marginTop: 8 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
