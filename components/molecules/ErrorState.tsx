import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { BrandColors } from '@/constants/brand';

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="cloud-offline-outline" size={44} color={BrandColors.rose} />
      <Text variant="subtitle" center>Não foi possível carregar os produtos. Tente novamente.</Text>
      <Text variant="caption" center>Verifique sua conexão com a internet.</Text>
      <Button title="Tentar novamente" onPress={onRetry} style={{ marginTop: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 12, padding: 32 },
});
