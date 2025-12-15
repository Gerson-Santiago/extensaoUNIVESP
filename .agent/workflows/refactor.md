---
description: Refatora código existente para melhorar a legibilidade, modularização e adequação aos padrões do projeto.
---

---
description: Refatora código existente para melhorar a legibilidade, modularização e adequação aos padrões do projeto.
---

> [!WARNING]
> **Safety First:** Sem testes prévios, sem refatoração.

# 🛡️ Passo 0: Auditoria de Cobertura (Safety First)
@tests/
Antes de tocar no código, verifique se existem testes cobrindo a funcionalidade que você vai refatorar.
- [ ] Se NÃO houver testes: **Pare**. Crie testes que passem com o código atual (Snapshot/Pinning Tests). Isso garante que você saberá se quebrar o comportamento atual.
- [ ] Se houver testes: Execute-os para garantir que estão passando (Green).

# 🕵️ Passo 1: Análise de Conformidade
@docs/PADROES_DO_PROJETO.md @docs/LINTING_RULES.md

Leia o arquivo alvo e identifique:
- [ ] Funções muito longas que podem ser extraídas para `shared/utils` ou `sidepanel/logic`.
- [ ] Lógica de negócios misturada dentro de arquivos de View (`.js` de UI).
- [ ] Violações de "Type Safety" (ex: uso de `any` implícito ou falta de checagem de `null`).

# 💻 Passo 2: Reestruturação Segura
- [ ] Proponha a nova estrutura de arquivos (se necessário criar novos módulos).
- [ ] Faça as alterações de código mantendo a funcionalidade original.
- [ ] Certifique-se de usar JSDoc para documentar novas funções.

# 🧪 Passo 3: Garantia de Qualidade
@tests/
// turbo
- [ ] Execute `npm test` para garantir que a refatoração não quebrou nada (Regressão).
- [ ] Execute `npm run lint` para garantir que o novo código está limpo.

# 🔄 Passo 4: Checagem de Alinhamento (Co-evolução)
Embora refatoração idealmente não mude comportamento externo, verifique:
- [ ] Se você precisou alterar a implementação interna de forma drástica, os testes unitários ainda fazem sentido?
- [ ] Garanta que os testes continuam cobrindo a lógica real e não ficaram obsoletos (testando coisas que não existem mais ou ignorando a nova estrutura).

# 🛡️ Passo 5: Gate de Entrega e Arquitetura
- [ ] Se a refatoração mudou "quais arquivos chamam quais", atualize o diagrama em `docs/TECNOLOGIAS_E_ARQUITETURA.md`.
- [ ] **Sugestão de Commit**: Proponha uma mensagem de commit estritamente em **Português (PT-BR)** conforme `docs/PADROES_DO_PROJETO.md` (ex: `refactor: extrai lógica de validação`).
- [ ] **Nota:** O Husky rodará o lint/format automaticamente.
- [ ] **PARE E PERGUNTE**: "Refatoração concluída e validada. Posso commitar?"
- [ ] Só prossiga com autorização.