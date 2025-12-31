# 📝 DOCUMENTATION: Release v2.9.6 Engineering & Changelog

**Status:** 📋 Planejado (v2.9.6)
**Prioridade:** Alta (Release Blocker)
**Componentes:** `CHANGELOG.md`, `package.json`, `manifest.json`, `docs/`
**Tipo:** Documentation / Release

---

## 🔗 Relacionado

**ISSUE Pai:** [ISSUES_v2.9.6](./ISSUES-[013-016]-OPEN-v2.9.6.md)

Para garantir uma release "Madura e Profissional", a engenharia de release deve ser tão rigorosa quanto o código. Esta issue cobre a preparação final da versão v2.9.6.

---

## 📋 Problema Atual

### **Processo Manual de Release:**
- Risco de esquecer bump de versão em algum dos 3 arquivos de manifesto (`package.json`, `manifest.json`, `package-lock.json`).
- Changelogs incompletos ou não seguindo o padrão "Keep a Changelog".
- Falta de validação formal de que a documentação de arquitetura reflete o código atualizado.

## 📐 Padrões Arquiteturais Obrigatórios
Mesmo sendo uma issue de documentação, os scripts de release devem seguir:
- **[ADR 000-C: Padrão AAA](../../docs/architecture/ADR_000_C_AAA_TESTING_PATTERN.md)**: Caso sejam criados scripts de automação.

---

## ✅ Solução Proposta

### **Protocolo de Release v2.9.6:**
Executar um checklist estruturado de fechamento de versão, garantindo consistência semântica e documentação clara para o usuário final e desenvolvedores.

---

## 🛠️ Tarefas de Implementação

1.  **Changelog v2.9.6:**
    - Compilar todas as melhorias de cobertura (Issues 013-016).
    - Documentar refatorações técnicas.
    - Usar anotações convencionais (Added, Changed, Fixed, Security).

2.  **Version Bump Sincronizado:**
    - `package.json`: v2.9.6
    - `manifest.json`: v2.9.6
    - Garantir que não há regressão de versão.

3.  **Integridade da Documentação:**
    - [x] Atualizar `.github/README.md` com status v2.9.6 e Issues críticas.
    - [x] Atualizar `.github/ROADMAP.md` com marcos de qualidade da v2.9.6.
    - [ ] Validar existências de referências quebradas nos arquivos `docs/`.
    - [ ] Garantir que `VIS_MANIFESTO.md` e reports de cobertura estão atualizados.

---

## 🧪 Plano de Validação (Manual)

### **Checklist de Pré-Release:**
- [ ] `npm run build` gera artefato limpo com versão v2.9.6.
- [ ] `grep -r "2.9.5" .` não retorna ocorrências em arquivos de código (apenas logs antigos).
- [ ] Changelog renderiza corretamente markdown no GitHub/Viewer.

---

## ✅ Critérios de Sucesso

- [ ] Arquivos de manifesto sincronizados na versão 2.9.6.
- [ ] CHANGELOG.md atualizado detalhando o foco em "Quality Assurance & Test Coverage".
- [ ] Tag git v2.9.6 gerada após aprovação.

---

**Tags:** `//ISSUE-release-prep-v2.9.6` | **Tipo:** Documentation | **Versão:** 2.9.6
**Criado:** 2025-12-31 | **Autor:** Prof. Antigravity
