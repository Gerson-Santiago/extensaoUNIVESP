# Regras de Negócio (Business Logic)

Especificação funcional do comportamento esperado do sistema.

---

## 1. Gestão de Navegação (Tabs)

### 1.1 Unicidade de Instância
O sistema deve prevenir a duplicação de abas para o mesmo recurso.
- **Regra**: Ao solicitar a abertura de um link (ex: Curso X), verificar se existe aba ativa com URL correspondente.
- **Ação**:
    - *Match*: Focar na aba existente.
    - *No Match*: Criar nova aba.

---

## 2. Scraping e Coleta

### 2.1 Extração de Estrutura
- **Fonte**: DOM do AVA (Blackboard).
- **Validação**: Itens extraídos devem conter links funcionais. Placeholders visuais sem link devem ser ignorados.
- **Sincronização**: O scraping ocorre sob demanda (clique do usuário) ou em background durante importação em lote.

---

## 3. Persistência (Storage Layer)

### 3.1 Identidade de Entidade
- **Chave Primária**: O ID de Curso extraído da URL do AVA é a chave única.
- **Conflito**: Importar um curso já existente deve resultar em *Upsert* (Atualização), preservando metadados locais (ex: ordem, tags customizadas).

### 3.2 Escopo de Dados
- **Local**: `chrome.storage.local` para dados volumosos (cache de semanas).
- **Sync**: `chrome.storage.sync` para configurações críticas de usuário (preferências).

### 3.3 Progresso de Atividades
- **Desacoplamento**: O status de conclusão (`TODO/DONE`) é armazenado separadamente da estrutura do curso.
- **Atomicidade**: Atualizações de progresso usam operações de "Toggle" que afetam apenas o registro específico da atividade, evitando reescrita total do storage de cursos.
- **Fonte**: Pode ser obtido via scraping (automático) ou interação do usuário (manual).

---

## 4. Importação em Lote

### 4.1 Fluxo Executivo
1.  **Discovery**: Identificação de cursos disponíveis na grade do aluno.
2.  **Selection**: Usuário seleciona subconjunto de cursos.
3.  **Processing**: Fila de processamento em background para extração de metadados de cada curso.
4.  **Feedback**: Interface deve prover progresso visual em tempo real.
