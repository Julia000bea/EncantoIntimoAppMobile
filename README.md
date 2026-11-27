# Encanto Íntimo — aplicativo mobile

Aplicativo de compras da loja de lingerie **Encanto Íntimo**, feito com **React Native + Expo (Expo Router) + TypeScript**. Funciona em Android, iOS e web a partir do mesmo código.

> **Versão de demonstração.** Os produtos, preços, estoque e o pagamento são **fictícios**. Nenhuma cobrança é feita e nenhum pedido é entregue. Veja "Do protótipo à loja real" abaixo.

## Como rodar

Requisitos: Node 20 ou superior e o app **Expo Go** no celular (ou um emulador).

```bash
npm install
npx expo start
```

- Celular: leia o QR code com o Expo Go.
- Navegador: pressione `w` no terminal (ou `npm run web`).
- Android/iOS em emulador: `npm run android` / `npm run ios`.

Verificações: `npm run typecheck` (TypeScript) e `npm run lint`.

## O que o app tem (21 telas do protótipo)

| Fluxo | Telas |
|---|---|
| Entrada | Splash, Boas-vindas, Login, Cadastro |
| Descoberta | Início, Categorias, Busca (histórico, filtros, ordenação), Lista de produtos |
| Produto | Detalhes (galeria com deslize, tamanho, cor, quantidade, favoritar, compartilhar, entrega e trocas) |
| Compra | Favoritos, Carrinho (subtotal, desconto, frete, total), Identificação, Endereço, Pagamento, Pedido confirmado |
| Conta | Minha conta, Meus pedidos, Detalhes do pedido (linha do tempo), Meus dados, Endereços, Alterar senha, Notificações, Termos |

Navegação inferior: Início, Buscar, Categorias, Carrinho (com contador) e Conta.

Estados tratados: carregamento (skeleton), lista vazia, carrinho vazio, sem favoritos, nenhum resultado, erro de carregamento com "tentar novamente", validação de formulários.

## Estrutura

```
app/            rotas (Expo Router): (tabs)/, product/, category/, checkout/, pedidos/ ...
components/
  atoms/        Text, Button, Input, Price, Badge, Chip
  molecules/    ProductCard, CategoryCard, CartItem, OrderCard, SearchBar, EmptyState,
                LoadingState, ProductGallery, QuantitySelector, Header, FilterSheet ...
store/          AppContext: carrinho, favoritos, login, pedidos, endereços (salvos no aparelho)
services/       api.ts: acesso aos dados (hoje lê o catálogo de demonstração)
data/           products.ts: catálogo de demonstração
constants/      brand.ts: cores, fontes e medidas da marca
utils/          formatação, máscaras e filtros
```

Identidade visual: paleta creme/rosé/nude, fontes Fraunces (títulos) e Work Sans (textos), cartões arredondados e botões em pílula.

## Regras de negócio da demonstração

- Frete de R$ 15,00; **grátis** a partir de R$ 299,00 (valores editáveis em `store/AppContext.tsx`).
- Desconto = diferença entre o preço "de" e o preço "por" dos produtos em promoção.
- Pedidos começam em "Pedido realizado". O botão "Avançar etapa (demonstração)" simula o andamento; na loja real o status virá do sistema de pedidos.
- O primeiro pedido recebe o número #000123.

## Do protótipo à loja real

1. **Catálogo:** troque `data/products.ts` pelos produtos reais. Para fotos, preencha `imageUrl` e `images` de cada produto (hoje aparece um espaço colorido no lugar da foto).
2. **API:** reescreva as funções de `services/api.ts` com `fetch` para o seu servidor e leve também login, pedidos e endereços para lá. Hoje tudo fica salvo no próprio aparelho (AsyncStorage).
3. **Login seguro:** neste protótipo a conta existe só no aparelho e a senha é guardada com um hash simples. Em produção a autenticação precisa ficar em um servidor.
4. **Pagamento:** integre um provedor (ex.: Mercado Pago, Pagar.me ou Stripe). O app nunca deve guardar dados de cartão; a tela atual só valida o formato dos campos.
5. **Textos legais:** os termos e a política de trocas em `app/termos.tsx` são exemplos e devem ser revisados pela loja.
6. **Publicação:** use o EAS Build (`npx eas build`) para gerar os apps das lojas. Ajuste o identificador em `app.json` (`br.com.encantointimo.app`) se necessário.

## Observações

- A consulta de CEP usa a API pública ViaCEP; sem internet, o endereço é preenchido manualmente.
- Testado no navegador (build web) e com TypeScript/ESLint sem erros. Ainda não foi testado em aparelhos físicos.
