# EPIC 5: Documentação e Conhecimento

**Status**: 📚 Em Progresso  
**Prioridade**: Baixa  
**Owner**: Equipe de Engenharia  

---

## 🎯 Objetivo

Melhorar **base de conhecimento técnico** do projeto, facilitando onboarding de novos desenvolvedores e manutenção a longo prazo.

---

## 📋 Escopo

### Problema

Falta documentação técnica sobre:
- Chrome Extension APIs usadas
- Decisões arquiteturais
- Padrões de código

**Consequências**:
- ❌ Curva de aprendizado alta para novos devs
- ❌ Dúvidas recorrentes sobre APIs nativas
- ❌ Contexto perdido em decisões técnicas

---

## 🗂️ Issues Incluídas

### 1. [NEXT-doc-chrome-tabs-api.md](file:///home/sant/extensaoUNIVESP/.github/NEXT/NEXT-doc-chrome-tabs-api.md)

**Objetivo**: Documentar uso da Chrome Tabs API

**Conteúdo**:
- Explicação de `chrome.tabs.query`
- Explicação de `chrome.tabs.update`
- Explicação de `chrome.tabs.create`
- Explicação de `chrome.scripting.executeScript`
- Exemplos práticos do projeto
- Permissões necessárias
- Dicas de debugging

**Arquivo a criar**: `docs/CHROME_TABS_API.md`

**Impacto**: 0 LOC (apenas .md)  
**Estimativa**: 2-3 horas

---

### Futuras (Planejadas)

#### 2. Documentação de Decisões Arquiteturais (ADR)

Documentar decisões importantes:
- Por que Vanilla JS em vez de framework?
- Por que Side Panel em vez de Popup?
- Por que Local-First storage?

**Formato**: Architecture Decision Records (ADR)  
**Localização**: `docs/adr/`

---

#### 3. Guia de Contribuição

**Arquivo**: `CONTRIBUTING.md`

Conteúdo:
- Como fazer setup
- Como rodar testes
- Como submeter PR
- Code review guidelines

---

## 🎁 Benefícios

- 📚 **Onboarding rápido**: Novos devs produtivos em dias, não semanas
- 🧠 **Contexto preservado**: Decisões documentadas
- 🤝 **Open Source friendly**: Facilita contribuições externas
- 🔧 **Manutenibilidade**: Menos "tribal knowledge"

---

## ✅ Critérios de Aceitação

### NEXT-doc-chrome-tabs-api
- [ ] `docs/CHROME_TABS_API.md` criado
- [ ] Todos métodos usados documentados
- [ ] Exemplos práticos incluídos
- [ ] Permissões explicadas
- [ ] Links para docs oficiais

### ADRs (Futuro)
- [ ] Template ADR criado
- [ ] 3+ decisões documentadas
- [ ] Indexadas em `docs/adr/README.md`

---

## 📊 Progresso

```
[██░░░░░░░░] 20%
```

**Concluído**: 
- ✅ README.md principal
- ✅ Docs em `/docs` (parcial)

**Planejado**:
- 📋 Chrome APIs
- 📋 ADRs
- 📋 CONTRIBUTING.md

---

## 🔗 Dependências

- Independente de outros EPICs
- Não bloqueia desenvolvimento
- Pode ser feito em paralelo

---

## 📝 Notas

- Documentação é **investimento de longo prazo**
- Impacto indireto mas significativo
- Facilita crescimento da comunidade open source

---

**Criado em**: 2025-12-23  
**Relacionado a**: [SPEC-v2.8.0.md](file:///home/sant/extensaoUNIVESP/.github/SPEC-v2.8.0.md)
