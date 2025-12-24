# Estudo: CRUD e Persistência em Extensões (Case: ExtensionUNIVESP)

Este documento explora como as operações de **CRUD** (Create, Read, Update, Delete) são arquitetadas em uma extensão Chrome que segue o princípio *Local-First*.

---

## 1. O Desafio da Persistência no Front-end

Diferente de sistemas com Banco de Dados SQL (MySQL, Postgres), aqui não temos tabelas, colunas ou queries complexas (`SELECT * WHERE...`).

Temos apenas **Storage Chave-Valor** (`Key-Value`).
*   **O Banco**: `chrome.storage.local` (Assíncrono, cabe ~5MB ou mais).
*   **O Formato**: JSON serializado.

Isso significa que todo CRUD aqui na verdade é uma manipulação de Array em memória que é "dumpada" para o disco.

---

## 2. Anatomia do CRUD (Courses - Core)

Vamos dissecar o fluxo de dados principal da aplicação: **Gerenciamento de Matérias**.

### 2.1 Fluxo de CREATE (Adicionar Matéria)

Não fazemos `INSERT INTO courses`. O fluxo é:
1.  **Load**: O Repositório lê *todo* o JSON do disco para a memória.
    *   `[A, B]`
2.  **Appenda**: O Repositório valida e adiciona o novo item na memória.
    *   `[A, B, C]`
3.  **Save**: O Repositório sobrescreve *todo* o JSON no disco com o novo array.
    *   `storage.set({ courses: [A, B, C] })`

> **Lição**: Operações de escrita são custosas (I/O). Por isso usamos `addBatch` para importações em massa, para salvar apenas uma vez no final.

### 2.2 Fluxo de READ (Ler Matérias)

1.  **Storage**: Pede ao Chrome "me dá a chave 'courses'".
2.  **Deserialização**: O Chrome devolve o objeto JS.
3.  **Hidratação**: O Repository pode (opcionalmente) transformar esses dados em classes, mas aqui usamos POJOs (Plain Objects) por performance.

### 2.3 Fluxo de UPDATE (Atualizar Progresso)

Este é o ponto mais delicado.
Para mudar **1 tarefa** de "TODO" para "DONE":
1.  Carregamos todos os cursos.
2.  Encontramos o curso X. e a semana Y.
3.  Alteramos o item na memória.
4.  Salvamos **toda a lista de cursos** de volta.

> **Nota de Arquitetura**: Isso será refatorado em breve para `TaskProgressService` para tornar essa operação mais eficiente e isolada.

---

## 3. Padrões Envolvidos

| Conceito | Implementação no Projeto |
| :--- | :--- |
| **DAO / Repository** | `CourseRepository.js`. Isola a lógica de "array push/filter" da View. |
| **Driver** | `CourseStorage.js`. Sabe falar com `chrome.storage`. |
| **DTO (Data Transfer)** | Os objetos JSON passados entre as camadas. |

---

## 4. Comparativo: Core vs Infra

Nem todo CRUD é igual.

| Feature | Courses (Core) | Settings (Infra) |
| :--- | :--- | :--- |
| **Storage** | `chrome.storage.local` | `chrome.storage.sync` (Cloud) |
| **Natureza** | Assíncrono (Promise) | Assíncrono (Promise) |
| **Complexidade** | Alta (Repository Pattern) | Baixa (Acesso direto na View) |
| **Motivo** | Volume de dados | Sincronização entre dispositivos |

---

## 5. Conclusão para o Estudante

Em aplicações *Client-Side* sem Backend:
1.  O "Banco de Dados" é apenas um arquivo JSON glorificado.
2.  O **Repository Pattern** é vital para não espalhar lógica de manipulação de array (`.push`, `.filter`, `.map`) pelas telas.
3.  Sempre pense no custo de serialização: ler e gravar tudo a cada clique pode ser lento se o dataset crescer muito.
