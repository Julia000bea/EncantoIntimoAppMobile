import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Text } from '@/components/atoms/Text';
import { Header } from '@/components/molecules/Header';
import { Screen } from '@/components/molecules/Screen';
import { BrandColors } from '@/constants/brand';
import { useApp } from '@/store/AppContext';
import { isValidEmail, maskPhone, onlyDigits } from '@/utils/format';

/** Tela 4 — Cadastro. */
export default function Signup() {
  const { next } = useLocalSearchParams<{ next?: string }>();
  const { register } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Informe seu nome.';
    if (!isValidEmail(email)) e.email = 'Informe um e-mail válido.';
    if (phone && onlyDigits(phone).length < 10) e.phone = 'Telefone incompleto.';
    if (password.length < 6) e.password = 'A senha deve ter pelo menos 6 caracteres.';
    if (confirm !== password) e.confirm = 'As senhas não conferem.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const r = register({ name, email, password, phone: phone || undefined });
    if (!r.ok) return setErrors({ email: r.error });
    router.replace((next as never) || '/(tabs)');
  };

  return (
    <Screen header={<Header title="Criar conta" />}>
      <Text variant="heading" center style={{ marginBottom: 20 }}>Vamos começar</Text>
      <Input label="Nome completo" value={name} onChangeText={setName} error={errors.name} autoCapitalize="words" />
      <Input label="E-mail" value={email} onChangeText={setEmail} error={errors.email} keyboardType="email-address" autoCapitalize="none" />
      <Input label="Telefone (opcional)" value={phone} onChangeText={(t) => setPhone(maskPhone(t))} error={errors.phone} keyboardType="phone-pad" />
      <Input label="Senha" value={password} onChangeText={setPassword} error={errors.password} secureTextEntry autoCapitalize="none" />
      <Input label="Confirmar senha" value={confirm} onChangeText={setConfirm} error={errors.confirm} secureTextEntry autoCapitalize="none" />
      <Button title="Criar conta" onPress={submit} />
      <Pressable onPress={() => router.replace({ pathname: '/login', params: next ? { next } : {} })} style={{ padding: 16 }}>
        <Text center>
          Já tenho uma conta <Text color={BrandColors.roseDeep}>Entrar</Text>
        </Text>
      </Pressable>
    </Screen>
  );
}
