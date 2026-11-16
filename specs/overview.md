---
name: bookora-product-overview
description: Oriente decisões de produto, interface e implementação da Bookora, SaaS de agendamentos. Use para preservar o escopo do MVP, os fluxos essenciais e as regras de negócio de alto nível.
---

# Bookora — visão geral do produto

## Uso

Use este documento antes de criar ou alterar funcionalidades do aplicativo. Ele define a intenção do produto e seus limites; use [api.md](api.md) para os contratos de rotas. Não introduza recursos fora deste escopo sem uma decisão explícita de produto.

## Propósito

Construa a Bookora, um SaaS para estabelecimentos de serviço receberem reservas por uma página pública personalizada e administrarem sua agenda por um painel privado.

Cada estabelecimento possui uma URL pública baseada em slug único, como `/salao-do-arthur`. A experiência deve substituir a troca manual de mensagens por uma reserva direta, com o menor número de etapas possível.

## Perfis e objetivos

### Cliente final

O cliente não cria conta e não faz login. Ele deve conseguir:

1. Abrir a página pública pelo slug.
2. Escolher um serviço.
3. Escolher um horário disponível.
4. Informar apenas nome e WhatsApp/telefone.
5. Confirmar e ver uma tela de sucesso com a reserva.

Não crie cadastro, perfil ou histórico independente de cliente. Nome e telefone existem somente no contexto de um agendamento. Não envie notificações automáticas neste MVP.

### Administrador do estabelecimento

O administrador usa uma conta individual, autenticada pelo provider configurado na aplicação, para operar um estabelecimento. O painel deve permitir administrar serviços, dados públicos, horário de funcionamento e agendamentos.

Se não houver assinatura ativa, direcione o administrador para a escolha de plano e pagamento antes de liberar a operação do estabelecimento.

## Módulo: página pública

Apresente nome, logo, descrição curta, endereço, telefone/WhatsApp, cor de destaque e os serviços do estabelecimento. Cada serviço deve exibir nome, preço e duração.

Mostre somente hoje e amanhã no calendário público. Bloqueie horários que já passaram no dia atual. Calcule a disponibilidade a partir de:

- dias e horários recorrentes de funcionamento;
- duração do serviço escolhido;
- agendamentos existentes que ainda ocupam a agenda.

Não implemente seleção de profissional, bloqueios avulsos, férias, feriados ou intervalos de almoço.

## Módulo: painel administrativo

Faça do calendário a experiência central do painel. Não inclua dashboard, relatórios ou métricas no MVP.

Permita que o administrador:

- visualize reservas no calendário;
- consulte os detalhes de uma reserva;
- cancele ou remarque uma reserva;
- cadastre, edite e remova serviços;
- edite nome, slug, logo, descrição, endereço, telefone/WhatsApp e cor de destaque;
- configure os dias e horários recorrentes de funcionamento.

Use os estados `confirmed`, `completed`, `cancelled` e `rescheduled`. O cancelamento deve liberar o horário para uma nova reserva pública.

## Módulo: assinatura e planos

Ofereça assinatura mensal recorrente com estes limites:

| Plano | Agendamentos por mês | Serviços cadastrados |
| ----- | -------------------: | -------------------: |
| Basic |            Até 1.000 |               Até 10 |
| Pro   |            Até 5.000 |           Ilimitados |

Ao atingir a franquia mensal, bloqueie novas reservas na página pública até a renovação ou mudança de plano. Mantenha agendamentos existentes acessíveis no painel.

Se o pagamento falhar ou a assinatura for cancelada, torne a página pública indisponível imediatamente.

## Invariantes de produto

- Todo serviço tem preço obrigatório em BRL e duração própria.
- Um slug público identifica um único estabelecimento.
- Dados de um estabelecimento não podem ser acessados por outro.
- Nunca permita reservas duplicadas ou sobrepostas.
- Use o fuso horário do estabelecimento para disponibilidade, bloqueio de horários passados e calendário.
- Conte a franquia do plano pelos agendamentos criados no período de cobrança; cancelar uma reserva não reduz o consumo.

## Limites explícitos do MVP

Não implemente, sem uma nova decisão de produto:

- login, cadastro ou histórico para clientes finais;
- seleção de profissionais ou equipes;
- múltiplos administradores por estabelecimento;
- notificações por WhatsApp, e-mail ou outro canal;
- bloqueios excepcionais de agenda;
- dashboard, métricas ou relatórios.
