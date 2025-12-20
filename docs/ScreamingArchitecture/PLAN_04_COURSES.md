> **Status**: Concluído (Dez/2025) - v2.6.3
> **Nota**: Este plano foi executado.
> **Legado**: Consulte `TECNOLOGIAS_E_ARQUITETURA.md`.

# 🗺️ Plano Detalhado: Feature Cursos (O Coração)

A feature `courses` é o núcleo da extensão. Ela gerencia a listagem, persistência, agrupamento e adição de matérias.

> **Objetivo**: Centralizar toda a lógica de cursos em `features/courses/`, desacoplando-a do `sidepanel` e separando View, Logic e Data.

---

## 1. Árvore de Diretórios Final

```text
extensaoUNIVESP/
├── features/
│   └── courses/
│       ├── components/
│       │   ├── CoursesList.js       # (Era CoursesView.js)
│       │   └── CourseItem.js        # (Vem de sidepanel/components/Items)
│       ├── logic/
│       │   ├── CourseService.js     # (Era sidepanel/services/CourseService.js)
│       │   ├── AutoScroll.js        # 🆕 (Extraído de CoursesView handleAutoScroll)
│       │   ├── CourseGrouper.js     # (Era utils/courseGrouper.js)
│       │   └── TermParser.js        # (Era utils/termParser.js)
│       ├── data/
│       │   └── CourseRepository.js  # (Era repositories/CourseRepository.js)
│       ├── services/
│       │   └── ScraperService.js    # (Era services/ScraperService.js)
│       └── tests/
│           ├── CourseRepository.test.js
│           ├── AutoScroll.test.js
│           ├── Scraper.test.js
│           └── ...
```

---

## 2. Movimentação Completa

### A. Core Components & Logic
| Arquivo Original | Novo Destino | Notas |
| :--- | :--- | :--- |
| `sidepanel/views/CoursesView.js` | `features/courses/components/CoursesList.js` | **Renomeado**. Extrair AutoScroll. |
| `sidepanel/services/CourseService.js` | `features/courses/logic/CourseService.js` | - |
| `sidepanel/services/ScraperService.js` | `features/courses/services/ScraperService.js` | - |
| `sidepanel/data/repositories/CourseRepository.js` | `features/courses/data/CourseRepository.js` | **Critical**: Usado por Import. |

### B. Domain Utilities (Screaming Logic)
Estes arquivos são "Negócio de Cursos", não utilitários genéricos.
| Arquivo Original | Novo Destino |
| :--- | :--- |
| `sidepanel/utils/courseGrouper.js` | `features/courses/logic/CourseGrouper.js` |
| `sidepanel/utils/termParser.js` | `features/courses/logic/TermParser.js` |
| `sidepanel/components/Items/CourseItem.js` | `features/courses/components/CourseItem.js` |
| `sidepanel/components/Items/WeekItem.js` | `features/courses/components/WeekItem.js` |

### C. Testes (Colocation)
| Arquivo Original | Novo Destino |
| :--- | :--- |
| `tests/storage.test.js` | `features/courses/tests/CourseRepository.test.js` |
| `tests/logic/AutoScroll.test.js` | `features/courses/tests/AutoScroll.test.js` |
| `tests/utils/courseGrouper.test.js` | `features/courses/tests/CourseGrouper.test.js` |
| `tests/utils/termParser.test.js` | `features/courses/tests/TermParser.test.js` |
| `tests/integration/addCourse.integration.test.js` | `features/courses/tests/AddCourse.test.js` |

---

## 3. Refatoração Específica: AutoScroll
O método `handleAutoScroll()` dentro de `CoursesView.js` é enorme e contém lógica de injeção de script.
*   **Ação**: Extrair para `features/courses/logic/AutoScroll.js`.
*   **Benefício**: View fica limpa (só renderiza), Lógica fica testável isoladamente.

## 4. Dependência Cruzada e Arquitetura (ADR)

### P: Por que `CourseRepository` não vai para `shared/`?
O `CourseRepository` é usado pela feature de Importação, o que gera a dúvida: *"Se é compartilhado, não deveria estar em shared?"*.

**Resposta**: Não. Na Screaming Architecture:
1.  **Ownership**: O Repositório encapsula regras de negócio (ex: validação de curso, estrutura de dados). Isso pertence ao **Domínio Cursos**.
2.  **Dependência Unidirecional**: A feature Import existe *para servir* a feature Cursos. É natural que `Import` dependa de `Courses`.
    *   ✅ `Import` -> `Courses` (Importa dados PARA cursos).
    *   ❌ `Courses` -> `Import` (Cursos não deve saber como foi importado).
3.  **Shared**: Reservado para coisas que **não têm domínio específico** (ex: `Tabs.js`, `StorageDriver`, `Logger`).

Portanto, manteremos em `features/courses/data` e faremos a Importação apontar para lá.

## 5. Passos (Ordem Segura)
1.  **Infra**: Criar pastas.
2.  **Move Utils/Logic**: Mover parsers e groupers (fáceis).
3.  **Move Data**: Mover Repository (Critical). Corrigir imports globais.
4.  **Move Services**: Mover Scraper e CourseService.
5.  **Extract AutoScroll**: Separar lógica da View.
6.  **Move View**: Mover CoursesView -> CoursesList.
7.  **Verificar**: `npm test`.
