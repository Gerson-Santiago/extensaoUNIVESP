# Changelog - Versão Beta

## [2.3.1] - 2025-12-12
### Refatoração
- **SettingsView.js**: Modularização completa do código settings para melhorar manutenção e testes.
  - Extraído `RaManager` e `DomainManager` para lógica de negócios.
  - Criado `ConfigForm` para interface de configurações.
  - Implementado `FeedbackManager` para mensagens visuais.
- **Tipagem**: Correções de tipagem e JSDoc em todos os novos módulos.

### Infraestrutura & Testes
- **Jest Upgrade**: Atualizado para Jest v30.2.0.
  - Removido `jest-chrome` em favor de `jest-webextension-mock` para melhor compatibilidade.
  - Ativado provider de cobertura V8 (mais rápido e preciso).
  - Limpeza de configurações depreciadas no `jest.config.js`.
- **Cobertura**: Adicionados testes unitários completos para o novo módulo de configurações e armazenamento.

### Validado
- **Issue #2 - Consolidação de Código:** Confirmada consolidação de `settings.js` em `shared/utils/` como única fonte de verdade
- **Eliminação de Duplicação:** Verificada ausência de código duplicado entre popup e sidepanel
- **Importações Corretas:** Validados imports em `popup/popup.js` e `sidepanel/views/SettingsView.js`
- **Testes Passando:** Confirmados 3 testes automatizados executando com sucesso

## [2.3.0] - 2025-12-11
### Novas Funcionalidades
- **Importação em Lote Inteligente:** Importa cursos diretamente da lista do AVA, acessando em background ("Deep Scraping") para garantir links diretos para a "Página Inicial" do conteúdo.
- **Gerenciamento de Abas:** Lógica aprimorada que identifica abas abertas pelo ID do curso (`course_id`), prevenindo duplicidade mesmo navegando dentro do curso.
- **Redirecionamento Automático:** Modal de importação agora detecta erros de contexto e redireciona automaticamente para a página correta.

### Qualidade e Documentação
- **Refatoração de Testes:** Expansão profissional da suíte de testes (100% passing), incluindo testes para scrapers e lógica de abas.
- **Documentação Profissional:** Criação do `TECHNICAL_ARCHITECTURE_AND_PRIVACY.md` detalhando o protocolo de privacidade "No-Database" e a arquitetura técnica local.

## [2.2.0] - 2025-12-11
### Segurança e Arquitetura
- **Testes Automatizados:** Implementação de suíte de testes com Jest para garantir integridade de imports e lógica.
- **Refatoração Modular:** 
    - Extração de componentes de UI do `sidepanel.js` para `sidepanel/ui/components.js`.
    - Centralização de lógica de configurações do `popup.js` para `popup/logic/settings.js`.
- **Limpeza:** Consolidação de configurações de teste no `package.json`, removendo arquivos da raiz.

## [2.1.1] - 2025-12-11
### Corrigido e Melhorado
- **Erro de Sintaxe:** Corrigido bloco `try-catch` malformado em `sidepanel.js`.
- **Detecção de Título Aprimorada:** O extrator agora remove sufixos irrelevantes (ex: "- UNIVESP") e prioriza o título real do conteúdo (`h1`) sobre o título da aba.
- **Extração de Links Complexos:** Adicionado suporte para links do Blackboard que usam JavaScript/onclick (iframes ocultos), garantindo que todas as semanas sejam listadas mesmo em cursos antigos.

## [2.1] - 2025-12-10
### Added
- **Arquitetura de Mensageria:** Novo sistema de comunicação entre Side Panel e Content Script para contornar problemas de CORS e injeção de scripts.
- **Permissão `activeTab`:** Adicionada para garantir acesso confiável à aba atual sob demanda.
- **Content Script Persistente:** `ava_scraper_content.js` agora roda nativamente nas páginas do AVA para extração rápida de dados.
- **Créditos:** Adicionado "Desenvolvido por Gerson Santiago" no rodapé do popup.

### Fixed
- **Semana não aparecia:** Resolvido problema de permissão que impedia o scraper de ler o DOM do Blackboard.
- **Logs:** Removido sistema de logs de debug (não mais necessário após correção arquitetural).

## [2.0 Beta] - 2025-12-0910

### Adicionado
- **Painel Lateral (Side Panel)**: Nova interface para gerenciar matérias e navegar rapidamente entre semanas de aula.
- **Auto-Detecção de Semanas**: Ao adicionar uma matéria do AVA, a extensão detecta automaticamente os links das "Semanas" e os lista no painel.
- **Navegação Rápida**: Clique na semana desejada no Painel Lateral para abrir a aula diretamente.
- **Corrigido:** Nome da matéria agora é extraído diretamente do título real do Blackboard (`h1.panel-title`), evitando nomes genéricos como "Conteúdo".
- **Botão Atualizar (Refresh)**: Adicionado botão "↻" no Painel Lateral para re-escanear a página e buscar novas semanas sem precisar remover e adicionar a matéria novamente.
- **Configuração de Domínio**: Opção no popup para personalizar o domínio do email (ex: `@aluno.univesp.br`) ou restaurar o padrão.

### Melhorias Tecnicas e Robustez
- **Scraper Híbrido**: Implementado sistema de busca dupla. Primeiro verifica os elementos visuais na tela (incluindo iframes); se falhar, busca internamente o menu do curso pelo ID.
- **Sistema de Logs**: Adicionado painel de Logs no Popup para diagnóstico e transparência das operações de scraping.
- **Permissões de Host**: Atualizado manifesto para garantir acesso legal e funcional aos domínios `ava.univesp.br` e `sei.univesp.br`.

### Melhorias de UI/UX
- **Scraper Inteligente**: O algoritmo de detecção de semanas foi aprimorado para suportar a estrutura aninhada do Blackboard (links dentro de `span[title]`), garantindo que todas as semanas sejam encontradas.
- **Padronização de Código**: Adicionados comentários JSDoc em Português para facilitar a manutenção do código (storage e tabs).

### Correções
- **Autopreenchimento SEI**: Corrigido um erro de digitação no código de cor que indicava o preenchimento automático.
- **Link do GitHub**: Corrigido o link no rodapé do popup para abrir em uma nova aba.
