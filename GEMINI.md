# AGENTS.md - T20 Wizard Spell Comptroller (Contador de Magias para Magos)

Este documento serve como guia de contexto, regras e especificações técnicas para agentes de IA e desenvolvedores que atuam no desenvolvimento deste módulo add-on para o Foundry VTT.

## 1. Visão Geral do Projeto
O objetivo deste módulo é estender a ficha de personagem (`ActorSheet`) do sistema oficial de **Tormenta20 (T20)** no Foundry VTT. O módulo deve monitorar, calcular e exibir painéis informativos de controle de magias especificamente para personagens da classe **Arcanista** com o caminho de **Mago**.

### Problema:
No livro básico de Tormenta20, o Mago precisa preparar suas magias diariamente e possui um limite de magias conhecidas expandido (através de grimório/estudo). O sistema padrão de T20 não faz o controle visual estrito de "Máximo Preparável vs. Preparadas Atual" e "Conhecidas por Círculo" em uma interface consolidada para o Mago.

---

## 2. Escopo do Módulo (Requisitos de Negócio)

Se o `Actor` possuir a classe **Arcanista** E o subtipo/caminho configurado como **Mago**, o módulo deve injetar um painel (ou aba/seção) na ficha para computar:

1. **Total de Magias Conhecidas:** Somatório bruto de todas as magias que o personagem possui na ficha, subdividido por Círculo de Magia (1º ao 5º círculo).
2. **Total de Magias Conhecidas Gerais:** Somatório absoluto de todas as magias na ficha.
3. **Magias Preparadas Atual:** Contagem de quantas magias estão marcadas como "preparadas" (utilizando a propriedade nativa de preparação de itens do Foundry) agrupadas por Círculo de Magia e o Total Geral.
4. **Limite Máximo de Magias Preparadas:** 
   * **Regra de T20:** O limite de magias que um mago pode preparar não é relacionado ao círculo/nível da magia, mas sim correspondente a **metade do total de magias conhecidas (arredondado para baixo)**. *Nota: O cálculo deve ser baseado no somatório total de magias na ficha.*

---

## 3. Arquitetura Técnica & Hooks do Foundry VTT

O desenvolvimento deve ser estritamente modular, agnóstico a modificações core e disparado via Hooks do Foundry.

### 3.1 Identificação do Alvo (Mago)
Para descobrir se o personagem se qualifica, o script deve inspecionar o objeto obtido através de `canvas.tokens.controlled[0].actor` (ou o argumento `sheet.actor` no hook de render):
* **Validação de Classe:** Iterar sobre `actor.items` filtrando por `item.type === "classe"` (ou o tipo equivalente do sistema T20). O item deve ter a propriedade de nome ou identificador correspondente a "Arcanista".
* **Validação de Subclasse:** Verificar dentro do objeto `system` desse item de classe se a propriedade de caminho/subclasse (ex: `system.subclasse` ou `system.caminho`) está definida como "Mago".

### 3.2 Varredura de Itens (Magias) e Atributos
As magias e atributos devem ser extraídos diretamente do modelo de dados do `actor`:
* **Atributo Inteligência:** O modificador de Inteligência necessário para o cálculo do limite máximo deve ser obtido através do caminho nativo do sistema (ex: `actor.system.atributos.int.mod` ou `actor.system.attributes.int.mod`). O agente de código deve inspecionar o objeto `actor.system` para confirmar se a nomenclatura está em português ou inglês.
* **Filtro de Magias:** O script deve iterar sobre `actor.items.filter(i => i.type === "magia" || i.type === "spell")`.
* **Dados da Magia:** Para cada magia encontrada, extrair:
  * O círculo/nível da magia: localizado em `item.system.circulo` ou `item.system.level`.
  * O estado de preparação: verificar a propriedade booleana responsável (ex: `item.system.preparada`, `item.system.prepared` ou dentro do objeto `flags` do item).

### 3.3 Injeção na Interface (UI)
* **Hook principal:** `renderActorSheet`
* **Ação:** Localizar o container da aba de Magias (`.tab.spells` ou equivalente na estrutura HTML da ficha de T20) e realizar o `append` / `prepend` de um template Handlebars (`.hbs`) contendo a tabela de controle.

