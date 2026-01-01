# AutoPreencher UNIVESP (Extensão Chrome)

> **Versão Atual**: v2.9.6
> **Descrição**: Ferramenta de produtividade Open Source para alunos da UNIVESP.

![Version](https://img.shields.io/badge/version-2.9.6-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-stable-success)

## Sobre o Projeto

O **AutoPreencher UNIVESP** é uma extensão de navegador desenvolvida **de aluno para aluno** com o objetivo de otimizar a rotina acadêmica. A extensão centraliza ferramentas de produtividade, facilita a navegação no Ambiente Virtual de Aprendizagem (AVA) e automatiza tarefas repetitivas.

### Missão

Prover uma interface unificada e eficiente para gestão acadêmica, eliminando o atrito de navegação em sistemas legados e devolvendo tempo de estudo ao aluno.

### Princípios Norteadores

1. **Soberania de Dados (Local-First):** Privacidade absoluta - dados sensíveis nunca deixam a máquina do usuário. O sistema funciona sem dependência de backends proprietários.

2. **Ética na Automação:** A ferramenta automatiza o *acesso* e *organização*, jamais o *consumo* de conteúdo educacional (não assiste aulas pelo aluno).

3. **Excelência Técnica:** Tratamos este projeto open-source com rigor de software enterprise (Testes, CI/CD, Arquitetura Limpa).

### Proposta de Valor

- **Centralização:** Dashboard único para Cursos, Prazos e Notas
- **Contexto:** Navegação inteligente que entende a estrutura do AVA
- **Performance:** Interface instantânea, sem refresh de página

---

## Funcionalidades Principais

### Autopreenchimento & Acesso
*   **Login Facilitado**: Configuração de RA e domínio para preenchimento automático no SEI e outros sistemas.
*   **Acesso Rápido**: Links diretos para Portal SEI, AVA, Área do Aluno e Sistema de Provas via Popup.

### Gestão de Cursos (Painel Lateral)
*   **Side Panel Dedicado**: Navegue pelos seus cursos sem sair da página atual.
*   **Organização Personalizada**: Adicione, remova e organize sua lista de matérias.
*   **Importação Inteligente**:
    *   **Em Lote**: Importe múltiplos cursos de uma vez.
    *   **Manual**: Adicione cursos específicos manualmente.
    *   **Aba Atual**: Salve o curso que você está navegando com um clique.

### Produtividade
*   **Navegação Otimizada**: Interface limpa e focada no conteúdo.
*   **Foco no Aluno**: Ferramentas pensadas para reduzir o atrito no uso das plataformas da universidade.

### Segurança e Qualidade
*   **Tipagem Estática (JSDoc)**: Segurança de tipos sem TypeScript - utilizamos JSDoc Strict com validação em tempo de desenvolvimento.
*   **3 Camadas de Proteção:**
    *  Secretlint - Detecta API keys, tokens, passwords
    *  npm audit - Bloqueia CVE high/critical
    *  ESLint Security - Anti-injection, anti-XSS, anti-eval
*   **Logging Estruturado**: Sistema centralizado de logs com tags semânticas para auditoria e debug eficiente.
*   **Zero Erros**: Política de 0 erros de lint, 0 warnings e 0 erros de tipagem em código de produção.

---

## Stack Tecnológica

- **Core:** JavaScript (ES2024), Manifest V3 (Vanilla JS, sem frameworks de build complexos).
- **Runtime:** Node.js v24.12.x (Current).
- **Package Manager:** npm v11.6.x (via Corepack v0.34.x).
- **Testes:** Jest + `jest-webextension-mock`.
- **Qualidade:** ESLint (Security Rules), Prettier, SecretLint.

---

## Como Instalar (Modo Desenvolvedor)

1.  **Clone este repositório** ou baixe o código fonte:
    ```bash
    git clone https://github.com/Gerson-Santiago/extensaoUNIVESP.git
    ```
2.  Abra o navegador (Chrome, Edge, Brave) e acesse: `chrome://extensions/`
3.  Ative o **"Modo do desenvolvedor"** no canto superior direito.
4.  Clique no botão **"Carregar sem compactação"** (Load unpacked).
5.  Selecione a **pasta raiz** do projeto baixado.

---

## Documentação do Projeto

Mantemos uma documentação rigorosa e detalhada para garantir a qualidade e a continuidade do projeto.

| Documento | Descrição |
| :--- | :--- |
| **[️ Arquitetura](./docs/TECNOLOGIAS_E_ARQUITETURA.md)** | Stack tecnológica, diagramas e decisões de arquitetura. |
| **[Workflow](./docs/FLUXOS_DE_TRABALHO.md)** | Guia de contribuição, padrões de Git e Code Review. |
| **[Regras](./docs/REGRAS_DE_NEGOCIO.md)** | Especificações funcionais e lógica de negócios detalhada. |
| **[Padrões](./docs/PADROES.md)** | Style guides, linter, padrões de commit e qualidade de código. |

---

## Comandos para Desenvolvimento

Este projeto utiliza **Node.js** e **npm** para scripts de qualidade e automação.

### Pipeline de Qualidade
```bash
# Instalação
npm install

# Validação completa (obrigatório antes de PR)
npm run verify  # Tests + Lint + Type-check
```

### Segurança
```bash
npm run security  # Gate completo (secrets + audit + security lint)
```

### Desenvolvimento Ágil
```bash
# Testes
npm run test:watch   # Modo watch (feedback instantâneo)
npm run test:quick   # Apenas testes que falharam (rápido)
npm run test:debug   # Para no primeiro erro (debug)

# Qualidade
npm run lint:fix     # Corrige erros automaticamente
npm run format       # Formata código (Prettier)
```

**Performance:** Pre-commit otimizado (~16s - apenas testes relacionados aos arquivos alterados)

> **Nota:** Seguimos a metodologia **"Screaming Architecture"** e **"Zero Warnings"** no Linter.

---

## Licença & Aviso Legal

Este projeto é distribuído sob a licença **MIT**.

> **Aviso:** Este é um projeto independente desenvolvido por alunos e **NÃO possui vínculo oficial** com a Universidade Virtual do Estado de São Paulo (UNIVESP).
