# 🗺️ Screaming Architecture: O Mapa Completo (Macro View)

Este documento define o destino final de **CADA ARQUIVO** do projeto. O objetivo é garantir que o "Piloto" da Importação não seja uma ilha isolada, mas a primeira peça de um plano coerente.

---

## 🏗️ 1. O Novo Core (A Fundação)
Arquivos que não são de nenhuma feature específica, são do Sistema.

| Arquivo Original | Novo Destino | Responsabilidade |
| :--- | :--- | :--- |
| `shared/utils/Tabs.js` | `core/browser/Tabs.js` | Manipulação de Abas |
| `shared/utils/Storage.js` | `core/storage/Storage.js` | Persistência Local |
| `sidepanel/sidepanel.js` | `core/main.js` | Ponto de Entrada (Boot) |
| `sidepanel/styles/layout.css` | `core/ui/layout.css` | Estrutura Base |
| `sidepanel/sidepanel.html` | `core/ui/index.html` | Casca HTML |

---

## ⚡ 2. Features (O Negócio)
Cada arquivo de negócio deve ir para uma dessas 4 casas.

### 📦 A. Features/Import (Piloto)
| Arquivo Original | Novo Destino |
| :--- | :--- |
| `sidepanel/services/BatchImportFlow.js` | `features/import/logic/BatchImportFlow.js` |
| `sidepanel/logic/batchScraper.js` | `features/import/services/BatchScraper.js` |
| `sidepanel/components/Modals/BatchImportModal.js` | `features/import/components/BatchImportModal.js` |

### 🎓 B. Features/Courses (O Coração)
| Arquivo Original | Novo Destino |
| :--- | :--- |
| `sidepanel/views/CoursesView.js` | `features/courses/components/CourseList.js` |
| `sidepanel/views/CourseDetailsView.js` | `features/courses/components/CourseDetails.js` |
| `sidepanel/services/CourseService.js` | `features/courses/services/CourseService.js` |
| `sidepanel/services/ScraperService.js` | `features/courses/services/GradeScraper.js` |
| `sidepanel/components/Items/CourseItem.js` | `features/courses/components/CourseItem.js` |
| `sidepanel/components/Items/WeekItem.js` | `features/courses/components/WeekItem.js` |
| `sidepanel/utils/termParser.js` | `features/courses/logic/TermParser.js` |

### 🛂 C. Features/Session (Suporte à Sessão)
> **Nota**: Não é um sistema de login próprio. Dependemos do login no SEI/AVA.
| Arquivo Original | Novo Destino |
| :--- | :--- |
| `sidepanel/logic/raManager.js` | `features/session/logic/SessionManager.js` |

### ⚙️ D. Features/Settings (Configurações)
| Arquivo Original | Novo Destino |
| :--- | :--- |
| `sidepanel/views/SettingsView.js` | `features/settings/components/SettingsPage.js` |
| `sidepanel/logic/domainManager.js` | `features/settings/logic/DomainManager.js` |

---

## 🧩 3. Shared (O Lego)
Código reutilizável e sem regras de negócio complexas.

| Arquivo Original | Novo Destino |
| :--- | :--- |
| `sidepanel/components/Shared/ActionMenu.js` | `shared/ui/ActionMenu.js` |
| `sidepanel/components/Modals/Modal.js` | `shared/ui/Modal.js` |
| `shared/logic/AutoScroll.js` | `shared/logic/AutoScroll.js` |

---

## 🚦 Status da Migração

1.  **[ ] Features/Import**: Pronta para mover (Plano Piloto).
2.  **[ ] Features/Auth**: Fácil (1 arquivo).
3.  **[ ] Features/Settings**: Médio.
4.  **[ ] Features/Courses**: Complexo (Muitas dependências).

**Estratégia**: Executamos o **Piloto de Importação** primeiro porque ele é *autocontido*. Ele valida a estrutura de pastas e os testes sem explodir a complexidade de `Courses`.