### 3.4 Reatividade e Ciclo de Vida dos Dados (Crucial)
Os cálculos de magias conhecidas, preparadas e limites máximos devem ser reativos e atualizados em tempo real. O módulo não deve exigir que o usuário feche e abra a ficha novamente para ver os dados corretos.

Para garantir isso, o agente deve se apoiar no ciclo de renderização nativo do Foundry VTT:
* **Atualização de Estado (Preparar/Despreparar):** Quando o usuário clica para preparar ou desmarcar uma magia, o Foundry dispara internamente um `updateItem`. Isso modifica o documento do `Actor` e força nativamente o disparo do Hook `renderActorSheet`.
* **Criação e Deleção (Adicionar/Remover Magia):** Da mesma forma, os eventos de `createItem` e `deleteItem` alteram o array de itens do personagem, forçando uma nova renderização da ficha.
* **Regra de Implementação:** Toda a lógica de filtragem, agrupamento por círculo e soma matemática deve residir **dentro** do gatilho `renderActorSheet` (ou ser chamada por ele). Como o Foundry re-renderiza o HTML da ficha automaticamente a cada alteração de dados do personagem, colocar a lógica no fluxo de renderização garante que os totais sejam recalculados instantaneamente a cada clique de preparação ou modificação do grimório.
* **Prevenção de Loops:** O script de renderização deve apenas ler os dados atuais do `actor` e injetar o HTML atualizado no DOM. Ele **nunca** deve chamar métodos que alterem o banco de dados (como `actor.update()`) de forma síncrona dentro do render, o que causaria um loop infinito de renderização.

### 3.5 Protocolo de Inspeção de Dados (Data Paths)
Como o sistema de Tormenta20 pode sofrer atualizações na estrutura de dados de uma versão para outra, o desenvolvedor ou agente de IA deve obrigatoriamente inspecionar as seguintes propriedades no console do Foundry VTT (`F12`) usando um ator válido antes de consolidar a escrita do script:

1. **Estrutura de Atributos:** Verificar se o caminho do modificador de Inteligência está mapeado em `actor.system.atributos.int.mod` (Português) ou `actor.system.attributes.int.mod` (Inglês).
2. **Propriedades da Magia:** Filtrar um item de magia e inspecionar onde estão armazenados o círculo e o estado de preparação. 
   * *Comando de validação:* `canvas.tokens.controlled[0].actor.items.filter(i => i.type === "magia" || i.type === "spell")[0]`
   * *Campos a mapear:* Identificar se o círculo usa `.system.circulo` ou `.system.level`, e se a marcação de preparada usa `.system.preparada`, `.system.prepared` ou reside dentro de `.flags`.

---

## 4. Estrutura Estatística Esperada na UI

O componente injetado deve exibir uma tabela ou grid estruturada da seguinte forma:

| Círculo | Magias Conhecidas | Magias Preparadas | Limite Máximo Preparável | Status |
| :--- | :---: | :---: | :---: | :---: |
| **1º Círculo** | X | Y | Z | [OK / Limite Excedido] |
| **2º Círculo** | X | Y | Z | [OK / Limite Excedido] |
| **Geral / Total**| **Sum(X)** | **Sum(Y)** | **Sum(Z)** | |

---

## 5. Diretrizes para o Agente de Código (Instruções de IA)

Ao gerar código para este repositório, certifique-se de seguir as seguintes regras:

* **Compatibilidade:** O código deve utilizar ES6 Modules (`import/export`) e respeitar a API estável do Foundry VTT (v11/v12).
* **Performance:** A varredura de magias e cálculo de atributos deve ser cacheada ou disparada estritamente no render da ficha, evitando loops infinitos de re-renderização (`sheet.render()`) ao atualizar o estado de uma magia preparada.
* **I18n:** Todo texto visível na UI deve utilizar o sistema de localização do Foundry (`game.i18n.localize`), apontando para o arquivo `lang/pt-BR.json`.
* **Clean Code:** Separar a lógica de cálculo aritmético (Domain/Helper) da lógica de manipulação do DOM (View).
