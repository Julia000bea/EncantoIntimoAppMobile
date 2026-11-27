import { router } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/molecules/EmptyState';
import { Header } from '@/components/molecules/Header';
import { Screen } from '@/components/molecules/Screen';
import { BrandColors } from '@/constants/brand';
import { useApp } from '@/store/AppContext';
import { isValidEmail, maskCpf, maskPhone, onlyDigits } from '@/utils/format';

/** Tela 19 — Perfil (meus dados). */
export default function Perfil() {
  const { user, updateProfile, showToast } = useApp();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [cpf, setCpf] = useState(user?.cpf ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) {
    return (
      <Screen scroll={false} header={<Header title="Meus dados" />}>
        <EmptyState icon="person-outline" message="Entre na sua conta para ver seus dados." actionLabel="Entrar" onAction={() => router.replace('/login')} />
      </Screen>
    );
  }

  const save = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Informe seu nome.';
    if (!isValidEmail(email)) e.email = 'Informe um e-mail válido.';
    if (phone && onlyDigits(phone).length < 10) e.phone = 'Telefone incompleto.';
    if (cpf && onlyDigits(cpf).length !== 11) e.cpf = 'CPF incompleto.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const r = updateProfile({ name: name.trim(), email, phone, cpf });
    if (!r.ok) return setErrors({ email: r.error });
    showToast('✓ Dados atualizados');
  };

  return (
    <Screen header={<Header title="Meus dados" />}>
      <Text color={BrandColors.inkSoft} style={{ marginBottom: 16 }}>Mantenha seus dados atualizados para facilitar suas compras.</Text>
      <Input label="Nome completo" value={name} onChangeText={setName} error={errors.name} autoCapitalize="words" />
      <Input label="E-mail" value={email} onChangeText={setEmail} error={errors.email} keyboardType="email-address" autoCapitalize="none" />
      <Input label="Telefone" value={phone} onChangeText={(t) => setPhone(maskPhone(t))} error={errors.phone} keyboardType="phone-pad" />
      <Input label="CPF" value={cpf} onChangeText={(t) => setCpf(maskCpf(t))} error={errors.cpf} keyboardType="number-pad" />
      <Button title="Salvar alterações" onPress={save} />
    </Screen>
  );
}
