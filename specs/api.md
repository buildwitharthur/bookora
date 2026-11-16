---
name: bookora-api
description: Implemente ou altere rotas da Bookora usando contratos e regras organizadas por módulo. Exclui autenticação, gerenciada pelo provider.
---

# API da Bookora

## Uso

Use este documento para implementar rotas do domínio. Todas são relativas à raiz e não usam versionamento no caminho: use `/services`. O provider fornece a sessão de rotas privadas; não implemente nem documente login, OAuth, link mágico ou sessão.

Nas rotas privadas, obtenha o estabelecimento da sessão autenticada; nunca aceite `establishmentId` do cliente. Use JSON com `camelCase`, datas `YYYY-MM-DD`, horários locais `HH:mm`, timestamps ISO 8601 UTC e valores em BRL como inteiros em centavos (`priceCents`). Use sempre o fuso IANA do estabelecimento para interpretar datas e horários.

Erros seguem:

```json
{
  "error": {
    "code": "SLOT_UNAVAILABLE",
    "message": "O horário selecionado não está mais disponível.",
    "details": []
  }
}
```

Use: `401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 NOT_FOUND`, `409 CONFLICT`, `422 VALIDATION_ERROR`, `423 ESTABLISHMENT_UNAVAILABLE` e `402 SUBSCRIPTION_REQUIRED`. Códigos específicos: `SLUG_UNAVAILABLE`, `PLAN_LIMIT_REACHED`, `SLOT_UNAVAILABLE` e `BOOKING_DATE_OUT_OF_RANGE`.

## Módulo: assinatura e planos

Este módulo expõe limites e inicia a cobrança recorrente. O gateway concreto fica atrás destas rotas.

### `GET /plans`

```json
{
  "data": [
    {
      "code": "basic",
      "name": "Basic",
      "monthlyAppointmentLimit": 1000,
      "serviceLimit": 10
    },
    {
      "code": "pro",
      "name": "Pro",
      "monthlyAppointmentLimit": 5000,
      "serviceLimit": null
    }
  ]
}
```

`serviceLimit: null` significa ilimitado.

### `POST /billing/checkout-sessions`

Exige sessão. Corpo:

```json
{
  "planCode": "basic",
  "successUrl": "https://app.exemplo.com/onboarding/sucesso",
  "cancelUrl": "https://app.exemplo.com/planos"
}
```

Retorne `201 Created`: `{ "checkoutUrl": "https://provedor-pagamento.com/checkout/..." }`.

### `GET /billing/subscription`

Exige sessão. Retorne `status`, `planCode`, `currentPeriodStart`, `currentPeriodEnd`, `appointmentsUsed` e `appointmentLimit`.

### `POST /webhooks/billing`

Receba eventos assinados do provedor e valide sua assinatura. Falha de pagamento ou cancelamento torna a página pública indisponível imediatamente.

## Módulo: estabelecimento e funcionamento

Use para identidade pública e agenda recorrente. Exige sessão. O perfil pode ser alterado no onboarding; horários exigem assinatura ativa.

### `GET /establishment` e `PUT /establishment`

```json
{
  "name": "Salão do Arthur",
  "slug": "salao-do-arthur",
  "logoUrl": "https://.../logo.png",
  "description": "Cortes e cuidados masculinos.",
  "address": "Rua Exemplo, 100 — São Paulo/SP",
  "phone": "+5511999999999",
  "accentColor": "#5B2EFF",
  "timezone": "America/Sao_Paulo"
}
```

Retorne `200 OK` com o recurso, incluindo `id`. Logo, descrição, endereço e telefone podem ser nulos. Se o slug estiver em uso, retorne `409 SLUG_UNAVAILABLE`.

### `GET /establishment/business-hours` e `PUT /establishment/business-hours`

```json
{
  "days": [
    {
      "weekday": 1,
      "isOpen": true,
      "startTime": "09:00",
      "endTime": "18:00"
    },
    {
      "weekday": 2,
      "isOpen": true,
      "startTime": "09:00",
      "endTime": "18:00"
    },
    {
      "weekday": 3,
      "isOpen": true,
      "startTime": "09:00",
      "endTime": "18:00"
    },
    {
      "weekday": 4,
      "isOpen": true,
      "startTime": "09:00",
      "endTime": "18:00"
    },
    {
      "weekday": 5,
      "isOpen": true,
      "startTime": "09:00",
      "endTime": "18:00"
    },
    {
      "weekday": 6,
      "isOpen": true,
      "startTime": "09:00",
      "endTime": "14:00"
    },
    {
      "weekday": 0,
      "isOpen": false,
      "startTime": null,
      "endTime": null
    }
  ]
}
```

`0` é domingo e `6` é sábado. Não implemente intervalos, feriados ou bloqueios avulsos.

## Módulo: serviços

Todas as rotas exigem sessão e assinatura ativa.

