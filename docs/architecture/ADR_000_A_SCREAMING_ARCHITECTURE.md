# ADR 000-A: Screaming Architecture
**Status:** Aceito (v2.6.0) | **Data:** 2025-12-18

### Contexto
Estrutura tática (MVC) escondia a intenção do negócio e dificultava o onboarding.

### Decisão
Organizar codebase por **Features** (Casos de Uso):
- **Gritos de Intenção**: Pastas como `features/courses` e `features/import`.
- **Colocation**: UI, Lógica e Testes residem na mesma pasta da funcionalidade.
- **CCP**: Coisas que mudam juntas ficam juntas.

### Consequências
- ✅ Onboarding instantâneo e baixo acoplamento.
- ⚠️ Requer disciplina contra "lixo" na pasta `shared/`.
