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

**Feature Simples**
```bash
feat(courses): adiciona botão de exportação
```

**Bug Fix com Descrição Detalhada**
```bash
fix(scraper): corrige timeout em conexões lentas

Aumenta o timeout padrão de 3s para 10s para acomodar
usuários com conexão instável.
```

**Breaking Change (Rodapé)**
```bash
feat(api): altera contrato de resposta

BREAKING CHANGE: remove campo deprecated 'old_id'.
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
