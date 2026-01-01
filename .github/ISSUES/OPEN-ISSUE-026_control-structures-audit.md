# 📝 ISSUE-026: Framework de Auditoria Técnica - Código Intencional (Controle)

**Status:** 📋 Aberta
**Prioridade:** ⏺️ Média (Evolução de Processo)
**Componente:** `Governance`, `Engineering Standards`
**Versão:** v2.10.x

---

## 🎯 Objetivo

Institucionalizar um conjunto de perguntas objetivas e técnicas para análise de estruturas de controle (`if`, `try/catch`, `switch`) no Vanilla JS. 

**Prioridade 1 - Qualidade de Código (Intencionalidade):** Garantir que cada estrutura de controle exista por uma razão de negócio clara, legível e arquiteturalmente sólida.
**Prioridade 2 - Branch Coverage (Métrica):** Usar a métrica de ramificações como um *indicador* de onde a intencionalidade pode estar falhando (ex: um `else` esquecido ou não testado). A métrica serve à qualidade, não o contrário.

---

## 📖 Contexto

No desenvolvimento em Vanilla JS, a complexidade tende a se esconder em cadeias de `if/else` ou blocos `try/catch` genéricos. Para manter a **Screaming Architecture**, precisamos que nossas estruturas de controle expressem a intenção de negócio, não apenas a execução técnica.

Este framework será usado em:
1.  **Code Reviews (PRs)**: Como guia para revisores.
2.  **Refatorações**: Para simplificar módulos legados.
3.  **Desenvolvimento de Novas Features**: Para evitar dívida técnica precoce.

## 📊 Raio-X Atual (01/01/2026)

Contagem aproximada de estruturas de controle no codebase (excluindo libs externas):

| Estrutura | Produção (`.js`) | Testes (`.test.js`) | Observação |
|-----------|:----------------:|:-------------------:|------------|
| `if`      | **472**          | 73                  | Alta densidade. Foco principal de auditoria. |
| `else`    | **48**           | 4                   | Baixo número (Bom sinal: indica uso de *Early Return*). |
| `switch`  | **0**            | 0                   | Inexistente. |
| `? :`     | **70**           | 10                  | Ternários. Atenção para legibilidade. |

> *Dados coletados via análise estática (grep) ignorando `node_modules`, `coverage` e `.git`.*

### 📉 Baseline de Cobertura Global (01/01/2026)

| Métrica | % Atual | Meta Mínima | Status |
|---------|:-------:|:-----------:|--------|
| **Statements** | 84.99% | 85% | ⚠️ No Limite |
| **Branches** | **80.53%** | 85% | 🔴 Atenção (Intencionalidade) |
| **Functions** | 82.07% | 90% | 🟡 Melhorar |
| **Lines** | 84.99% | 85% | ⚠️ No Limite |

---

## 🛠️ O Framework: 10 Blocos de Auditoria

### 1. Intenção e Domínio
- Qual decisão de negócio este bloco representa? (Regra, Validação ou Proteção?)
- O que acontece se essa condição não existir?

### 2. Fluxo Binário e Alternativo (if/else) - *Branch Coverage*
- **Teste do Caminho Negativo:** Você testou explicitamente o `else`? (Muitos bugs moram aqui).
- A condição é realmente binária? Existe estado inválido não tratado?
- O `else` é necessário ou podemos usar *Early Return*?
- A condição é legível em voz alta?

### 3. Expressões Booleanas
- A expressão pode ser quebrada em partes nomeadas?
- Depende de coerção de tipo implícita?

### 4. Tratamento de Exceções (try/catch)
- É um erro real ou fluxo alternativo?
- O erro está sendo silenciado ou tratado com contexto suficiente?
- O sistema continua consistente após a falha?

### 5. Lançamento de Erros (throw)
- Quem é o responsável pela captura? A mensagem é compreensível fora do código?

### 6. Alternativas Múltiplas (switch/case)
- Todos os valores estão cobertos? O `default` é erro ou estado válido?
- Existe risco de *fallthrough*?

### 7. Consistência e Padrão
- O padrão é aplicado em todo o projeto ou é implícito?
- O código expressa intenção ou apenas execução?

### 8. Legibilidade em 30 Segundos
- Um dev novo entenderia sem contexto verbal?

### 9. Arquitetura Consciente
- Estamos acoplando regras de negócio com controle técnico?
- O controle pertence à borda ou ao núcleo?

### 10. Teste de Essencialidade
- Se removermos o bloco, qual comportamento essencial o sistema perde?

---

## ✅ Critérios de Aceite

- [ ] Incorporar este framework como um checklist oficial no documento `docs/PADROES.md`.
- [ ] Criar um roteiro de 30 minutos para mentorias/revisões técnicas baseado nessas perguntas.
- [ ] **Métrica:** Identificar e corrigir 3 arquivos com Branch Coverage < 70% usando este framework.
- [ ] Realizar uma auditoria de exemplo em um arquivo complexo (ex: `CourseService.js` ou `BatchScraper.js`).

---

**Tags:** `//ISSUE-intentional-code` | **Tipo:** Governance/Standard | **Sprint:** v2.10.0-Governance
**Relatada por:** IA do Projeto | **Data:** 01/01/2026
