# ADR 008: Unificação dos Repositórios de Cursos
**Status:** Aceito (Implementado na v2.9.5) | **Data:** 31/12/2025

### Contexto
Durante o crescimento da feature `courses`, a camada de dados fragmentou-se (`data/`, `repositories/`, `repositories-progress/`), gerando confusão e violações de acesso por camadas (Sidepanel acessando Repositório).

### Decisão
**Unificação Canônica**: Centralizar toda persistência em `features/courses/repositories/`.
- **Fusão**: `data` + `repositories-progress` -> `repositories`.
- **Encapsulamento**: Entrypoints devem usar `CourseService`, nunca Repositories diretamente.
- **Padronização**: Imports sempre via `../repositories/NomeRepository.js`.

### Consequências

### Positivas
*   **Simplicidade**: "Single Source of Truth" para infraestrutura de dados da feature. Se é acesso a dados, está em `repositories/`.
*   **Coesão**: Facilita a visualização do acoplamento entre dados de cursos e dados de progresso.
*   **Manutenibilidade**: Reduz a carga cognitiva ao navegar na estrutura de pastas.
*   **Alinhamento**: Segue padrões de frameworks modernos e Clean Architecture (Camada de Interface/Gateway unificada).

### Negativas / Riscos
*   **Quebra de Links**: Mudança de caminhos relativo quebrou imports em múltiplos arquivos (corrigido na v2.9.5).
*   **Histórico Git**: Movimentação excessiva pode dificultar `git blame` se não feita com cuidado (mitigado usando `git mv`).

## Status de Implementação
*   [x] Unificação realizada na release **v2.9.5**.
*   [x] Imports corrigidos.
*   [x] Testes de regressão passando.
