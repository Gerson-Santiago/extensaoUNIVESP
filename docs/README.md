> Status: Active
> Last Update: 2025-12-20

# 📚 Documentação do Projeto

Bem-vindo à documentação central do **AutoPreencher UNIVESP**. Este diretório organiza toda a informação arquitetural, técnica e de negócio do projeto.

---

## 🗺️ Navegação Rápida

### 📖 Fundamentos (Leia Primeiro)
1. **[GLOSSARIO.md](./GLOSSARIO.md)** - Dicionário de termos técnicos e de domínio
2. **[IDENTIDADE_DO_PROJETO.md](./IDENTIDADE_DO_PROJETO.md)** - Visão, filosofia e valores
3. **[TECNOLOGIAS_E_ARQUITETURA.md](./TECNOLOGIAS_E_ARQUITETURA.md)** - Stack técnico e Screaming Architecture

### ⚖️ Regras e Padrões
4. **[REGRAS_DE_NEGOCIO.md](./REGRAS_DE_NEGOCIO.md)** - Lógica de domínio (Como o sistema pensa)
5. **[PADROES_DO_PROJETO.md](./PADROES_DO_PROJETO.md)** - Convenções de código (ESLint, Prettier, Commits)
6. **[FLUXOS_DE_TRABALHO.md](./FLUXOS_DE_TRABALHO.md)** - Git workflow e qualidade

### 📋 Conformidade e Dados
7. **[DATA_HANDLING.md](./DATA_HANDLING.md)** - Como acessamos AVA e SEI
8. **[CONFORMIDADE_LGPD.md](./CONFORMIDADE_LGPD.md)** - Análise técnica de privacidade e segurança

### 🏗️ Arquitetura Detalhada
9. **[screaming_architecture/](./screaming_architecture/)** - Planejamento e decisões arquiteturais (ADRs, PLANs, REFs)

---

## 📂 Estrutura de Pastas

```
docs/
├── screaming_architecture/   # Documentação arquitetural profunda
│   ├── VIS_*.md             # Visão e filosofia
│   ├── ADR_*.md             # Architecture Decision Records
│   ├── REF_*.md             # Referências técnicas
│   ├── PLAN_*.md            # Planos históricos de refatoração
│   └── RUN_*.md             # Runbooks executados
├── estudos/                 # Estudos técnicos isolados
├── investigacao/            # Logs de investigação de bugs/features
└── estudos_termos/          # Análises de workflow (legado)
```

---

## 🎯 Por Onde Começar?

### Se você é um **Novo Desenvolvedor**:
1. Leia [IDENTIDADE_DO_PROJETO.md](./IDENTIDADE_DO_PROJETO.md) (entenda o "porquê")
2. Leia [GLOSSARIO.md](./GLOSSARIO.md) (aprenda a linguagem)
3. Leia [TECNOLOGIAS_E_ARQUITETURA.md](./TECNOLOGIAS_E_ARQUITETURA.md) (entenda o "como")
4. Consulte [REGRAS_DE_NEGOCIO.md](./REGRAS_DE_NEGOCIO.md) antes de codificar

### Se você quer **Contribuir com Código**:
1. Siga [PADROES_DO_PROJETO.md](./PADROES_DO_PROJETO.md) (linting, testes)
2. Respeite [FLUXOS_DE_TRABALHO.md](./FLUXOS_DE_TRABALHO.md) (Git, branches)

### Se você quer **Entender uma Decisão Arquitetural**:
Explore `screaming_architecture/ADR_*.md` (Architecture Decision Records)

---

## 🔍 Dúvidas Comuns

**"Onde coloco meu código novo?"**
→ Leia [TECNOLOGIAS_E_ARQUITETURA.md](./TECNOLOGIAS_E_ARQUITETURA.md) seção "Anatomia do Sistema"

**"Qual a diferença entre Repository e Service?"**
→ Consulte [GLOSSARIO.md](./GLOSSARIO.md)

**"Por que a pasta sidepanel/ não pode ser renomeada?"**
→ Leia [screaming_architecture/ADR_002_SIDEPANEL_CONSTRAINT.md](./screaming_architecture/ADR_002_SIDEPANEL_CONSTRAINT.md)

**"Como a extensão coleta dados?"**
→ Leia [DATA_HANDLING.md](./DATA_HANDLING.md) e [CONFORMIDADE_LGPD.md](./CONFORMIDADE_LGPD.md)

---

> **Regra de Ouro**: Se a documentação não responde sua pergunta, ela está incompleta. Abra uma Issue ou atualize este README.