| Método   | Rota                    | Ação              |
| -------- | ----------------------- | ----------------- |
| `GET`    | `/services`             | Lista serviços.   |
| `POST`   | `/services`             | Cria serviço.     |
| `GET`    | `/services/{serviceId}` | Busca serviço.    |
| `PUT`    | `/services/{serviceId}` | Atualiza serviço. |
| `DELETE` | `/services/{serviceId}` | Remove serviço.   |

```json
{
  "name": "Corte masculino",
  "priceCents": 8000,
  "durationMinutes": 45
}
```

Nome, preço e duração são obrigatórios. Criação retorna `201`; leitura e edição, `200`; remoção, `204`. Retorne `403 PLAN_LIMIT_REACHED` se exceder o limite. A remoção não altera o retrato do serviço em reservas existentes.

## Módulo: agenda administrativa

Todas as rotas exigem sessão e assinatura ativa.

### Modelo de agendamento

```json
{
  "id": "apt_01J...",
  "service": {
    "id": "srv_01J...",
    "name": "Corte masculino",
    "priceCents": 8000,
    "durationMinutes": 45
  },
  "customerName": "Maria Silva",
  "customerPhone": "+5511999999999",
  "date": "2026-11-17",
  "startTime": "14:00",
  "endTime": "14:45",
  "status": "confirmed",
  "createdAt": "2026-11-16T14:01:12Z",
  "updatedAt": "2026-11-16T14:01:12Z"
}
```

Preserve os dados do serviço como retrato da reserva. Status: `confirmed`, `completed`, `cancelled`, `rescheduled`.

### `GET /appointments?from={date}&to={date}`

Liste os itens do calendário. `from` e `to` são obrigatórios, inclusivos e usam o fuso do estabelecimento. Retorne `{ "data": [] }`.

### `GET /appointments/{appointmentId}`

Retorne o agendamento, com `200 OK`.

### `PATCH /appointments/{appointmentId}/status`

```json
{
  "status": "completed"
}
```

Aceite apenas `completed` ou `cancelled`. Cancelamento libera o intervalo ao público.

### `POST /appointments/{appointmentId}/reschedule`

```json
{
  "date": "2026-11-17",
  "startTime": "15:00"
}
```

Valide funcionamento, duração e conflitos. Atualize data e hora, marque `rescheduled` e retorne `200`. Se indisponível, retorne `409 SLOT_UNAVAILABLE`. Não consuma nova unidade da franquia.

## Módulo: agendamento público

Use somente na página do slug. Não exige autenticação de cliente e não retorna dados privados.

### `GET /public/establishments/{slug}`

Retorne informações públicas e serviços:

```json
{
  "establishment": {
    "name": "Salão do Arthur",
    "slug": "salao-do-arthur",
    "logoUrl": "https://.../logo.png",
    "description": "Cortes e cuidados masculinos.",
    "address": "Rua Exemplo, 100 — São Paulo/SP",
    "phone": "+5511999999999",
    "accentColor": "#5B2EFF",
    "timezone": "America/Sao_Paulo"
  },
  "services": [
    {
      "id": "srv_01J...",
      "name": "Corte masculino",
      "priceCents": 8000,
      "durationMinutes": 45
    }
  ]
}
```

Se não houver assinatura ativa, retorne `423 ESTABLISHMENT_UNAVAILABLE`.

### `GET /public/establishments/{slug}/availability?serviceId={serviceId}&date={date}`

```json
{
  "date": "2026-11-17",
  "timezone": "America/Sao_Paulo",
  "slots": [
    {
      "startTime": "09:00",
      "endTime": "09:45"
    }
  ]
}
```

Aceite somente hoje ou amanhã no fuso do estabelecimento. Não retorne horários passados. Fora desta janela, retorne `422 BOOKING_DATE_OUT_OF_RANGE`.

### `POST /public/establishments/{slug}/appointments`

```json
{
  "serviceId": "srv_01J...",
  "date": "2026-11-17",
  "startTime": "14:00",
  "customerName": "Maria Silva",
  "customerPhone": "+5511999999999"
}
```

Retorne `201 Created` com `id`, `serviceName`, `priceCents`, `date`, `startTime`, `endTime` e `status: "confirmed"`. Valide e reserve o intervalo na mesma operação atômica; não confie apenas na disponibilidade exibida. Use `409 SLOT_UNAVAILABLE`, `403 PLAN_LIMIT_REACHED` ou `423 ESTABLISHMENT_UNAVAILABLE` conforme necessário.

## Invariantes entre módulos

- Basic: até 1.000 agendamentos mensais e 10 serviços. Pro: até 5.000 agendamentos mensais e serviços ilimitados.
- Conte a franquia por agendamentos criados no período de cobrança; cancelamento não reduz o consumo.
- Ao esgotar a franquia, mantenha calendário e reservas privadas acessíveis, mas bloqueie novas reservas públicas.
- Agendamentos não cancelados não podem sobrepor intervalos. Garanta isso atomicamente no banco.
- Assinatura inativa torna toda a página pública indisponível.
