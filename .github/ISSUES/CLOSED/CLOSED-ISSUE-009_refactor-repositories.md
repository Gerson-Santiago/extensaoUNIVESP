# ISSUE-09: Refatoração de Repositórios (v2.9.5)

**Status**: Concluído (v2.9.5)
**Data**: 31/12/2025
**Responsável**: IA

## 1. O Problema (What had to be done)
A arquitetura do projeto apresentava redundâncias e violações de princípios de *Screaming Architecture*, acumuladas durante o desenvolvimento rápido.

### Pontos Identificados:
1.  **Redundância de Pastas**: `features/courses` continha `data/`, `repositories/` e `repositories-progress/`. A separação não era clara.
2.  **Violação de Camadas**: O `sidepanel.js` (View/Entrypoint) importava diretamente `CourseRepository` (Data Layer), pulando a Camada de Serviço (`CourseService`).
3.  **Localização de Testes**: Testes de repositório estavam misturados ou mal localizados.
4.  **Limpeza**: Necessidade de remover código morto e arquivos órfãos após as migrações.

## 2. A Solução (What was done)
Executamos uma refatoração "Green-Green" (mantendo os testes passando) focada na estrutura de arquivos.

### Implementação:
1.  **Unificamos Repositórios**:
    *   `features/courses/data/CourseRepository.js` -> `features/courses/repositories/CourseRepository.js`
    *   `features/courses/data/CourseStorage.js` -> `features/courses/repositories/CourseStorage.js`
    *   `features/courses/repositories-progress/ActivityProgressRepository.js` -> `features/courses/repositories/ActivityProgressRepository.js`
    *   Deletamos as pastas vazias `data/` e `repositories-progress/`.

2.  **Correção de Camadas (Sidepanel)**:
    *   Removemos o import direto de `CourseRepository` no `sidepanel.js`.
    *   Implementamos o método `clearAll()` no `CourseService`.
    *   O Sidepanel agora chama `courseService.clearAll()`.

3.  **Reorganização de Testes**:
    *   Movemos `features/courses/tests/CourseRepository/` para `features/courses/tests/repositories/CourseRepository/`.
    *   Atualizamos todos os imports (`../../data/...` para `../../repositories/...`).

4.  **Consistência de Documentação**:
    *   Atualizamos `README.md` de `repositories`.
    *   Atualizamos referencias em `tests`.

## 3. Resultados
- **Testes**: 206 testes passando em `features/courses` (Regressão garantida).
- **Lint**: Zero warnings.
- **Arquitetura**: Estrutura de pastas agora reflete claramente o domínio:
    - `components/`
    - `logic/`
    - `models/`
    - `repositories/` (Dados unificados)
    - `services/`
    - `views/`

## 4. Próximos Passos (ISSUE-10?)
- Continuar auditoria na sub-feature `import`.
- Verificar colocation de testes unitários (mover para `__tests__` local?).

## 🔗 GitHub Issue

- **Status:** N/A  
- **Link:** Issue local concluída
- **Data:** -

---

