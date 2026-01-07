# CWS Permission Justification - Central Univesp

This document provides justifications for the permissions requested by the extension in `manifest.json`, as required by the Chrome Web Store Single Purpose and Privacy policies.

## 🛡️ Required Permissions

### 1. `storage`
*   **EN:** Required to store and persist course data, activities, and user progress locally. This enables the core functionality of tracking "completed" activities without an external backend.
*   **PT-BR:** Necessária para armazenar e persistir dados de cursos, atividades e progresso do aluno localmente. Permite a funcionalidade principal de rastreamento de conclusão sem depender de um servidor externo.

### 2. `sidePanel`
*   **EN:** Used to provide a persistent interface for contextual navigation through course weeks, improving productivity without interrupting the student's focus on the main content.
*   **PT-BR:** Usada para fornecer uma interface persistente de navegação contextual pelas semanas do curso, melhorando a produtividade sem interromper o foco do aluno no conteúdo principal.

### 3. `scripting`
*   **EN:** Used to execute academic scraping logic within the UNIVESP Virtual Learning Environment (VLE) and to automate student protocol forms in the SEI system.
*   **PT-BR:** Usada para executar a lógica de raspagem acadêmica dentro do AVA UNIVESP e para automatizar o preenchimento de protocolos estudantis no sistema SEI.

### 4. `activeTab`
*   **EN:** Allows the extension to interact with the currently focused tab when the user explicitly interacts with the extension (e.g., clicking on specific contextual navigation chips).
*   **PT-BR:** Permite que a extensão interaja com a aba focada no momento da interação explícita do usuário (ex: ao clicar em chips de navegação contextual).

### 5. `downloads`
*   **EN:** Exclusively used for the "Data Backup" feature, allowing students to export their recorded academic progress into a JSON file for data sovereignty and safety.
*   **PT-BR:** Usada exclusivamente para a funcionalidade de "Backup de Dados", permitindo que os alunos exportem seu progresso acadêmico registrado em um arquivo JSON para segurança e soberania de dados.

## 🌐 Host Permissions

### `https://ava.univesp.br/*`
*   **EN:** Core academic environment. Used for scraping activity lists and week structures.
*   **PT-BR:** Ambiente acadêmico principal. Usada para raspagem da lista de atividades e estruturas de semanas.

### `https://sei.univesp.br/*`
*   **EN:** Official administrative system for student protocols (enrollment, requests). Used for academic productivity automation (autofill).
*   **PT-BR:** Sistema administrativo oficial para protocolos estudantis. Usada para automação de produtividade acadêmica (autopreenchimento).

---

## 🚫 Dropped Permissions (Redução de Escopo)

### `tabs` (Removida / Removed)
*   **Decision:** We removed the broad `tabs` permission to respect user privacy. We now only query tabs belonging to the UNIVESP domains already covered by `host_permissions`.
*   **PT-BR:** Removemos a permissão ampla `tabs` para respeitar a privacidade do usuário. Agora consultamos apenas abas pertencentes aos domínios UNIVESP já cobertos pelas `host_permissions`.
