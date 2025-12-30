# ISSUE: Inconsistência na Captura da "Semana de Revisão" e Duplicação de Lógica

**Status:** 🛠️ Em Implementação (Manual pelo Aluno) | **Gravidade:** Média | **Componentes:** `ScraperService`, `BatchScraper`

---

### 🎯 O Desafio (O Bug do Milênio)
O sistema hoje é "cego" para conteúdos que não seguem o padrão `Semana X`. Sua missão é blindar a lógica de captura e ordenação, eliminando a duplicação entre os serviços (DRY).

### 🔍 Guia de Navegação (Code Search)
Use o comando de busca (ou Code Search) para localizar os marcadores **#STEP-N** aplicados no código. Estes passos são exclusivos desta missão:

0.  **#STEP-0**: Ativar o Teste
    *   *Missão*: Abrir o arquivo `WeekOrdering.test.js` e remover o `.skip` do `describe` para que o teste volte a ser executado e valide sua solução.
1.  **#STEP-1**: [CourseStructure.js](file:///home/sant/extensaoUNIVESP/shared/logic/CourseStructure.js)
    *   *Missão*: Implementar a Regex musculosa e a lógica de pesos.
2.  **#STEP-2**: [WeekOrdering.test.js](file:///home/sant/extensaoUNIVESP/tests/unit/features/courses/logic/WeekOrdering.test.js)
    *   *Missão*: Importar a nova lógica para validar se o teste de regressão passa.
3.  **#STEP-3**: [ScraperService.js](file:///home/sant/extensaoUNIVESP/features/courses/services/ScraperService.js)
    *   *Missão*: Substituir lógica local pela centralizada (Regex e Sort).
4.  **#STEP-4**: [ScraperService.js](file:///home/sant/extensaoUNIVESP/features/courses/services/ScraperService.js) (Injeção)
    *   *Missão*: Passar a regex como argumento no `executeScript`.
5.  **#STEP-5**: [BatchScraper/index.js](file:///home/sant/extensaoUNIVESP/features/courses/import/services/BatchScraper/index.js)
    *   *Missão*: Replicar a refatoração para eliminar o código WET.

> [!NOTE]
> Não existem outros marcadores `#STEP` soltos no projeto; todos foram criados especificamente para guiar esta resolução.

---

### 🏁 Preparação Final (Git)
Antes de iniciar os #STEPs, salve seu progresso e crie seu ambiente de estudos:
```bash
git add .
git commit -m "fix(courses): adiciona teste de regressão e scaffold para o bug da semana de revisão"
git checkout -b fix/week-ordering-bug
```

---

### 🧪 Como testar seu progresso
```bash
npm run test tests/unit/features/courses/logic/WeekOrdering.test.js
```

> [!IMPORTANT]
> **//ISSUE-missing-revision-week**
> Use este termo de busca para encontrar dicas detalhadas do mentor próximas a cada **#STEP**.

> [!TIP]
> **Você sabia?** Essa técnica de usar comentários como `#STEP-N` ou tags específicas para guiar a resolução de um problema (BO) é chamada de **Marker-Driven Development (Desenvolvimento Baseado em Marcadores)** ou **Instructional Tagging**. É uma forma poderosa de manter o foco e garantir que nenhum detalhe seja esquecido durante uma refatoração complexa.

---

### 🎓 Papo de Engenheiro: O Dilema do Commit
Quando você tem um teste que **deve** falhar (TDD), mas um `pre-commit` que **exige** sucesso, você tem dois caminhos:

1.  **A Espada do `.skip` (O Nosso Caminho)**: Você marca o teste no código. É uma decisão explícita e documentada. O Git aceita e o Jest ignora. **Vantagem**: Segurança total.
2.  **O Escudo do `--no-verify`**: Você diz ao Git: *"Eu sei o que estou fazendo, não rode os scripts agora"*. **Vantagem**: Rapidez, não muda o código. **Risco**: Se tiver um erro de lint ou segurança, ele passa junto.

**Veredito**: Para quem está aprendendo a "Engenharia da Qualidade" como você, o `.skip` é o caminho do Mestre. Ele prova que você domina a ferramenta.

---
*Mentoria Prof. Antigravity | v2.9.1 Stabilizing*
