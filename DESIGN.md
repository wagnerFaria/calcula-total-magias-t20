# DESIGN.md

Guia de identidade visual para o **T20 Wizard Spell Comptroller**, derivado das imagens de referência em [assets/img/](assets/img/) (capa oficial da caixa de Tormenta20, o "olho" símbolo da marca, e a wallpaper de artes do sistema). O objetivo é que o painel injetado na ficha do Mago pareça parte do material oficial de Tormenta20, e não um widget genérico cinza.

## 1. Paleta de Cores

Extraída por amostragem de pixel das três imagens de referência (predomínio de vermelho-sangue/carmesim sobre preto, com o âmbar/dourado do olho como cor de destaque, e um ciano mágico usado com moderação na wallpaper de artes).

| Token | Hex | Uso |
| --- | --- | --- |
| `--t20-black` | `#120404` | Fundo mais escuro, bordas externas do painel |
| `--t20-crimson-900` | `#4D0000` | Sombra / gradientes, fundo de header em hover |
| `--t20-crimson-700` | `#7A0C0C` | Vermelho primário — headers, bordas de destaque |
| `--t20-crimson-500` | `#A61C1C` | Vermelho de marca — títulos, ícones ativos |
| `--t20-crimson-400` | `#D0281B` | Vermelho vivo — **apenas** para estado de alerta (limite excedido) |
| `--t20-ember-500` | `#E8850F` | Âmbar/dourado (cor do olho) — destaques, contadores, foco |
| `--t20-ember-300` | `#F5A93F` | Âmbar claro — hover, ícones secundários |
| `--t20-parchment` | `#F5E6C8` | Texto sobre fundo escuro, contorno de título, estado "dentro do limite" |
| `--t20-arcane-cyan` | `#3FA8C4` | Acento mágico (usar com moderação) — ex.: badge de magia "Arcana" |
| `--t20-ink` | `#1C1010` | Texto sobre fundo claro/parchment |

**Regra de uso**: vermelho carmesim é a cor estrutural (bordas, headers, fundo). Âmbar é reservado para números/valores e estados positivos — ele é o elemento que "brilha" (como o olho). Ciano é um tempero raro, nunca a cor dominante de um componente inteiro.

### Escala de contraste (fundo Foundry claro vs. escuro)

A ficha padrão do sistema T20 no Foundry usa fundo claro (parchment/bege). O painel deve funcionar bem embutido nesse contexto:

- Fundo do painel: `--t20-parchment` ou branco translúcido, **não** preto sólido — o painel vive dentro da ficha, não é uma tela própria.
- Bordas e headers usam `--t20-crimson-700` / `--t20-crimson-500`.
- Texto de header sobre vermelho: `--t20-parchment` (nunca preto puro sobre vermelho escuro — falha de contraste).
- Números de destaque (conhecidas/preparadas/limite): `--t20-ember-500`, peso bold.

## 2. Estados semânticos

O painel já tem dois estados computados em [logic.js](module/scripts/logic.js) (`status: "ok" | "exceeded"`). Mapeamento de cor:

| Estado | Cor de fundo | Cor de texto/borda | Racional |
| --- | --- | --- | --- |
| `ok` / dentro do limite | `--t20-parchment` ou `--t20-ember-500` a 10% opacidade | `--t20-crimson-700` (texto), `--t20-ember-500` (borda) | Âmbar = "brilhando corretamente", sem precisar inventar um verde que não existe na marca |
| `exceeded` / limite excedido | `--t20-crimson-400` a 12% opacidade | `--t20-crimson-400` (texto e borda) | Vermelho vivo é reservado exclusivamente para este alerta — reforça urgência sem competir com o vermelho estrutural do painel |

Evitar verde/vermelho semáforo genérico (`#1b5e20` / `#b71c1c` atualmente em [module.css](module/styles/module.css)) — não pertence à paleta de Tormenta20 e reduz a identidade visual do módulo a um componente de formulário qualquer.

## 3. Tipografia e tom

- Títulos de seção (`spell-limit-header`, `items-header`) em **maiúsculas ou small-caps**, peso bold, para ecoar o logotipo "TORMENTA" da capa (letras largas, alto contraste, contorno).
- Números (conhecidas/preparadas/limite) em destaque tabular, tamanho maior que o rótulo — são o dado que o usuário busca primeiro.
- Manter a fonte padrão do sistema T20/Foundry (não importar fontes externas) — o módulo deve se misturar à ficha, a identidade vem da paleta de cor e bordas, não de uma fonte customizada.

## 4. Componentes do painel injetado

Mapeamento direto para as classes em [module/templates/spell-control.hbs](module/templates/spell-control.hbs) e [module/styles/module.css](module/styles/module.css):

- **`.t20-wizard-spell-control`** (container): borda `1px solid var(--t20-crimson-700)`, `border-radius` pequeno (4–6px, sem cantos totalmente retos — ecoa os ornamentos orgânicos da arte, mas sem exagerar), fundo `--t20-parchment` translúcido.
- **`.spell-limit-header`**: fundo `--t20-crimson-700`, texto `--t20-parchment`, número do limite em `--t20-ember-500` bold.
- **`.items-header`** (linha "Círculo / Conhecidas / Preparadas"): fundo `--t20-crimson-900`, texto `--t20-parchment` — substitui o atual `#333`/`#f0f0e0` genérico.
- **`.total-row`**: borda superior em `--t20-ember-500` (não cinza `#333`) para destacar o total como o dado mais importante da tabela.
- **`.status-message.within`**: ver tabela de estados acima (âmbar).
- **`.status-message.outside`**: ver tabela de estados acima (carmesim vivo).
- **`.type-summary`** (Arcana/Divina/Universal): cada linha pode receber um pequeno indicador lateral de cor — Arcana em `--t20-crimson-500`, Divina em `--t20-ember-500`, Universal em `--t20-arcane-cyan` — como uma sutil referência ao contraste vermelho/ciano visto na wallpaper de batalha (magia vs. caos).

## 5. O que evitar

- Não usar preto sólido (`#000`) como fundo de painel — a marca usa preto apenas como base para o vermelho "brilhar" por cima (efeito de brasa), não como superfície própria de UI.
- Não introduzir verde — não existe na identidade visual de Tormenta20 nas referências analisadas; para "estado positivo" usar âmbar/parchment, não verde de formulário.
- Não usar ciano como cor dominante — é um acento de baixa frequência (efeito mágico pontual na arte), não uma cor estrutural.
- Não adicionar gradientes, glows ou texturas pesadas imitando a arte da capa — o painel é um componente de dados dentro de uma ficha de personagem, precisa continuar legível e rápido de escanear; a referência visual deve influenciar cor e peso tipográfico, não densidade visual.

## 6. Próximos passos sugeridos

Este documento é a referência de design; a implementação (atualizar [module/styles/module.css](module/styles/module.css) para usar os tokens acima, idealmente como CSS custom properties em `:root` ou no seletor `.t20-wizard-spell-control`) é um passo separado e não foi aplicada automaticamente.
