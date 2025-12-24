# Data Layer: Cursos

Este diretório contém a lógica de persistência para o Core de Cursos.

## 📄 Arquivos

*   **`CourseRepository.js`**: Acesso público (API) para manipulação de dados.
*   **`CourseStorage.js`**: Driver interno para `chrome.storage`.

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
*   **Params**:
    *   `id`: number
    *   `updates`: Object (ex: `{ name: 'Novo Nome' }`)

#### `delete(id, callback?)`
Remove um curso pelo ID.

#### `clear(callback?)`
⚠️ **Destrutivo**. Remove TODOS os cursos da base.

---

## ⚠️ Notas para Desenvolvedores

1.  **Serialização Total**: O Chrome Storage limita a taxa de escritas. Evite chamar `saveItems` em loops rápidos. Prefira montar o array em memória e salvar uma vez.
2.  **Single Source of Truth**: Não mantenha cópias de cursos em variáveis globais. Sempre que precisar de dados frescos, chame `loadItems()` ou confie no dado passado pela View.
3.  **Tratamento de Erros**: O repositório captura erros de I/O (`try/catch`) e loga no console (`console.error`). Em caso de falha de leitura, retorna array vazio `[]` para não quebrar a UI.
