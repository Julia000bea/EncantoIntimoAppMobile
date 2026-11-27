import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Text } from '@/components/atoms/Text';
import { Header } from '@/components/molecules/Header';
import { Screen } from '@/components/molecules/Screen';
import { BrandColors } from '@/constants/brand';
import { useApp } from '@/store/AppContext';
import { isValidEmail } from '@/utils/format';

/** Tela 3 — Login. `next` indica para onde voltar depois de entrar. */
export default function Login() {
  const { next } = useLocalSearchParams<{ next?: string }>();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const submit = () => {
    const e: typeof errors = {};
    if (!isValidEmail(email)) e.email = 'Informe um e-mail válido.';
    if (password.length < 1) e.password = 'Informe a senha.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const r = login(email, password);
    if (!r.ok) return setErrors({ form: r.error });
    router.replace((next as never) || '/(tabs)');
  };

  return (
    <Screen header={<Header title="Entrar" />}>
      <View style={{ alignItems: 'center', marginVertical: 12 }}>
        <Image source={require('@/assets/images/logo-wordmark.png')} style={{ width: 180, height: 87 }} resizeMode="contain" />
      </View>
      <Text variant="heading" center style={{ marginBottom: 20 }}>Que bom ter você de volta</Text>
      <Input label="E-mail" value={email} onChangeText={setEmail} error={errors.email} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
      <Input label="Senha" value={password} onChangeText={setPassword} error={errors.password} secureTextEntry autoCapitalize="none" />
      {errors.form ? <Text color={BrandColors.danger} style={{ marginBottom: 12 }}>{errors.form}</Text> : null}
      <Button title="Entrar" onPress={submit} />
      <Pressable onPress={() => router.replace({ pathname: '/signup', params: next ? { next } : {} })} style={{ padding: 16 }}>
        <Text center>
          Ainda não tem conta? <Text color={BrandColors.roseDeep} style={{ fontWeight: '600' }}>Criar conta</Text>
        </Text>
      </Pressable>
    </Screen>
  );
}
