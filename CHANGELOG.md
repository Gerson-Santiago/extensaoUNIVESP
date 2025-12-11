# Changelog - Versão Beta

## [2.1.0-beta] - 2025-12-10

### Adicionado
- **Painel Lateral (Side Panel)**: Nova interface para gerenciar matérias e navegar rapidamente entre semanas de aula.
- **Auto-Detecção de Semanas**: Ao adicionar uma matéria do AVA, a extensão detecta automaticamente os links das "Semanas" e os lista no painel.
- **Navegação Rápida**: Clique na semana desejada no Painel Lateral para abrir a aula diretamente.
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
