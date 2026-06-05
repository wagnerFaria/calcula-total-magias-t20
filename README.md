# T20 Wizard Spell Comptroller (Contador de Magias para Magos T20)

Este módulo é um add-on para o sistema oficial de **Tormenta20 (T20)** no Foundry VTT, focado em automatizar e organizar o controle de magias para a classe **Arcanista (Mago)**.

## 🚀 O Problema que Resolve

No sistema Tormenta20, o Mago possui uma mecânica específica de preparação de magias:
1. Ele pode conhecer um número muito grande de magias (Grimório).
2. Ele precisa escolher quais dessas magias estarão preparadas para o dia.
3. **A Regra:** O limite de magias preparadas é igual a **metade do total de magias conhecidas** (arredondado para baixo).

O sistema padrão do Foundry VTT para T20 não faz essa contagem automática nem exibe um painel consolidado. Este módulo resolve isso injetando uma interface reativa que monitora:
- Total de magias conhecidas por Círculo (1º ao 5º).
- Total de magias preparadas atualmente.
- Cálculo automático do limite máximo permitido.
- Alerta visual caso o limite de preparação seja excedido.

## 🛠️ Como Gerar o Arquivo para Distribuição (.zip)

Se você estiver desenvolvendo ou quiser gerar o pacote manualmente para instalar em outro ambiente, o projeto já inclui um script automatizado que cria o ZIP no formato correto exigido pelo Foundry.

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado.

### Passo a Passo
1. Abra o terminal na raiz do projeto.
2. Instale as dependências (necessário apenas na primeira vez):
   ```bash
   npm install
   ```
3. Execute o script de empacotamento:
   ```bash
   npm run zip
   ```
O arquivo será gerado na raiz com o nome `calcula-total-magias-t20-1.0.0.zip`.

## 📦 Como Adicionar ao Foundry VTT

Existem duas formas principais de instalar este módulo:

### Opção 1: Instalação Manual (Para testes)
1. Baixe ou gere o arquivo `.zip`.
2. Extraia o conteúdo para a pasta de módulos do seu Foundry VTT:
   - **Caminho padrão:** `User Data/Data/modules/calcula-total-magias-t20`
   - *Nota: Certifique-se de que os arquivos (module.json, scripts, etc.) estejam diretamente dentro desta pasta.*
3. Reinicie o Foundry VTT.

### Opção 2: Via Manifesto (Recomendado)
1. No Foundry VTT, vá na aba **Add-on Modules**.
2. Clique em **Install Module**.
3. No campo **Manifest URL**, cole o link oficial:
   ```text
   https://github.com/wagnerFaria/calcula-total-magias-t20/releases/latest/download/module.json
   ```
4. Clique em **Install**.

## 📖 Como Usar

O painel de controle aparecerá **automaticamente** na ficha de qualquer personagem que:
1. Possua um item de classe com o nome **"Arcanista"**.
2. Tenha a subclasse/caminho configurado como **"Mago"** nas configurações da classe.

Ao abrir a aba de **Magias** da ficha, o novo painel "Controle de Magias (Mago)" estará visível no topo, atualizando-se instantaneamente conforme você marca ou desmarca a opção "Preparada" nas suas magias.

## 🧪 Desenvolvimento e Testes

O projeto utiliza **Jest** para garantir que os cálculos matemáticos sigam as regras do livro de T20.
Para rodar os testes:
```bash
npm test
```

---
**Autor:** Wagner Faria
**Compatibilidade:** Foundry VTT v11 e v12
**Sistema:** Tormenta20 (T20)
