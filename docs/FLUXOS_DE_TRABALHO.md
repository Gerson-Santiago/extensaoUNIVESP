# ⚙️ Fluxos de Trabalho da Equipe (Team Workflow)

> [!WARNING]
> **Regras Gerais:**
> 1.  🚫 Proibido `npm install` sem discussão prévia.
> 2.  🛡️ Commit direto na `main` ou `dev` é proibido sem aprovação (Gate Manual).
> 3.  🧪 Sem teste, sem feature.

Este documento descreve como a equipe de desenvolvimento opera. Se você é um novo desenvolvedor (ou uma IA), **leia isto antes de tocar no código**.

---

## 🏗️ Ciclo de Desenvolvimento (Development Lifecycle)

Nosso fluxo segue um padrão simples de Feature Branch.

### 1. Escolha da Tarefa
- [ ] Identifique uma Issue ou crie uma tarefa no `task.md`.
- [ ] Entenda o "Porquê" antes do "Como". Se a tarefa não tem um valor claro para o usuário, questione.

### 2. Branching
- [ ] Crie uma branch descritiva a partir da `dev` (ou `main` se não houver dev):
    - `feat/nova-funcionalidade`
    - `bug/correcao-critica`
    - `refactor/limpeza-codigo`
    - `docs/atualizacao-readme`
    - **Dica:** Use `git switch -c feat/nome` (Moderno) - **NÃO USE** `git checkout -b`.
    - **Dica:** Use os workflows automatizados (`.agent/workflows/`).

### 3. Codificação (Coding Rules)
- **Javascript Moderno**: Use ES6+, `const`/`let`, Arrow Functions.
- **Modularização (Screaming Architecture)**: 
  - `features/`: Organize por domínio de negócio (ex: `courses`, `session`)
  - Cada feature contém: `ui/`, `logic/`, `data/`, `services/`, `tests/`
  - `shared/`: Componentes reutilizáveis (`shared/ui`, `shared/utils`, `shared/logic`)
  - `assets/`: Recursos estáticos (CSS, imagens)
- **Padrões**: Consulte `PADROES_DO_PROJETO.md`.
- **Linting Contínuo**: VS Code deve estar sem sublinhados vermelhos.

### 4. Verificação Local (Before Commit)

#### 🛡️ segurança de Refatoração
**Nunca refatore código sem cobertura de testes.**
- [ ] Se não tem teste, crie um teste que passe com o código atual.
- [ ] Só depois refatore.

#### 🔄 Princípio da Co-evolução
> "Se a lógica muda, o teste muda."

- [ ] Validou se o teste passou pelo motivo certo?
- [ ] Atualizou o teste para refletir a nova regra?

#### 💻 Comandos Obrigatórios (Automação Ativa)
O projeto possui **Husky** configurado.
- [ ] `git commit`: Dispara automaticamente Lint e Prettier.
    - Se falhar: Corrija os erros reportados e tente novamente.
    - Se passar: O código será formatado automaticamente.
- [ ] `npm test`: **Deve ser rodado manualmente** antes do push (ainda não está no pre-commit por performance).

### 5. Commit e Pull Request (PR)
- Use mensagens semânticas (`feat:`, `fix:`, `docs:`).
- **Idioma**: A descrição do commit deve ser sempre em **Português do Brasil**.
    - ✅ `feat: adiciona botão de login`
    - ❌ `feat: add login button`
- Abra o PR descrevendo o que foi feito.

## 🔄 6. Ciclo de Vida e Sincronização (Anti-Caos)

Para evitar que a árvore balance e caia (branches divergentes), siga este ritual sagrado:

### 🛫 Decolagem (Antes de criar branch)
1.  **Vá para a base:** `git switch dev`
2.  **Balance a Árvore:** `git pull origin dev` (Garanta que você tem a verdade).
3.  **Teste o Solo:** `npm test` (Nunca crie branch a partir de uma dev quebrada).
4.  **REGRA DE OURO (Zero Divergência):**
    > [!IMPORTANT]
    > **Nunca crie uma feature branch se `main` e `dev` estiverem divergentes.**
    *   Verifique: `git diff main dev`
    *   **Deve retornar vazio.** Se houver diferença, PARE.
    *   *Solução:* Crie uma branch `chore/sync`, resolva a divergência (rebase/merge), mergeie e só então comece sua feature.
