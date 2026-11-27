import { router } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { BrandColors } from '@/constants/brand';
import { useApp } from '@/store/AppContext';

/** Tela 2 — Boas-vindas. */
export default function Welcome() {
  const { completeFirstRun } = useApp();
  const start = () => {
    completeFirstRun();
    router.replace('/(tabs)');
  };
  const haveAccount = () => {
    completeFirstRun();
    router.replace('/login');
  };
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.hero}>
        <View style={styles.circle}>
          <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" accessibilityLabel="Encanto Íntimo" />
        </View>
      </View>
      <View style={styles.bottom}>
        <Text variant="title" center>Sua beleza, seu conforto, seu estilo.</Text>
        <Text center color={BrandColors.inkSoft} style={{ marginTop: 4 }}>
          Lingeries, pijamas e muito mais, escolhidos com carinho para você.
        </Text>
        <View style={{ gap: 12, marginTop: 24 }}>
          <Button title="Começar a comprar" onPress={start} />
          <Button title="Já tenho uma conta" variant="outline" onPress={haveAccount} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BrandColors.cream },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circle: { width: 290, height: 290, borderRadius: 145, backgroundColor: BrandColors.blush, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 210, height: 178 },
  bottom: { padding: 24, paddingBottom: 32 },
});
