# Regras de Negócio (v2.9.7)

[[README](README.md)] | [[Padrões](PADROES.md)]

### 1. Organização Acadêmica
- Agrupamento: Cursos agrupados por "Ano/Semestre - Bimestre" via parseTerm().
- Ordenação: Recente primeiro. Grupo "Outros" invariavelmente ao final.
- Períodos: Suporte a 2025S2B4, 2025/2, etc. Fallback para sortKey 0.

### 2. Gestão de Tarefas
- Categorização: Por prioridade (Quiz > Videoaula > Textos).
- Progresso Dual: Sincronia entre AVA (scraped) e manual (user toggle). Unicidade via course_week_element_id.

### 3. Persistência
- Dual Storage: Atividades em 'local' (5MB), Progresso/Config em 'sync' (100KB).
- Auto-Save: Persistência imediata após scraping. Cache-first na UI.

### 4. Gestão de Erros
- SafeResult: Funções críticas retornam {success, data, error}. Zero exceptions não tratadas.

### 5. Navegação e UX
- Anti-Duplicação: Verifica abas abertas por URL antes de criar novas.
- Freshness: Containers DOM sempre recriados para evitar elementos órfãos.
- Scroll: Lógica de retry com MutationObserver para âncoras dinâmicas.

---
[README](README.md)
