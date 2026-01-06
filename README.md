# Central Univesp
> **Sua central de comando para a faculdade.** 
> Uma nova forma de navegar na UNIVESP.

> [!IMPORTANT]
> **Source of Truth (SoT):** A documentação fornece o contexto arquitetural e intencionalidade. A Fonte Única da Verdade é o **código-fonte** e os **testes automatizados**. Em caso de divergência, o código prevalece.

![Version](https://img.shields.io/badge/Versão-v2.10.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-stable-success)

## De Aluno para Aluno
> **Aviso:** Projeto independente, **sem vínculo oficial** com a UNIVESP.

A **Central Univesp** é uma extensão open-source desenvolvida **de aluno para aluno** com um único objetivo: eliminar o atrito entre você e seu diploma.

Não somos um produto. Somos uma solução comunitária para resolver as dores reais da experiência de estudante na UNIVESP.

A ferramenta atua como um **Andaime Cognitivo** (*Cognitive Scaffolding*), organizando o ambiente virtual para que você gaste energia estudando, não clicando.

## O Problema (As Dores do Aluno)

Se você estuda na UNIVESP, provavelmente enfrenta estes 3 pesadelos diários:

1.  **Navegação Labiríntica**: Para chegar na atividade da "Semana 4" de uma matéria, você precisa de ~5 cliques, abrir 3 abas e esperar carregamentos lentos. Multiplique isso por 5 matérias.
2.  **Poluição Visual**: O AVA (Blackboard) tem menus redundantes, cabeçalhos gigantes e informações que distraem, dificultando a leitura do texto que importa.
3.  **Login Repetitivo**: Digitar RA e selecionar domínio toda vez que entra no sistema quebra o ritmo.

---

## A Solução (Como a Extensão Resolve)

A **Central Univesp** resolve essas dores tratando o sistema como ele deveria ser:

### 1. Fim do "Labirinto" (Painel Lateral & Índice)
Trazemos a estrutura do curso **para fora** do site.
*   **Antes**: Entrar na matéria > Procurar pasta > Abrir pasta > Rolar página.
*   **Com a Extensão**: Um Painel Lateral fixo mostra suas matérias e semanas. Clique na "Semana 3" e vá direto para ela.
*   **Ganho**: Troca de contexto instantânea entre matérias.

### 2. Leitura Limpa (Visual Clean)
A extensão injeta CSS que:
*   Remove menus laterais inúteis do Blackboard.
*   Foca o conteúdo real (texto/vídeo) no centro da tela.
*   Aumenta a legibilidade para você não cansar a vista.

### 3. Login Vapt-Vupt (Autopreenchimento)
*   **Configuração Única**: Você salva seu RA na extensão.
*   **A mágica**: A extensão monta seu e-mail institucional (ex: `12345@aluno.univesp.br`) e preenche o campo de login automaticamente.
*   **Segurança**: Você só precisa digitar sua senha. Nunca salvamos sua senha.

### Outras Dores Resolvidas
*   **"Eu já fiz isso?"**: Checkboxes visuais no Painel Lateral para você marcar as semanas concluídas (o AVA não mostra isso claramente).
*   **Abas Infinitas**: O sistema "Abas Únicas" (Singleton) impede que você abra a mesma matéria 10 vezes sem querer. Se já está aberta, a extensão te leva para lá.

---

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
