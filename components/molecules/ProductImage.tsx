import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';

import { BrandColors } from '@/constants/brand';

type Props = {
  tint: string;
  source?: ImageSourcePropType;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
  label?: string;
};

/** Mostra a foto do produto; sem foto real, exibe um espaço reservado com a cor do produto. */
export function ProductImage({ tint, source, iconSize = 44, style, label }: Props) {
  return (
    <View style={[styles.box, { backgroundColor: tint }, style]} accessibilityLabel={label} accessibilityRole="image">
      {source ? (
        <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" />
      ) : (
        <Ionicons name="shirt-outline" size={iconSize} color={BrandColors.rose} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
