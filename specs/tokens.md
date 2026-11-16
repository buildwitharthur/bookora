---
name: bookora-design-tokens
description: Aplique os tokens visuais da Bookora ao criar ou alterar interfaces públicas e administrativas. Preserve a hierarquia de cor, tipografia, espaçamento e estados de agendamento definidos neste documento.
---

# Tokens de design da Bookora

## Uso

Use somente tokens semânticos em componentes e telas; não introduza cores, espaçamentos, raios ou sombras arbitrários. A Bookora segue a direção accent-ladder: estrutura neutra e plana, com rosa-framboesa reservado a dados de agenda, estados ativos e no máximo uma ação de destaque por contexto.

O calendário é o elemento mais característico do produto. Ele carrega a cor de marca; navegação, tabelas e superfícies permanecem predominantemente neutras.

Não use gradientes, brilho, glassmorphism, sidebar escura em telas claras, ícones em caixas coloridas ou cards com sombra em repouso.

## Direção visual

- Direção: accent-ladder, seed 924980545.
- Interface administrativa clara, densa o suficiente para trabalho diário e com uma única família de destaque.
- Fundo neutro, painéis brancos e bordas discretas de 1px.
- Cor plena apenas em dados, reservas, foco e, quando necessário, uma ação.
- Títulos são objetivos; não use cabeçalhos de marketing em telas operacionais.

## Tipografia

Carregue DM Sans nos pesos 400, 500, 600 e 700. Use uma única família.

```css
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap");

:root {
  --font-sans: "DM Sans", system-ui, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --line-height-tight: 1.2;
  --line-height-normal: 1.45;
  --line-height-relaxed: 1.6;
}

.bookora-number {
  font-variant-numeric: tabular-nums;
}
```

Use título de tela entre 24px e 32px, título de seção em 18px e corpo em 14px. Não use rótulos em caixa alta com espaçamento entre letras. Preços, durações, contagens e valores do calendário usam algarismos tabulares.

## Cores

```css
:root {
  /* Estrutura neutra */
  --color-ground: #f9fafb;
  --color-surface: #ffffff;
  --color-surface-raised: #f3f4f6;
  --color-surface-active: #eeeeee;
  --color-surface-weekend: #f7f7f8;
  --color-border: #e5e7eb;
  --color-rule: #f2f2f2;
  --color-control-border: #d1d5db;
  --color-grid: #e5e5e5;
  --color-text: #111827;
  --color-text-muted: #5f6672;
  --color-text-faint: #6b7280;

  /* Marca: detalhe e dado principal */
  --color-brand-50: #fdf2f7;
  --color-brand-100: #fbe3ed;
  --color-brand-200: #f8dbe8;
  --color-brand-500: #b8336a;
  --color-brand-700: #6b1d3e;

  /* Semântica */
  --color-success: #247b50;
  --color-success-soft: #dcfce7;
  --color-success-ink: #14532d;
  --color-danger: #c4242a;
  --color-danger-soft: #ffedea;
  --color-danger-ink: #831c1e;
  --color-warning: #92400e;
  --color-warning-soft: #fffbeb;
  --color-warning-border: #fde68a;

  /* Funções */
  --background-page: var(--color-ground);
  --background-panel: var(--color-surface);
  --background-selected: var(--color-surface-active);
  --text-primary: var(--color-text);
  --text-secondary: var(--color-text-muted);
  --text-tertiary: var(--color-text-faint);
  --border-subtle: var(--color-border);
  --border-control: var(--color-control-border);

  --action-primary-bg: #1d1f20;
  --action-primary-text: #ffffff;
  --action-secondary-bg: #ffffff;
  --action-secondary-text: var(--color-text);
  --action-secondary-border: var(--color-control-border);
  --action-accent-bg: var(--color-brand-500);
  --action-accent-text: #ffffff;
  --focus-ring: var(--color-brand-500);
}
```

Texto deve atingir contraste mínimo de 4.5:1. Use a cor plena de marca em poucos elementos da tela; fundos de marca usam somente os tons 50, 100 ou 200.

