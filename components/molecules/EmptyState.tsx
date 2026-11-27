import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { BrandColors } from '@/constants/brand';

type Props = {
  icon?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon = 'bag-outline', message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.circle}>
        <Ionicons name={icon as never} size={40} color={BrandColors.rose} />
      </View>
      <Text variant="subtitle" center style={{ maxWidth: 280 }}>{message}</Text>
      {actionLabel && onAction ? <Button title={actionLabel} onPress={onAction} style={{ marginTop: 8 }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32, flex: 1 },
  circle: { width: 96, height: 96, borderRadius: 48, backgroundColor: BrandColors.blush, alignItems: 'center', justifyContent: 'center' },
});
