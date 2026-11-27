import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { BrandColors } from '@/constants/brand';

type Props = {
  title: string;
  /** mostra o botão voltar (padrão: sim) */
  back?: boolean;
  right?: React.ReactNode;
};

export function Header({ title, back = true, right }: Props) {
  return (
    <View style={styles.bar}>
      <View style={styles.side}>
        {back ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={10}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
            style={styles.back}
          >
            <Ionicons name="chevron-back" size={22} color={BrandColors.ink} />
          </Pressable>
        ) : null}
      </View>
      <Text variant="heading" numberOfLines={1} style={styles.title} accessibilityRole="header">{title}</Text>
      <View style={[styles.side, { alignItems: 'flex-end' }]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, minHeight: 56 },
  side: { width: 48 },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: BrandColors.panel, borderWidth: 1, borderColor: BrandColors.line, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: 20 },
});
