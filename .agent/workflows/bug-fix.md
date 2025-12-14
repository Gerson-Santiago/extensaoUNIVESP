---
description: Fluxo para correção de bugs com foco em reprodução via teste e conformidade com Lint.
---

> [!WARNING]
> **Regra de Ouro:** Bug fix sem teste de regressão é gambiarra.

# 🕵️ Passo 1: Análise e Reprodução
@LINTING_RULES.md @FLUXOS_DE_TRABALHO.md

Analise o erro reportado pelo usuário.
- [ ] Crie um caso de teste em `tests/` que reproduza esse bug (o teste deve falhar inicialmente).
- [ ] Verifique se o erro viola alguma regra de `LINTING_RULES.md` (ex: acesso inseguro a DOM, tipagem fraca).

# 💻 Passo 2: Correção
Realize a correção no código fonte.
- [ ] Mantenha a modularização.
- [ ] Se for uma correção no `content.js` ou `background.js`, verifique se o contexto de execução (Isolated World) foi respeitado.

# 🧪 Passo 3: Verificação Dupla
// turbo
- [ ] Rode o teste criado no Passo 1 (agora deve passar).
- [ ] Rode `npm run lint`. O projeto tem política de "Zero Warnings". Se sua correção gerou um warning (ex: variável não usada), corrija.

# 🔄 Passo 4: Checagem de Alinhamento (Co-evolução)
Antes de finalizar, verifique:
- [ ] O bug fix veio acompanhado de uma alteração ou criação no arquivo de teste?
- [ ] Se você corrigiu o código mas não tocou nos testes, como você garante que o bug não volta? (O passo 1 exigiu teste, mas confirme aqui se ele está ativo e válido).

# 📝 Passo 5: Registro
@CHANGELOG.md
Registre a correção na seção "Fixed" da versão atual no `CHANGELOG.md`.

# 🛡️ Passo 6: Gate de Entrega (Manual)
**PARE AGORA.**
- [ ] Confirme se os testes automatizados passaram.
- [ ] **Sugestão de Commit**: Proponha uma mensagem de commit estritamente em **Português (PT-BR)** conforme `PADROES_DO_PROJETO.md` (ex: `fix: corrige validação de data`).
- [ ] **Nota:** O Husky validará automaticamente o lint ao commitar.
- [ ] Pergunte ao usuário: "Posso finalizar e commitar?"
- [ ] Só comite após o "Sim".