5.  **Crie:** `git switch -c feat/sua-feature`.

### 🛬 Pouso (Ao terminar)
1.  **Merge Local:**
    *   `git switch dev`
    *   `git merge feat/sua-feature`
2.  **Sincronização Imediata (Crucial):**
    *   `git push origin dev`
    *   *Se você não der push agora, a próxima pessoa (ou você mesmo no futuro) vai ramificar de uma base desatualizada.*

### 🧹 Limpeza
*   `git branch -d feat/sua-feature` (Delete branches mortas para não confundir).

---

## 🚀 7. Release & Deploy (Dev -> Main)

Quando a `dev` está estável, testada e pronta para o público:

### Checklist de Segurança Absoluta (Gatekeeper)
Antes de rodar qualquer comando de merge para `main`, você **DEVE** garantir:
1.  [ ] **Testes Verdes**: `npm test` passou sem erros.
2.  [ ] **Lint Limpo**: `npm run lint` não acusa nada.
3.  [ ] **Tipagem Sólida**: `npm run type-check` retornou 0 erros.
    *   **Dica:** Use `npm run verify` para rodar tudo de uma vez.
4.  [ ] **Dev Atualizada**: Você deu `git pull origin dev` e não veio nada novo (ou se veio, você re-testou).

### O Comando Sagrado (Release)
Para evitar erros manuais, use o workflow: `/release-prod`.
Ou manualmente:

```bash
# 1. Garanta que a dev tem a última versão
git switch dev
git pull origin dev

# 2. Vá para a main e atualize (para evitar conflitos de base)
git switch main
git pull origin main

# 3. O Grande Momento (Merge)
git merge dev

# 4. Envio para Produção
git push origin main

# 5. Volte para segurança
git switch dev
```

---

## 🏛️ Governança e Regras de Segurança

### 4.1 Gate de Aprovação
O agente (ou dev) tem autonomia para rodar testes "Turbo", mas **NÃO TEM AUTONOMIA** para commitar alterações funcionais sem revisão explícita.
- **Fluxo**: Implementar -> Validar (Turbo) -> Pausar -> Pedir feedback -> Commitar.

### 4.2 Documentação Viva
Software muda. Documentação deve acompanhar.
- [ ] Estrutura mudou? -> Atualizar `TECNOLOGIAS_E_ARQUITETURA.md`.
- [ ] Fluxo mudou? -> Atualizar `FLUXOS_DE_TRABALHO.md`.
- [ ] Changelog atualizado?

### 4.3 Política Estrita de NPM
**Proibido `npm install` silencioso.**
Novas dependências são um risco de segurança e performance.
- Regra: Todo `npm install` deve ser proposto, justificado e aprovado pelo usuário antes de execução.

---

## 🛠️ Ferramentas e Configurações

### Ambiente
- **Editor**: VS Code (Recomendado) + ESLint + Prettier.
- **Node**: Versão 20.x+.

### Scripts Principais (`package.json`)
| Comando | Descrição |
| :--- | :--- |
| `npm install` | Instala dependências (Cuidado!). |
| `npm run lint` | Roda o ESLint (Check). |
| `npm run lint:fix` | Auto-fix Lint. |
| `npm run format` | Prettier. |
| `npm test` | Jest Suite. |
| `npm run verify` | Roda Testes + Lint + Type-Check (Recomendado antes do push). |

---

## 🚫 O que NÃO Fazer

1.  **Não comite código quebrado.**
2.  **Não ignore o console.**
3.  **Não misture idiomas.** (Doc em PT-BR, Código misto).

---

> *"Qualidade não é um ato, é um hábito."*

---

### Documentação
<!-- Documentação do projeto -->
**[README.md](../README.md)**            Documentação do projeto.             
<!-- Histórico de versões e atualizações -->
**[CHANGELOG.md](../CHANGELOG.md)**      Histórico de versões e atualizações. 

