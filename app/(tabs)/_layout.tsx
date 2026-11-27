import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandColors, Fonts } from '@/constants/brand';
import { useApp } from '@/store/AppContext';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const icon = (active: IconName, inactive: IconName) =>
  function TabIcon({ color, size, focused }: { color: import('react-native').ColorValue; size: number; focused: boolean }) {
    return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
  };

export default function TabsLayout() {
  const { totals } = useApp();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BrandColors.roseDeep,
        tabBarInactiveTintColor: BrandColors.inkSoft,
        tabBarLabelStyle: { fontFamily: Fonts.bodyMedium, fontSize: 11 },
        tabBarStyle: {
          backgroundColor: BrandColors.panel,
          borderTopColor: BrandColors.line,
          height: 64 + (Platform.OS === 'web' ? 0 : insets.bottom),
          paddingBottom: Platform.OS === 'web' ? 8 : insets.bottom,
          paddingTop: 8,
        },
        tabBarBadgeStyle: { backgroundColor: BrandColors.roseDeep, color: BrandColors.white, fontFamily: Fonts.bodySemi },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: icon('home', 'home-outline') }} />
      <Tabs.Screen name="buscar" options={{ title: 'Buscar', tabBarIcon: icon('search', 'search-outline') }} />
      <Tabs.Screen name="categorias" options={{ title: 'Categorias', tabBarIcon: icon('grid', 'grid-outline') }} />
      <Tabs.Screen
        name="carrinho"
        options={{
          title: 'Carrinho',
          tabBarIcon: icon('bag', 'bag-outline'),
          tabBarBadge: totals.count > 0 ? totals.count : undefined,
        }}
      />
      <Tabs.Screen name="conta" options={{ title: 'Conta', tabBarIcon: icon('person', 'person-outline') }} />
    </Tabs>
  );
}
