import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Text } from '@/components/atoms/Text';
import { CheckoutSteps } from '@/components/molecules/CheckoutSteps';
import { EmptyState } from '@/components/molecules/EmptyState';
import { Header } from '@/components/molecules/Header';
import { Screen } from '@/components/molecules/Screen';
import { BrandColors, Radius } from '@/constants/brand';
import { useApp } from '@/store/AppContext';
import { maskCpf, maskPhone, onlyDigits } from '@/utils/format';

/** Tela 13 — Identificação. */
export default function Identificacao() {
  const { user, cart, updateProfile } = useApp();
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [cpf, setCpf] = useState(user?.cpf ?? '');
  const [errors, setErrors] = useState<{ phone?: string; cpf?: string }>({});

  if (cart.length === 0) {
    return (
      <Screen scroll={false} header={<Header title="Finalizar compra" />}>
        <EmptyState message="Seu carrinho está vazio." actionLabel="Ver produtos" onAction={() => router.replace('/(tabs)')} />
      </Screen>
    );
  }

  if (!user) {
    return (
      <Screen header={<Header title="Finalizar compra" />}>
        <CheckoutSteps current={0} />
        <View style={{ gap: 12, padding: 20, borderRadius: Radius.lg, backgroundColor: BrandColors.blushSoft }}>
          <Text variant="heading">Entre para continuar</Text>
          <Text color={BrandColors.inkSoft}>Precisamos identificar você para acompanhar o pedido.</Text>
          <Button title="Entrar" onPress={() => router.push({ pathname: '/login', params: { next: '/checkout/identificacao' } })} />
          <Button title="Criar conta" variant="outline" onPress={() => router.push({ pathname: '/signup', params: { next: '/checkout/identificacao' } })} />
        </View>
      </Screen>
    );
  }

  const next = () => {
    const e: typeof errors = {};
    if (onlyDigits(phone).length < 10) e.phone = 'Informe um telefone com DDD.';
    if (onlyDigits(cpf).length !== 11) e.cpf = 'Informe os 11 números do CPF.';
    setErrors(e);
    if (Object.keys(e).length) return;
    updateProfile({ phone, cpf });
    router.push('/checkout/endereco');
  };

  return (
    <Screen header={<Header title="Finalizar compra" />} footer={<Button title="Continuar" onPress={next} />}>
      <CheckoutSteps current={0} />
      <Text variant="heading" style={{ marginBottom: 14 }}>Seus dados</Text>
      <Input label="Nome" value={user.name} editable={false} />
      <Input label="E-mail" value={user.email} editable={false} />
      <Input label="Telefone" value={phone} onChangeText={(t) => setPhone(maskPhone(t))} error={errors.phone} keyboardType="phone-pad" />
      <Input label="CPF" value={cpf} onChangeText={(t) => setCpf(maskCpf(t))} error={errors.cpf} keyboardType="number-pad" placeholder="000.000.000-00" />
    </Screen>
  );
}
