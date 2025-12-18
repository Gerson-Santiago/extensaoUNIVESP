# Changelog - Versão Beta

## [2.6.1] - 2025-12-18
### Arquitetura & Limpeza
- **Conclusão da Migração**: View `Settings`, `Home` e `Feedback` movidas para suas respectivas pastas em `features/`.
- **Limpeza**: Remoção definitiva das pastas legadas `sidepanel/views` e `sidepanel/logic`.
- **Qualidade**: Ajuste de todos os testes de integração para refletir a nova estrutura de pastas.

## [2.6.0] - 2025-12-18
### Arquitetura (Screaming Architecture)
- **Features Isoladas**: Implementação completa da Screaming Architecture. O código agora grita o que faz (`features/courses`, `features/import`).
- **Refatoração Core (Cursos)**: Migração total da feature "Cursos" para domínio isolado.
    - `UI`: Componentes React-like (`CoursesList`, `CourseDetailsView`) movidos para `features/courses/components`.
    - `Data`: Repositório totalmente assíncrono (`CourseRepository`) e Driver de Storage (`CourseStorage`) em `features/courses/data`.
    - **Performance**: Eliminação total de callbacks ("Callback Hell") em favor de `async/await`.

### Feature Importação (Refatoração)
- **Separação de Modais**: Divisão do fluxo de importação em dois estágios para maior estabilidade:
    - `LoginWaitModal`: Interface passiva que aguarda o login do usuário.
    - `BatchImportModal`: Focado exclusivamente na seleção e importação, sem lógica de navegação.
- **Orquestrador de Importação**: Novo serviço `BatchImportFlow` que gerencia a decisão de qual modal exibir.

### UX
- **Smart Switch**: Detecção inteligente de abas do AVA já abertas.
- **Zero Redirect Loop**: Correção definitiva dos loops de redirecionamento.
- **Unificação**: Botão "Importar em Lote" das Configurações agora usa o mesmo fluxo seguro da tela de Cursos.

## [2.5.4] - 2025-12-15
### Refatoração
- **Gerenciamento de Abas Centralizado**: Refatoração completa da lógica de manipulação de abas, movendo toda a responsabilidade para a classe `Tabs.js`.
    - Eliminado código duplicado em `BrowserUtils`, `CourseService`, `CourseDetailsView` e `BatchImportModal`.
    - Substituída a lógica frágil de `chrome.tabs.query` espalhada pelo código por métodos robustos e testáveis (`Tabs.getCurrentTab`, `Tabs.openOrSwitchTo`).
- **Limpeza de Código**: Remoção de logs de debug e métodos obsoletos em `BrowserUtils.js`.

### Correções
- **Testes**: Correção de erros de sintaxe em `SettingsView.js` e mocks obsoletos em testes de integração, garantindo que a suíte de testes (16 testes) passe integralmente.

### Documentação
- **Regras de Negócio**: Criação de `docs/regras-de-negocio.md` detalhando o funcionamento funcional dos módulos `Tabs`, `Scraper` e `Storage`, conforme padrões de projetos Open Source.

## [2.5.3] - 2025-12-13
### Infraestrutura
- **Automação de Qualidade**: Implementação do Husky e lint-staged. Agora, lint e formatação são verificados e corrigidos automaticamente a cada commit, garantindo padronização do código fonte.
- **Limpeza**: Remoção de código legado (`onManualAdd`) e atualização de testes de integração para refletir a estrutura atual da UI.

## [2.5.2] - 2025-12-13
### UI/UX
- **Ajuste Fino de Interface**: Reversão do layout de configurações para manter botões de ação (Remover Tudo, Feedback) no corpo da página, melhorando a acessibilidade e visibilidade conforme preferência do usuário.
- **Menu Genérico**: Manutenção do componente `ActionMenu` para uso exclusivo na view de Cursos.

## [2.5.1] - 2025-12-13
### UI
- **ActionMenu Genérico**: Implementação de componente reutilizável de menu.

## [2.5.0] - 2025-12-13
### UI
- **Dropdown de Ações Rápidas**: Adicionado menu flutuante em "Minhas Matérias".

## [2.4.1] - 2025-12-13
### Novas Funcionalidades
- **Adição Manual Aprimorada**: Agora é possível selecionar o Ano, Semestre e Bimestre ao adicionar cursos manualmente, garantindo que eles sejam agrupados corretamente na lista.
- **Opções no Storage**: A função `addItem` agora aceita um objeto de opções para metadados adicionais.

## [2.4.0] - 2025-12-13
### Novas Funcionalidades
- **Agrupamento Inteligente de Cursos**: Visualize suas matérias organizadas por bimestre (ex: 2025/2 - 4º Bimestre) na aba "Minhas Matérias".
- **Visualização Hierárquica**: Nova interface visual com cabeçalhos claros separando os períodos letivos.
- **Ordenação Automática**: Matérias mais recentes aparecem automaticamente no topo.

### Engenharia de Dados
- **Persistência de Metadados**: Reformulação do sistema de armazenamento (`storage.js`) para salvar tags de agrupamento (`termName`) permanentemente.
- **Parsers Centralizados**: Criação de `termParser.js` e `courseGrouper.js` para garantir consistência lógica em toda a extensão.


> 🔄 **Histórico Completo**: Versões anteriores foram arquivadas. Consulte o [Histórico Detalhado](./docs/CHANGELOG_ARCHIVE.md).

