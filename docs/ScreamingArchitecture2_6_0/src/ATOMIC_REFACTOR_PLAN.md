# 🧪 Plano de Refatoração Atômica: "Uma Tela por Vez"

> *"Como comer um elefante? Um pedaço de cada vez."*

Este plano descreve como refatorar uma única tela (View) para a nova arquitetura, desacoplando-a totalmente do `sidepanel.js` antes de mover para a próxima.

## O Conceito "Host-Agnostic"

Hoje, nossas Views são **dependentes** do `sidepanel.js`. Elas esperam receber callbacks (`onNavigate`, `onAddBatch`).
Queremos que as Views sejam **autônomas**. Elas devem emitir eventos genéricos, e quem estiver ouvindo (o Host) decide o que fazer.

---

## Passo a Passo: Modularizando a `CoursesView`

Vamos usar a Tela de Cursos como piloto.

### 1. Criar a "Cápsula" (Feature Folder)
Em vez de esperar a migração total, criamos a estrutura *in-place* ou já no destino novo (recomendado).

Critério: `features/courses/`

### 2. Isolar Dependências (Injection)
Atualmente `CoursesView` instancia coisas ou usa globais.
*   **Ação:** Transformar dependências em `props` ou usar um `Context` simples.
*   **Meta:** O arquivo `CoursesView.js` não pode ter `import { Tabs }` se `Tabs` for um detalhe de infra. (Discutível, mas idealmente a UI só dispara `intent: openUrl`).

### 3. O Padrão "Container/Presenter"
Vamos quebrar `CoursesView.js` em dois:

1.  **`CoursesContainer.js` (Lógica)**: Reage aos eventos, chama o `CourseService`, gerencia o estado (Loading, Error, Data).
2.  **`CoursesList.js` (Visual)**: Recebe um array `courses` e desenha. Só HTML/CSS.

### 4. O Arquivo de Barreira (`index.js`)
Criaremos um arquivo que será a **única** coisa que o `sidepanel.js` enxerga.

```javascript
// features/courses/index.js
export { CoursesContainer as CoursesScreen } from './components/CoursesContainer';
export { setupCourseRoutes } from './routes';
```

### 5. A Troca (The Switch)
No `sidepanel.js`:

**Antes:**
```javascript
import { CoursesView } from './views/CoursesView.js';
const view = new CoursesView({ onAdd: ... });
```

**Depois:**
```javascript
import { CoursesScreen } from '../features/courses'; // Import limpo
const view = new CoursesScreen(); // Zero config se possível
// Comunicação via EventBus ou Props simplificadas
```

---

## Benefícios Desta Abordagem
1.  **Zero Risco Global:** Se a tela de Cursos quebrar refatorando, a tela de Settings continua funcionando 100%.
2.  **Paralelizável:** Um dev refatora Cursos, outro refatora Settings.
3.  **Testável:** Podemos testar `CoursesContainer` isolado num arquivo de teste unitário sem precisar subir o Chrome Extension inteiro.
