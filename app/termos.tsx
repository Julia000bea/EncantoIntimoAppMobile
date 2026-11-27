import { Fragment } from 'react';

import { Header } from '@/components/molecules/Header';
import { Screen } from '@/components/molecules/Screen';
import { Text } from '@/components/atoms/Text';
import { BrandColors } from '@/constants/brand';

const SECTIONS = [
  {
    title: 'Termos de uso',
    text: 'Ao usar o aplicativo Encanto Íntimo você concorda em fornecer dados verdadeiros e em usar o app apenas para compras pessoais. Os produtos, preços e prazos exibidos podem ser alterados pela loja.',
  },
  {
    title: 'Privacidade',
    text: 'Seus dados (nome, e-mail, telefone, CPF e endereços) são usados para identificar você e entregar seus pedidos. Não compartilhamos seus dados com terceiros sem sua autorização, exceto o necessário para pagamento e entrega.',
  },
  {
    title: 'Trocas e devoluções',
    text: 'Você pode solicitar a devolução em até 7 dias após o recebimento. Por higiene, a peça deve estar com etiqueta e sem uso. Em caso de defeito, a troca é feita sem custo.',
  },
  {
    title: 'Aviso',
    text: 'Esta é uma versão de demonstração do aplicativo: produtos, preços e pagamentos são fictícios e nenhum pedido é realmente entregue. Estes textos devem ser revisados pela loja antes da publicação.',
  },
];

export default function Termos() {
  return (
    <Screen header={<Header title="Termos e políticas" />}>
      {SECTIONS.map((s) => (
        <Fragment key={s.title}>
          <Text variant="heading" style={{ marginTop: 16, marginBottom: 6 }}>{s.title}</Text>
          <Text color={BrandColors.inkSoft}>{s.text}</Text>
        </Fragment>
      ))}
    </Screen>
  );
}
