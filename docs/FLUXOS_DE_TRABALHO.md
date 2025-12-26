# ⚙️ Workflow de Engenharia

> **Diretrizes Mandatórias:**
> 1.  🚫 **Veto de Dependências**: A instalação de novos pacotes (`npm install`) requer aprovação técnica prévia.
> 2.  🛡️ **Branch Protection**: Commits diretos na `main` ou `dev` são estritamente proibidos.
> 3.  🧪 **Gate de Qualidade**: Pull Requests sem cobertura de testes serão rejeitados automaticamente.

Este documento estabelece os protocolos operacionais da equipe de engenharia. O compliance com estas regras é mandatório para todos os colaboradores.

---

## 1. Estratégia de Branching (Git Flow Simplificado)

Adotamos um modelo baseado em Feature Branching com Trunk-Based Development na `dev`.

### 1.1 Tipos de Branch
- **`main`**: Produção estável. Deploy automatizado.
- **`dev`**: Integração contínua (Trunk). Deve estar sempre compilável e testável.
- **`feat/<nome>`**: Novas funcionalidades.
- **`fix/<nome>`**: Correções de bugs.
- **`refactor/<nome>`**: Refatoração técnica.
- **`docs/<nome>`**: Atualização de documentação.

### 1.2 Protocolo de Criação
1.  **Sincronização**: Garanta que sua base `dev` está atualizada (`git pull origin dev`).
2.  **Verificação de Divergência**: Não inicie features se houver conflito pendente entre `main` e `dev`.
3.  **Nomenclatura**: Use nomes descritivos em *kebab-case*.
    -   Ex: `feat/importacao-lote`, `fix/erro-download`.

---

## 2. Padrões de Codificação

### 2.1 Stack & Arquitetura
- **Javascript**: ES Modules (ESM) nativo.
- **Arquitetura**: Screaming Architecture (vide `TECNOLOGIAS_E_ARQUITETURA.md`).
- **Módulos**:
    -   `features/`: Domínios de negócio isolados.
    -   `shared/`: Utilitários transversais.
- **Linting**: Tolerância zero para linters. O código não deve conter warnings.

### 2.2 Refatoração Segura
**Princípio**: Refatoração é uma operação de manutenção de estrutura, não de comportamento.
- **Pré-requisito**: Existência de testes verdes.
- **Execução**: Altere a estrutura interna mantendo a interface pública inalterada.
- **Validação**: Testes devem permanecer verdes sem alteração na lógica de asserção.

---

## 3. Protocolo de Commit e Integração

### 3.1 Automação Local (Pre-commit)
O repositório utiliza Husky para garantir sanidade antes do push.
- **Lint Staged**: Formatação automática (Prettier) e Linting (ESLint) nos arquivos modificados.
- **Teste Manual**: É responsabilidade do desenvolvedor executar `npm test` antes do push para evitar quebra da CI.

### 3.2 Convenção de Commits
Seguimos estritamente o **Conventional Commits** em Português Brasileiro.
- Ex: `feat: implementa autenticação via token`
- Ex: `fix(scraper): corrige seletor css da semana`

### 3.3 Sincronização (Sync Policy)
Para minimizar conflitos de merge (Merge Hell):
1.  **Pull Frequent**: Atualize sua branch com a `dev` diariamente.
2.  **Push Early**: Suba seus commits regularmente para backup e visibilidade.

---

## 4. Pipeline de Release

O processo de promoção de código da `dev` para `main` segue um rigoroso Gate de Qualidade.

### 4.1 Critérios de Aceite (Quality Gate)
- [ ] **Testes**: Suíte completa (`npm test`) passando.
- [ ] **Lint**: Sem erros ou warnings (`npm run lint`).
- [ ] **Types**: Verificação estática (`npm run type-check`) limpa.

### 4.2 Procedimento de Deploy
Utilize o script de verificação unificado para validar o release candidato:

```bash
# 1. Validação Completa
npm run verify

# 2. Execução do Merge (Se aprovado)
git switch main
git pull origin main
git merge dev
git push origin main
git switch dev
```

---

## 5. Ferramental

### Ambiente de Desenvolvimento
- **Runtime**: Node.js 20.x (LTS).
- **Gerenciador de Pacotes**: npm.

### Scripts Essenciais
| Script | Função |
| :--- | :--- |
| `npm run verify` | **Pipeline Principal**. Executa Testes, Lint e Type-Check. |
| `npm test` | Executa suíte de testes completa (Jest). |
| `npm run lint` | Analisa código estático (ESLint). |
| `npm run format` | Aplica formatação de estilo (Prettier). |
| `npm run type-check` | Validação de tipos JSDoc. |

### Scripts de Testes (Jest Otimizado)
| Script | Comando | Quando Usar |
| :--- | :--- | :--- |
| `npm run test:dev` | `jest --watch` | **Desenvolvimento ativo** - Feedback instantâneo |
| `npm run test:debug` | `jest --bail` | **Debug de bugs** - Para no 1º erro |
| `npm run test:quick` | `jest --onlyFailures` | **Validação rápida** - Só testes que falharam |
| `npm test` | `jest` | **Validação completa** - CI/CD e final |
| `npm run test:coverage` | `jest --coverage` | **Análise de cobertura** - Release |
| `npm run test:ci` | `jest --coverage --ci` | **CI/CD** - Otimizado para pipelines |

**💡 Dica de Performance**: Use ` test:quick` durante desenvolvimento para economizar memória e tempo.

---

> **Nota**: A violação destes protocolos pode resultar em rejeição automática de Pull Requests ou reversão de commits.
