import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/brand';

type Props = {
  children: React.ReactNode;
  /** conteúdo rolável (padrão: true). Use false quando a tela tiver uma lista própria. */
  scroll?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  edges?: ('top' | 'bottom')[];
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({ children, scroll = true, header, footer, edges = ['top'], contentStyle }: Props) {
  return (
    <SafeAreaView style={styles.root} edges={footer ? [...edges.filter((e) => e !== 'bottom')] : edges}>
      {header}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.content, contentStyle]}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
        )}
      </KeyboardAvoidingView>
      {footer ? <SafeAreaView edges={['bottom']} style={styles.footer}>{footer}</SafeAreaView> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BrandColors.cream },
  content: { padding: 20, paddingBottom: 32, gap: 4 },
  footer: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, backgroundColor: BrandColors.panel, borderTopWidth: 1, borderTopColor: BrandColors.line },
});
