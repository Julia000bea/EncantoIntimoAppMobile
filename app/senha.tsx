import { router } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Header } from '@/components/molecules/Header';
import { Screen } from '@/components/molecules/Screen';
import { useApp } from '@/store/AppContext';

/** Alterar senha. */
export default function Senha() {
  const { changePassword, showToast } = useApp();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const save = () => {
    const e: Record<string, string> = {};
    if (!current) e.current = 'Informe a senha atual.';
    if (next.length < 6) e.next = 'A nova senha deve ter pelo menos 6 caracteres.';
    if (confirm !== next) e.confirm = 'As senhas não conferem.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const r = changePassword(current, next);
    if (!r.ok) return setErrors({ current: r.error });
    showToast('✓ Senha alterada');
    router.back();
  };

  return (
    <Screen header={<Header title="Alterar senha" />}>
      <Input label="Senha atual" value={current} onChangeText={setCurrent} error={errors.current} secureTextEntry autoCapitalize="none" />
      <Input label="Nova senha" value={next} onChangeText={setNext} error={errors.next} secureTextEntry autoCapitalize="none" />
      <Input label="Confirmar nova senha" value={confirm} onChangeText={setConfirm} error={errors.confirm} secureTextEntry autoCapitalize="none" />
      <Button title="Alterar senha" onPress={save} />
    </Screen>
  );
}