## Espaçamento, dimensões e raios

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 2.5rem;
  --space-8: 3rem;
  --space-9: 4rem;

  --layout-gutter: var(--space-5);
  --panel-padding: var(--space-5);
  --section-gap: var(--space-6);
  --sidebar-width: 14.375rem;
  --control-height-sm: 2rem;
  --control-height-md: 2.5rem;
  --touch-target-min: 2.75rem;
  --nav-row-height: 2.125rem;
  --table-row-height: 3rem;

  --radius-control: 0.375rem;
  --radius-panel: 0.5rem;
  --radius-settings-panel: 1rem;
  --radius-pill: 999px;
}
```

Use base de 4px. O gutter de desktop é 24px e a margem móvel é 16px. Controles usam raio de 6px; painéis comuns, 8px; painéis de configurações, 16px.

## Superfícies e elevação

```css
:root {
  --border-width: 1px;
  --shadow-none: none;
  --shadow-overlay: 0 8px 24px rgb(17 24 39 / 8%);
  --shadow-dialog: 0 16px 40px rgb(17 24 39 / 12%);
}
```

Painéis usam superfície branca, fundo neutro e borda de 1px, sem sombra. Sombras são exclusivas de menus, popovers, tooltips, drawers e diálogos. Uma superfície usa borda ou sombra, nunca ambas.

## Estados de agendamento

```css
:root {
  --status-confirmed-bg: var(--color-brand-50);
  --status-confirmed-border: var(--color-brand-200);
  --status-confirmed-text: var(--color-brand-700);
  --status-completed-bg: var(--color-success-soft);
  --status-completed-border: #bcefd0;
  --status-completed-text: var(--color-success-ink);
  --status-cancelled-bg: var(--color-danger-soft);
  --status-cancelled-border: #f6c8c5;
  --status-cancelled-text: var(--color-danger-ink);
  --status-rescheduled-bg: var(--color-warning-soft);
  --status-rescheduled-border: var(--color-warning-border);
  --status-rescheduled-text: var(--color-warning);
  --status-neutral-bg: var(--color-surface-raised);
  --status-neutral-text: #374151;
}
```

Status são informação, não decoração: pills têm 16px a 24px, fundo claro e texto escuro da mesma família. Uma linha ou reserva exibe somente uma marca de status.

## Calendário

```css
:root {
  --calendar-header-bg: var(--color-surface);
  --calendar-grid-line: var(--color-grid);
  --calendar-time-text: var(--text-tertiary);
  --calendar-day-text: var(--text-secondary);
  --calendar-weekend-bg: var(--color-surface-weekend);
  --calendar-today-line: var(--color-brand-500);
  --calendar-today-bg: var(--color-brand-50);

  --calendar-event-confirmed-bg: var(--color-brand-100);
  --calendar-event-confirmed-border: var(--color-brand-500);
  --calendar-event-confirmed-text: var(--color-brand-700);
  --calendar-event-completed-bg: var(--color-success-soft);
  --calendar-event-cancelled-bg: var(--color-danger-soft);
  --calendar-event-rescheduled-bg: var(
    --color-warning-soft
  );

  --calendar-event-radius: 0.25rem;
  --calendar-event-min-height: 1.25rem;
  --calendar-event-max-height: 1.5rem;
  --calendar-hour-row: 3.75rem;
}
```

O dia atual recebe uma linha de 1px na cor de marca e fundo muito sutil. Reservas confirmadas usam contorno de marca, sem colorir a coluna inteira. Canceladas podem aparecer atenuadas no histórico administrativo, mas não ocupam disponibilidade pública.

## Interação e acessibilidade

```css
:root {
  --transition-fast: 120ms;
  --transition-base: 180ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;
}

:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto;
    transition-duration: 0.01ms;
    animation-duration: 0.01ms;
  }
}
```

Movimento serve apenas de retorno de interação. Não use animações de entrada em telas administrativas. Todo controle precisa de foco visível e alvo mínimo de 44px em celular.

## Aplicação por contexto

- Página pública: fundo claro e cor do estabelecimento em áreas permitidas pela personalização; não altere cores semânticas.
- Painel administrativo: fundo neutro, painéis brancos, ação primária quase preta; rosa apenas no calendário, dado principal e estados ativos.
- Formulários: campos de 40px, rótulo acima do campo e borda de controle. Placeholder não substitui rótulo.
- Listas: cabeçalhos de 12px em sentence case, sem zebra; números à direita e tabulares.
- Celular: sidebar vira barra superior de 48px com menu; margens de 16px; tabelas tornam-se linhas de duas camadas sem remover informação essencial.
