# T20 Wizard Spell Comptroller

Este módulo estende a ficha de personagem do sistema oficial de **Tormenta20 (T20)** no Foundry VTT para personagens da classe **Arcanista** com o caminho de **Mago**.

## Funcionalidades

- **Controle de Magias Conhecidas:** Exibe o total de magias por círculo (1º ao 5º).
- **Controle de Magias Preparadas:** Contabiliza as magias marcadas como preparadas na ficha.
- **Cálculo Automático de Limite:** Calcula o limite máximo de magias preparáveis (metade do total de magias conhecidas, arredondado para baixo).
- **Status em Tempo Real:** Indica se o personagem está dentro do limite ou se o excedeu.
- **Interface Integrada:** Injeta um painel informativo diretamente na aba de Magias da ficha do ator.

## Instalação

1. No Foundry VTT, vá em **Add-on Modules** -> **Install Module**.
2. Cole o link do `module.json` deste repositório.
3. Ative o módulo no seu Mundo.

## Como Usar

O painel aparecerá automaticamente para qualquer personagem que:
1. Possua um item de classe chamado "Arcanista".
2. Tenha o caminho/subclasse configurado como "Mago".

## Requisitos de Sistema

- Foundry VTT v11 ou v12.
- Sistema Tormenta20 (T20) instalado.

## Desenvolvimento

Para rodar os testes de lógica:
```bash
npm install
npm test
```
