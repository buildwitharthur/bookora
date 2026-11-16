---
name: bookora-engineering-workflow
description: Governe toda tarefa no monorepo Bookora. Exige consulta prévia da documentação, implementação alinhada ao escopo e verificação completa de qualidade antes de concluir.
---

# Workflow de engenharia da Bookora

## Regra inegociável: documentação primeiro

Antes de iniciar **qualquer** tarefa — investigação, resposta técnica, criação ou alteração de código, configuração, dependência ou documentação — leia a documentação aplicável em `specs/`.

- Leia `specs/overview.md` para compreender escopo, fluxos e invariantes de produto.
- Leia `specs/api.md` sempre que a tarefa tocar a API, contratos HTTP, dados de domínio, autenticação ou regras de negócio.
- Leia `specs/tokens.md` sempre que a tarefa tocar interface, estilos, componentes ou experiência visual.
- Leia também os `README.md`, `AGENTS.md` e documentação local existentes no diretório afetado, quando houver.

Não suponha regras que a documentação já define. Se ela não cobrir uma decisão necessária, explicite a lacuna e peça orientação antes de ampliar o escopo do MVP.

## Implementação

- Preserve os limites e invariantes definidos em `specs/overview.md`.
- Para a API, siga estritamente os contratos, formatos de dados, códigos de erro e regras de concorrência em `specs/api.md`.
- Para interfaces, use apenas os tokens e a direção visual de `specs/tokens.md`.
- Mantenha as mudanças pequenas, focadas e compatíveis com a arquitetura existente.
- Não altere arquivos não relacionados nem reverta mudanças preexistentes do usuário.

## Qualidade obrigatória antes de concluir

Após toda alteração no monorepo, execute os comandos abaixo a partir da raiz. Não declare a tarefa concluída se algum deles falhar.

```sh
pnpm format:check
pnpm lint
pnpm check-types
pnpm build
```

Se a checagem de formatação falhar, corrija com `pnpm format`, revise o diff gerado e rode novamente toda a sequência de verificação. Se algum outro comando falhar, corrija a causa e repita a sequência completa até que todos passem.

Ao finalizar, informe de forma objetiva quais documentos foram consultados e o resultado de cada verificação. Se uma verificação não puder ser executada por limitação externa, explique o motivo e não a apresente como aprovada.
