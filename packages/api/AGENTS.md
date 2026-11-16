---
name: bookora-api-feature-workflow
description: Oriente a criação e alteração de funcionalidades da API Bookora, preservando contratos HTTP, isolamento por estabelecimento e a arquitetura Fastify, Zod e Prisma.
---

# Desenvolvimento de features na API Bookora

Use este manual para implementar ou alterar features em `packages/api`.

## Antes de implementar

1. Leia `specs/overview.md` e `specs/api.md` na raiz. Eles definem o escopo do MVP, contratos, formatos, erros e invariantes.
2. Leia os `AGENTS.md` aplicáveis e inspecione o módulo mais próximo antes de criar uma nova abstração.
3. Mantenha a mudança limitada ao comportamento solicitado. Se as especificações não definirem uma decisão de produto, não a invente.

## Forma de um módulo

Agrupe código de domínio em `features/<módulo>`. Use a separação abaixo apenas quando a responsabilidade existir:

- **routes** compõem controllers e recebem o prefixo no agregador de rotas.
- **controllers** são a fronteira HTTP: declaram schemas, leem request, chamam um use case e serializam a resposta.
- **schemas** usam Zod para corpo, parâmetros, query e respostas; exporte os tipos inferidos quando forem insumo do domínio.
- **usecases** contêm regras, consultas e mutações do domínio; não dependem de Fastify ou de `reply`.

O módulo `services` é o exemplo de um CRUD privado: a rota compõe seus controllers, os controllers transformam HTTP em input, e os use cases usam Prisma e retornam dados do domínio. Use-o como referência de direção, não como uma estrutura obrigatória para todo módulo.

## Rotas e contratos

- As rotas de domínio são relativas à raiz e não usam versão no caminho.
- Registre prefixos no agregador; mantenha rotas internas ao módulo relativas ao seu prefixo.
- Use o type provider Zod e declare schemas de request e de cada resposta de sucesso.
- Preserve JSON em `camelCase`, valores monetários em centavos e os formatos de data/hora definidos em `specs/api.md`.
- Converta `Date` para ISO 8601 ao serializar timestamps. Interprete datas e horários locais sempre no fuso IANA do estabelecimento.

## Autenticação e isolamento do painel

Rotas privadas do painel devem depender da autenticação e, exceto no onboarding de criação, do estabelecimento do usuário autenticado.

- A autenticação disponibiliza apenas o identificador do usuário na request.
- O escopo do painel resolve o estabelecimento pelo proprietário autenticado e disponibiliza seu identificador na request.
- Nunca aceite `establishmentId` do cliente em rotas privadas.
- Toda leitura, edição e remoção de recurso pertencente ao estabelecimento deve ser filtrada pelo identificador de escopo. Para recursos acessados por ID, trate recursos de outro estabelecimento como não acessíveis e não permita que o ID sozinho determine o escopo.
- A criação do estabelecimento requer autenticação, mas não pode exigir que o estabelecimento já exista.

Rotas públicas não usam sessão de cliente e só podem expor dados definidos como públicos nas especificações.

## Banco e regras de erro

- Reutilize o cliente Prisma compartilhado; não crie clientes por controller ou use case.
- Ao alterar o schema, gere uma migration Prisma, regenere o client e revise o SQL antes de seguir.
- Use `BaseError` para falhas esperadas de domínio e aplique os status e códigos de `specs/api.md`. Não use erros genéricos para conflitos, validações, ausência de autenticação ou recursos inacessíveis.
- Garanta invariantes concorrentes no banco ou em transações apropriadas; disponibilidade exibida ao cliente nunca é garantia suficiente para uma mutação.

## Conclusão

Após qualquer alteração, a partir da raiz execute:

```sh
pnpm format:check
pnpm lint
pnpm check-types
pnpm build
```

Se a formatação falhar, rode `pnpm format`, revise o diff e repita toda a sequência. Reporte os documentos consultados e o resultado de cada verificação.
