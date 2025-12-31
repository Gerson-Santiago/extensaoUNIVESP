# ♻️ Shared (Reutilizáveis)

> **Regra de Ouro**: "Write Once, Use Everywhere."

A pasta `shared/` contém código **genérico** e **reutilizável** que não é específico de uma única regra de negócio (Feature).

---

## 🏗️ Estrutura

| Pasta | Definição | Exemplos Atuais |
|:---|:---|:---|
| **`ui/`** | Componentes visuais "burros" (sem lógica de negócio) | `Modal.js`, `ActionMenu.js`, `Toaster.js` |
| **`logic/`** | Lógica pura agnóstica de domínio | `AutoScroll.js` |
| **`utils/`** | Wrappers técnicos e helpers de baixo nível | `BrowserUtils.js`, `Tabs.js` |
| **`services/`** | Infraestrutura técnica (Loggers, EventBus, Wrappers) | `NavigationService.js` |
| **`models/`** | Definições de Tipos (JSDoc/Types) de UI/Utils | `ActionMenu.js` |

---

## 🚦 Algoritmo de Decisão: "Devo colocar em Shared?"

Siga este fluxograma mental antes de criar um arquivo aqui:

### 1. "Isso contém Regra de Negócio Acadêmica?"
- ✅ **Sim** (ex: Calcular média, Agrupar matérias) 
    - 🛑 **PARE!** Isso pertence a uma **Feature** (`courses`, `grades`).
- ❌ **Não** (ex: Formatar data, Abrir Modal)
    - 🟢 **SIGA**.

### 2. "Isso é usado por DUAS ou mais features?"
- ✅ **Sim** (ex: Home e Config usam o mesmo botão)
    - 🚀 **BEM-VINDO AO SHARED!**
- ❌ **Não** (ex: Só `courses` usa esse card específico)
    - ⚠️ **ATENÇÃO**. Coloque dentro de `features/courses/components/` primeiro. Mova para cá *apenas se* outra feature precisar no futuro (YAGNI).

---

## 📝 Documentação dos Módulos

### `shared/ui/`
Componentes visuais agnósticos.
- **State**: Devem ser controlados via props ou métodos (ex: `modal.open()`).
- **Estilo**: Devem ter CSS isolado ou usar classes utilitárias globais.
- **Dependências**: Não importam nada de `features/`.

### `shared/logic/`
Helpers de lógica que podem ser testados unitariamente sem DOM complexo.
- Exemplo: `AutoScroll.js` (Lógica de scroll infinito genérica).

### `shared/utils/`
Wrappers para APIs do sistema ou navegador.
- **Objetivo**: Evitar chamar `chrome.tabs.*` ou `document.querySelector` diretamente em todo lugar.
- Exemplo: `BrowserUtils.js` (Abstração de APIs do Chrome).

---
> **Dica**: Se você está importando algo de `features/` para dentro de `shared/`, você criou uma **dependência circular**. Isso é proibido. 🚫
