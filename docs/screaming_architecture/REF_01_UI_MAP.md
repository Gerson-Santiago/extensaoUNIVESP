> Status: Active
> Last Update: 2025-12-20
> Owner: Gerson Santiago

# 🗺️ Mapa de UI e Navegação

Este documento mapeia a interface atual para guiar a refatoração modular.

## 🧠 Definições do Sistema

Para refatorar, precisamos concordar com estas definições:

1.  **Tela Completa (View)**:
    *   Ocupa toda a área útil do Side Panel (exceto TopNav/BottomNav).
    *   Tem uma rota associada no `MainLayout` (ex: `layout.navigateTo('courses')`).
    *   Exemplo: "Meus Cursos", "Configurações".

2.  **Modal**:
    *   Sobrepõe a Tela Completa atual.
    *   Foca em uma tarefa curta e interruptiva.
    *   Não muda a URL/Rota principal.
    *   Exemplo: "Adicionar Curso Manualmente", "Aguardando Login".

3.  **Atalho (Action/Trigger)**:
    *   O botão ou link que dispara a troca de tela ou abertura de modal.
    *   Pode estar na Navigation Bar ou dentro de um `ActionMenu`.

---

## 📦 Inventário de Componentes (O que temos hoje)

### 1. Telas Completas (Views)

> **Nota (v2.6.1)**: Todos os caminhos abaixo foram migrados para `features/`.

| View ID | Novo Caminho (Features) | Responsabilidade | Gatilho Principal |
| :--- | :--- | :--- | :--- |
| `home` | `features/home/ui/HomeView.js` | Landing Page / Boas Vindas | Início do App |
| `courses` | `features/courses/views/CoursesView/index.js` | Lista de Matérias do Aluno | Tab "Cursos" (BottomNav) |
| `settings` | `features/settings/ui/SettingsView.js` | Configurações Gerais | Tab "Config" (BottomNav) |
| `courseDetails` | `features/courses/views/CourseDetails/index.js` | Detalhes de uma matéria (delegação para `CourseRefresher`) | Clique em um Card de Curso |
| `feedback` | `features/feedback/ui/FeedbackView.js` | Enviar feedback/Bug report | Botão em Settings |

### 2. Modais

| Modal Name | Arquivo Atual | Responsabilidade | Gatilho |
| :--- | :--- | :--- | :--- |
| `BatchImportModal` | `features/courses/import/components/BatchImportModal.js` | Importar várias matérias do AVA | Botão "Importar" (Courses) |
| `AddManualModal` | `features/courses/components/AddManualModal/index.js` | Adicionar matéria manualmente | Menu Ações > "Manual" |
| `LoginWaitModal` | `features/session/components/LoginWaitModal.js` | Bloqueia tela enquanto loga no AVA | Callback do BatchImport |

### 3. Menus e Atalhos

*   **ActionMenu (`components/Shared/ActionMenu.js`)**:
    *   Usado em `CoursesView` (canto superior direito).
    *   Contém: "Importar do AVA", "Adicionar Manual", "Adicionar Página Atual".

---

## 🏗️ Estratégia de Modularização (Atomic Refactoring)

O objetivo é pegar **uma linha** da tabela acima e transformar em uma pasta autossuficiente em `features/`.

### Exemplo: Refatorando a "Tela de Cursos" (`courses`)

Hoje, `CoursesView.js` depende de `CourseService.js` e `ActionMenu.js`.
Na nova arquitetura, teremos a pasta `features/courses/`:

```
features/courses/
├── components/
│   ├── CourseList.js       # A lista visual (UI Pura)
│   ├── CourseCard.js       # Item individual (UI Pura)
│   └── CoursesLayout.js    # O Container (Substitui A View atual)
├── logic/
│   ├── CourseController.js # Lógica de 'Load', 'Delete'
│   └── navigation.js       # Quem define para onde vai o clique
└── index.js                # O ponto de entrada (Exporta a View Pronta)
```

**Regra de Ouro:** O arquivo `sidepanel.js` (o Host) não deve importar `CourseCard.js`. Ele deve importar apenas `features/courses/index.js` e renderizá-lo.
