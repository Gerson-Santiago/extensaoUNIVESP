# Especificação de Commits (Conventional Commits)

Este projeto adota a especificação [Conventional Commits](https://www.conventionalcommits.org/) para estruturar o histórico de alterações. Isso permite a geração automatizada de changelogs e facilita a navegação no histórico.

---

## 1. Formato da Mensagem

```text
<tipo>(<escopo opcional>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### 1.1 Regras de Sintaxe
1.  **Assunto (Subject)**:
    -   Deve iniciar com letra **minúscula**.
    -   Não deve conter ponto final.
    -   Máximo de 100 caracteres.
    -   Verbo no **imperativo** (ex: "adiciona", "corrige", "remove").
2.  **Idioma**: Português Brasileiro (PT-BR).

---

## 2. Tipos de Commit

| Tipo | Descrição | Exemplo |
| :--- | :--- | :--- |
| **`feat`** | Nova funcionalidade para o usuário. | `feat: implementa login automático` |
| **`fix`** | Correção de bug. | `fix: resolve crash no scraper` |
| **`docs`** | Alterações em documentação. | `docs: atualiza diagrama de arquitetura` |
| **`style`** | Formatação, white-space (sem lógica). | `style: aplica prettier` |
| **`refactor`** | Mudança de código que não altera comportamento. | `refactor: extrai service de scraping` |
| **`test`** | Adição ou correção de testes. | `test: adiciona cobertura para modal` |
| **`chore`** | Manutenção de build, deps, ferramentas. | `chore: atualiza eslint` |
| **`perf`** | Melhoria de performance. | `perf: otimiza renderização da lista` |

---

## 3. Escopos (Scopes)

O escopo denota o módulo afetado. Deve seguir a estrutura de diretórios ou domínios lógicos.

-   `features` (ou feature específica: `courses`, `settings`)
-   `shared`
-   `ui`
-   `core`
-   `deps`

---

## 4. Exemplos

**Feature Simples (Do Git Log)**
```bash
docs(features): padroniza tom tecnico do readme
```

**Bug Fix Real**
```bash
fix(ux): destaque azul permanece mesmo quando preview fecha

Corrige comportamento onde o highlight CSS persistia após
o fechamento do modal de preview.
```

**Refactor Real**
```bash
refactor(courses): extrai logica de scrape para ScraperService
```

---

## 5. Automação

O projeto utiliza **Commitlint** validado via **Husky**.
Commits que violem estas regras serão rejeitados automaticamente no momento da criação (`commit-msg` hook).

### Validação Manual
Para verificar se sua mensagem está correta antes de commitar:

```bash
echo "feat: minha mensagem" | npx commitlint
```

---

## 6. Commits de Segurança (Novas Práticas v2.8.1)

Quando implementar melhorias de segurança, use os tipos apropriados:

| Tipo | Quando Usar | Exemplo |
| :--- | :--- | :--- |
| `chore(security)` | Configuração de ferramentas de segurança | `chore(security): adiciona secretlint no pre-commit` |
| `feat(security)` | Nova feature de segurança | `feat(security): implementa gate de auditoria CVE` |
| `fix(security)` | Correção de vulnerabilidade | `fix(security): corrige XSS em formulário` |
| `perf(security)` | Otimização mantendo segurança | `perf(security): otimiza pre-commit de 37s para 16s` |
| `docs(security)` | Documentação de segurança | `docs(security): documenta 3 camadas de proteção` |

### Exemplos Reais

**Implementação de  Ferramentas:**
```bash
chore(security): adiciona secretlint para detectar API keys

Implementa @secretlint/secretlint-rule-preset-recommend
Detecta: AWS keys, GitHub tokens, private keys, passwords
```

**Otimização de Performance:**
```bash
perf: otimiza pre-commit para rodar apenas testes relacionados

- Remove npm test completo do pre-commit
- lint-staged já roda jest --findRelatedTests
- Ganho: 57% mais rápido (37s → 16s)
```

**Documentação:**
```bash
docs: atualiza README com 3 camadas de segurança

- Secretlint (detecta secrets)
- npm audit (CVE high/critical)
- ESLint Security (injection, XSS, eval)
```

### Bloqueadores Automáticos

O projeto possui 3 gates de segurança que **rejeitam commits automaticamente**:

1. **Secretlint** → Detecta API keys, tokens, passwords
2. **npm audit** → Bloqueia dependências com CVE high/critical  
3. **ESLint Security** → Detecta código inseguro (eval, injection, XSS)

**Bypass (não recomendado):** `git commit --no-verify`

---

## 7. Referências

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint](https://commitlint.js.org/)
- [Keep a Changelog](https://keepachangelog.com/pt-BR/)
