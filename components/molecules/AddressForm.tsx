import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { lookupCep } from '@/services/api';
import type { Address } from '@/types';
import { maskCep, onlyDigits } from '@/utils/format';

type Values = Omit<Address, 'id' | 'isMain'>;

const EMPTY: Values = { recipient: '', zip: '', street: '', number: '', complement: '', district: '', city: '', state: '' };

type Props = {
  initial?: Address;
  submitLabel?: string;
  onSubmit: (v: Values) => void;
  defaultRecipient?: string;
};

export function AddressForm({ initial, submitLabel = 'Salvar endereço', onSubmit, defaultRecipient }: Props) {
  const [v, setV] = useState<Values>(initial ? { ...initial } : { ...EMPTY, recipient: defaultRecipient ?? '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});

  const set = (k: keyof Values) => (t: string) => setV((s) => ({ ...s, [k]: t }));

  const onCep = async (t: string) => {
    const masked = maskCep(t);
    setV((s) => ({ ...s, zip: masked }));
    if (onlyDigits(masked).length === 8) {
      const r = await lookupCep(onlyDigits(masked));
      if (r) setV((s) => ({ ...s, street: s.street || r.street, district: s.district || r.district, city: r.city, state: r.state }));
    }
  };

  const submit = () => {
    const e: typeof errors = {};
    if (!v.recipient.trim()) e.recipient = 'Informe o nome de quem vai receber.';
    if (onlyDigits(v.zip).length !== 8) e.zip = 'CEP inválido.';
    if (!v.street.trim()) e.street = 'Informe a rua.';
    if (!v.number.trim()) e.number = 'Informe o número.';
    if (!v.district.trim()) e.district = 'Informe o bairro.';
    if (!v.city.trim()) e.city = 'Informe a cidade.';
    if (v.state.trim().length !== 2) e.state = 'Use a sigla (ex.: SC).';
    setErrors(e);
    if (Object.keys(e).length === 0) onSubmit({ ...v, state: v.state.toUpperCase(), zip: maskCep(v.zip) });
  };

  return (
    <View>
      <Input label="Nome de quem recebe" value={v.recipient} onChangeText={set('recipient')} error={errors.recipient} autoCapitalize="words" />
      <Input label="CEP" value={v.zip} onChangeText={onCep} error={errors.zip} keyboardType="number-pad" placeholder="00000-000" />
      <Input label="Rua" value={v.street} onChangeText={set('street')} error={errors.street} autoCapitalize="words" />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Input label="Número" value={v.number} onChangeText={set('number')} error={errors.number} keyboardType="number-pad" />
        </View>
        <View style={{ flex: 2 }}>
          <Input label="Complemento" value={v.complement ?? ''} onChangeText={set('complement')} placeholder="Opcional" />
        </View>
      </View>
      <Input label="Bairro" value={v.district} onChangeText={set('district')} error={errors.district} autoCapitalize="words" />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 3 }}>
          <Input label="Cidade" value={v.city} onChangeText={set('city')} error={errors.city} autoCapitalize="words" />
        </View>
        <View style={{ flex: 1 }}>
          <Input label="UF" value={v.state} onChangeText={(t) => set('state')(t.slice(0, 2))} error={errors.state} autoCapitalize="characters" maxLength={2} />
        </View>
      </View>
      <Button title={submitLabel} onPress={submit} style={{ marginTop: 8 }} />
    </View>
  );
}
