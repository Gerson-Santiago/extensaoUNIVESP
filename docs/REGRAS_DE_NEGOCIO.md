# 📜 Regras de Negócio e Especificação Funcional

Este documento detalha o comportamento funcional e as decisões lógicas do sistema, servindo como referência para desenvolvimento e manutenção.

---

## 1. Gerenciamento de Abas (`Tabs.js`)

**Propósito**: Centralizar e normalizar a navegação e abertura de abas, garantindo que o usuário não perca o contexto de estudo e evitando a poluição do navegador com múltiplas abas do mesmo conteúdo.

### 1.1. Regra de Unicidade de Aba
**Quando**: O usuário clica em um item de curso ou semana no Painel Lateral.

**Comportamento**:
- O sistema DEVE verificar se já existe uma aba aberta correspondente ao conteúdo solicitado.
- **Match por Pattern (Prioritário)**: Se o componente fornecer um padrão (ex: `sei.univesp.br`), qualquer aba do domínio satisfaz a requisição (ignora subcaminhos).
- **Match por ID**: Se a URL alvo contém `course_id`/`content_id`, busca a aba específica.
- **Fallback**: Busca exata ou por prefixo.

**Decisão**:
- **Se encontrar**: Foca na janela e ativa a aba existente. NÃO recarrega a página (preserva estado).
- **Se não encontrar**: Cria uma nova aba e a foca imediatamente.

---

## 2. Coleta de Dados (`ScraperService.js`)

**Propósito**: Extrair informações de estrutura do curso (semanas, vídeos, textos) diretamente da interface do AVA (Blackboard), visto que não há API pública disponível.

### 2.1. Regra de Detecção de Semanas
**Quando**: O usuário acessa a página "Conteúdo" de um curso ou clica em "Atualizar".

**Lógica de Extração**:
1. **Identificação**: Busca elementos HTML que correspondam ao padrão visual de uma "Semana" (pastas, links com datas).
2. **Validação**: Ignora itens que não possuam links clicáveis ou que sejam puramente informativos (avisos).
3. **Deep Scraping (Opcional)**: Ao importar em lote, o sistema pode acessar a página de cada semana em background para validar se há conteúdo real antes de adicionar.

---

## 3. Persistência de Dados (`CourseRepository.js`)

**Propósito**: Manter a lista de matérias e o progresso do usuário salvos localmente, respeitando a privacidade (Local-First).

**Regras**:
- **Soberania**: Os dados pertencem ao navegador do usuário (`chrome.storage.local` / `sync`). NENHUM dado é enviado para servidores externos.
- **Identificador Único**: Cada curso é identificado primariamente por seu ID no AVA. Cursos com mesmo ID são tratados como o mesmo objeto (atualização ao em vez de duplicação).
- **Metadados**: Tags como "2025/1 - 1º Bimestre" são persistidas junto com o curso para permitir agrupamento visual.

---

## 4. Importação em Lote (`BatchImportModal.js`)

**Propósito**: Agilizar a configuração inicial da extensão importando múltiplas matérias de uma vez.

**Fluxo**:
1. **Varredura**: Lê a grade de cursos na página "Linha do Tempo" ou "Cursos".
2. **Filtragem**: Permite ao usuário selecionar quais "Termos" (Períodos Letivos) deseja importar.
3. **Execução**:
    - Para cada curso selecionado, abre uma conexão em background.
    - Extrai o nome e ID.
    - Salva no storage.
    - Notifica o progresso na UI.

---

> *Este documento deve se manter agnóstico à linguagem de programação. Alterações na implementação técnica não devem, idealmente, alterar este documento, a menos que a regra de negócio mude.*

---

### Documentação
<!-- Documentação do projeto -->
**[README.md](../README.md)**            Documentação do projeto.             
<!-- Histórico de versões e atualizações -->
**[CHANGELOG.md](../CHANGELOG.md)**      Histórico de versões e atualizações. 

