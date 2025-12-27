# Data & Repository Layers: Cursos

Este diretório e `../repository/` contêm a lógica de persistência para o Core de Cursos.

## 📄 Arquivos

### Data Layer (Courses)
*   **`CourseRepository.js`**: Acesso público (API) para manipulação de dados de cursos.
*   **`CourseStorage.js`**: Driver interno para `chrome.storage`.

### Repository Layer (Activity Progress) ✨ NEW
*   **`../repository/ActivityProgressRepository.js`**: CRUD para progresso de atividades (namespace separado).

---

## 🛠️ API Reference (`CourseRepository`)

Todas as operações são **Assíncronas** (Promises).

### Leitura

#### `loadItems(callback?)`
Retorna todos os cursos persistidos.
*   **Returns**: `Promise<Course[]>`
*   **Uso**:
    ```javascript
    const courses = await CourseRepository.loadItems();
    console.log(courses.length);
    ```

### Escrita

#### `add(name, url, weeks?, options?, callback?)`
Adiciona um único curso. Verifica duplicidade de URL antes de inserir.
*   **Params**:
    *   `name`: string
    *   `url`: string (Chave única lógica)
*   **Returns**: `Promise<void>` (Usa callback para sucesso/erro)

#### `addBatch(newItems, callback?)`
Adiciona múltiplos cursos de uma vez. Ideal para importação em massa.
*   **Otimização**: Realiza apenas **uma** operação de escrita no disco (`saveItems`) ao final.
*   **Params**: `newItems: Partial<Course>[]`

#### `update(id, updates, callback?)`
Atualiza propriedades parciais de um curso existente.
*   **Auto-Save**: Usado extensivamente para persistir `weeks` e `items` após scraping.
*   **Params**:
    *   `id`: number
    *   `updates`: Object (ex: `{ name: 'Novo Nome', weeks: [...] }`)

#### `delete(id, callback?)`
Remove um curso pelo ID.

#### `clear(callback?)`
⚠️ **Destrutivo**. Remove TODOS os cursos da base.

---

## 📊 API Reference (`ActivityProgressRepository`) ✨ NEW

**Namespace**: `chrome.storage.local.activityProgress`  
**Implementado**: 2025-12-24

Gerencia progresso de atividades de forma isolada dos dados de Course.

### CRUD Methods

#### `get(activityId)`
Busca progresso de uma atividade.
*   **Params**: `activityId: string` (formato: `courseId_weekId_taskId`)
*   **Returns**: `Promise<ActivityProgressData | null>`
*   **Uso**:
    ```javascript
    const progress = await ActivityProgressRepository.get('c1_week1_task1');
    if (progress && progress.status === 'DONE') { ... }
    ```

#### `getMany(activityIds)`
Busca múltiplos progressos de uma vez (batch - eficiente).
*   **Params**: `activityIds: string[]`
*   **Returns**: `Promise<Record<string, ActivityProgressData>>`
*   **Uso**:
    ```javascript
    const progressMap = await ActivityProgressRepository.getMany([
      'c1_week1_task1',
      'c1_week1_task2'
    ]);
    console.log(progressMap['c1_week1_task1']?.status);
    ```

#### `save(progress)`
Salva progresso de uma atividade.
*   **Params**: `progress: ActivityProgressData`
*   **Returns**: `Promise<void>`
*   **Uso**:
    ```javascript
    const progress = ActivityProgress.fromUserToggle('c1_week1_task1', true);
    await ActivityProgressRepository.save(progress);
    ```

#### `toggle(activityId)`
Alterna status TODO ↔ DONE (cria se não existir).
*   **Params**: `activityId: string`
*   **Returns**: `Promise<ActivityProgressData>`
*   **Uso**:
    ```javascript
    const updated = await ActivityProgressRepository.toggle('c1_week1_task1');
    console.log(updated.status); // 'DONE' ou 'TODO'
    ```

#### `delete(activityId)`
Remove progresso de uma atividade.
*   **Params**: `activityId: string`
*   **Returns**: `Promise<void>`

#### `clear()`
⚠️ **Destrutivo**. Remove TODOS os progressos.
*   **Returns**: `Promise<void>`

### ActivityProgress Model Helpers

Não acesse o Repository diretamente nas Views. Use `TaskProgressService`.

```javascript
// ✅ CORRETO (via Service)
await TaskProgressService.toggleTask(courseId, weekId, taskId);
const isCompleted = await TaskProgressService.isTaskCompleted(courseId, weekId, taskId);

// ❌ ERRADO (acesso direto)
await ActivityProgressRepository.toggle('c1_week1_task1');
```

---

## ⚠️ Notas para Desenvolvedores

1.  **Serialização Total**: O Chrome Storage limita a taxa de escritas. Evite chamar `saveItems` em loops rápidos. Prefira montar o array em memória e salvar uma vez.
2.  **Single Source of Truth**: Não mantenha cópias de cursos em variáveis globais. Sempre que precisar de dados frescos, chame `loadItems()` ou confie no dado passado pela View.
3.  **Tratamento de Erros**: O repositório captura erros de I/O (`try/catch`) e loga no console (`console.error`). Em caso de falha de leitura, retorna array vazio `[]` para não quebrar a UI.
4.  **Separation of Concerns**: ✨ **Progresso agora está separado de Course data**. Use `ActivityProgressRepository` para tracking de progresso, `CourseRepository` apenas para dados estruturais (nome, URL, weeks).
5.  **Namespace Isolado**: Progress usa `activityProgress` key, Courses usa `courses` key. Não há colisão.

---

**Última atualização**: 2025-12-24
