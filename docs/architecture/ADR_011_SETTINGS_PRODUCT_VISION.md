# ADR 011: Visão de Produto e Design System para Configurações

**Status:** Aceito (v2.10.x) | **Data:** 2025-12-31
**Autor:** IA do Projeto & USER

---

## CONTEXTO

Para que a extensão UNIVESP transcenda de uma ferramenta técnica para um **Produto Maduro**, as configurações devem deixar de ser uma lista ad-hoc de campos e passar a seguir uma hierarquia de produto profissional. 

## DECISÃO

Adotamos a estrutura de **4 Blocos Universais** e a arquitetura **State-First (Config = Estado)** como padrão obrigatório para a `features/settings`.

### 1. Estrutura de Conteúdo (Os 4 Blocos)

Todo e qualquer ajuste deve ser classificado em um destes blocos:
1.  **Preferências do Usuário**: Estética, densidade visual, idiomas, animações. (Não alteram o comportamento lógico).
2.  **Comportamento da Aplicação**: Ajustes de fluxo ("Como funciona"). Ex: Auto-Pin, Automação sob demanda, Intervalos de refresh.
3.  **Permissões e Privacidade**: Backup (Export/Import), Reset de Dados, Informações de Local-First.
4.  **Sobre / Diagnóstico**: Versão, Links de Suporte (GitHub/Bugs), Toggles de Log de Debug.

### 2. Padrão Estético e Design System (Settings UI)

A interface deve seguir uma semântica visual estrita para reduzir a carga cognitiva, com foco total no **Isolamento de Erros**.

*   **Botões de Ação (Primary)**: Azul Univesp (#004b8d). Usados para "Salvar", "Exportar", "Atualizar".
*   **Botões de Suporte (Secondary)**: Cinza (#6c757d). Usados para "Feedback", "Github", "Sobre".
*   **Danger Zone (Isolamento de Segurança Padrão GitHub)**: 
    *   **Isolamento Físico**: Deve ser a última seção da página, separada por um espaçamento generoso e possivelmente uma linha divisória.
    *   **Identidade Visual**: Um container com borda sólida ou tracejada vermelha (`#d9534f`), destacando o perigo.
    *   **Botão Destrutivo**: Vermelho sólido. 
    *   **Barreira de Confirmação**: Ações nesta zona não podem ser feitas em um único clique. Exigência de um modal de confirmação ou um checkbox de "Entendi as consequências" para evitar ativações acidentais.

### 3. Arquitetura "State-First"

*   **Fonte Única de Verdade**: Tudo reside no `chrome.storage.local`.
*   **Desacoplamento**: A UI de Settings apenas lê e escreve no storage. Os serviços (Scrapers, Handlers) apenas observam mudanças de estado. Nenhuma regra de negócio reside na camada de visualização de configurações.

## CONSEQUÊNCIAS

- **Positivas**: Facilidade de manutenção, UX previsível para o aluno, facilidade em gerar backups (basta exportar o estado).
- **Esforço**: Exige a refatoração da `SettingsView.js` e a criação de um `ConfigurationService` centralizado.
