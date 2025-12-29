# Extensão UNIVESP - Suíte de Produtividade Acadêmica

> **Versão Atual**: v2.8.14
> **Status**: Ativo / Em Desenvolvimento

A **Extensão UNIVESP** é uma ferramenta de produtividade e gestão acadêmica projetada para automatizar o acesso e organização de tarefas no AVA. Priorizando a soberania de dados (Local-First) e uma arquitetura robusta.

---

## 📚 Documentação Técnica

| Documento | Descrição |
| :--- | :--- |
| **[Fluxo de Trabalho](docs/FLUXOS_DE_TRABALHO.md)** | Protocolos de Git, Branching e Release. |
| **[Arquitetura](docs/TECNOLOGIAS_E_ARQUITETURA.md)** | Especificação técnica (Screaming Architecture, Stack). |
| **[Padrões de Engenharia](docs/PADROES_DO_PROJETO.md)** | Style guides, Linting e Convenções de Código. |
| **[Glossário](docs/GLOSSARIO.md)** | Definições de termos de domínio e técnicos. |
| **[Visão do Projeto](docs/IDENTIDADE_DO_PROJETO.md)** | Princípios norteadores e filosofia do produto. |
| **[Scripts de Automação](docs/SCRIPTS.md)** | Documentação detalhada de todos os comandos NPM. |

---

## 🚀 Getting Started (Desenvolvimento)

### Pré-requisitos
- Node.js 20.x+
- Google Chrome (Modo Desenvolvedor)

### Instalação do Ambiente
```bash
# 1. Clone o repositório
git clone https://github.com/Gerson-Santiago/extensaoUNIVESP.git

# 2. Instale dependências
npm install
```

### Verificação
Antes de submeter código, execute a pipeline de qualidade:
```bash
npm run verify  # Tests + Lint + Type-check
```

### Scripts Disponíveis

#### Desenvolvimento Ágil
```bash
npm run test:watch  # Modo watch (testes contínuos)
npm run lint:fix    # Corrige erros de lint automaticamente
npm run format      # Formata código (Prettier)
```

#### Segurança
```bash
npm run security          # Gate completo (secrets + audit + lint)
npm run security:secrets  # Detecta API keys, tokens
npm run security:audit    # Vulnerabilidades CVE high/critical
```

#### Testes
```bash
npm test               # Suite completa (365 testes)
npm run test:quick     # Apenas testes que falharam (rápido)
npm run test:debug     # Para no primeiro erro (debug)
npm run test:coverage  # Com análise de cobertura
```

**Performance:** Pre-commit otimizado (~16s - apenas testes relacionados)

---

## 📂 Visão Geral da Estrutura

```text
/
├── features/        # Módulos de Domínio (Core Business)
├── shared/          # Componentes Reutilizáveis
├── sidepanel/       # Interface Principal
├── scripts/         # Scripts de Background/Content
└── docs/            # Base de Conhecimento
```

---

## 📜 Conformidade e Legal

- **Privacidade**: Consulte [PRIVACIDADE_E_DADOS.md](docs/PRIVACIDADE_E_DADOS.md).
- **Licença**: MIT. Este projeto é independente e não possui vínculo oficial com a UNIVESP.
