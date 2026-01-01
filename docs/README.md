# 📚 Documentação de Referência

Este diretório contém a documentação técnica detalhada do projeto.

---

## 🎯 Guias de Qualidade

### 📋 [ANTI_PADROES.md](./ANTI_PADROES.md)
Padrões **PROIBIDOS** que causam erros recorrentes:
- `window.location` reassign
- Mocks globais incompletos
- Spies em instâncias DOM
- Imports não usados
- RegExp sem justificativa

### ✅ [TEST_TEMPLATES.md](./TEST_TEMPLATES.md)
Templates oficiais de testes (ADR-000-C):
- Testes unitários (AAA explícito)
- Testes com polyfills JSDOM
- Testes de integração
- **Template executável**: [`TEST_TEMPLATE_EXAMPLE.js.template`](./TEST_TEMPLATE_EXAMPLE.js.template)

---

## 🏗️ Arquitetura & Decisões

### [`architecture/`](./architecture/)
- **ADR_*.md**: Architectural Decision Records
- **VIS_MANIFESTO.md**: Declaração de princípios visuais
- **OBSERVABILITY_PLAN.md**: Estratégia de observabilidade

### [TECNOLOGIAS_E_ARQUITETURA.md](./TECNOLOGIAS_E_ARQUITETURA.md)
Stack completa e detalhamento da Screaming Architecture

---

## 📐 Padrões & Convenções

### [PADROES.md](./PADROES.md)
- Código intencional
- Auditoria de decisão
- Interoperabilidade (2025+)

### [REGRAS_DE_NEGOCIO.md](./REGRAS_DE_NEGOCIO.md)
Lógica do domínio:
- Estrutura de cursos (Semanas, Revisão, ordenação)
- Persistência e cache
- Regras de navegação

---

## 🔐 Privacidade & Segurança

### [PRIVACIDADE_E_DADOS.md](./PRIVACIDADE_E_DADOS.md)
Política de privacidade e tratamento de dados

---

## 🚀 Como Usar

### Para a IA
1. **Regras principais**: `.agent/rules/regras.md` (~60 linhas)
2. **Workflow específico**: `.agent/workflows/*.md` (~15 linhas cada)
3. **Consulta detalhada**: `docs/*.md` (sob demanda)

### Para Desenvolvedores
- Comece por `TECNOLOGIAS_E_ARQUITETURA.md`
- Consulte `PADROES.md` para convenções
- Veja `TEST_TEMPLATES.md` antes de criar testes
- Evite `ANTI_PADROES.md` a todo custo

---

**Última Atualização**: 2026-01-01
