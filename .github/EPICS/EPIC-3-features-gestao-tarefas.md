# EPIC 3: Features de Gestão de Tarefas

**Status**: 🚀 Ativo  
**Prioridade**: Alta  
**Owner**: Product + Engenharia  

---

## 🎯 Objetivo

Implementar **features de produto** relacionadas ao controle de progresso acadêmico, melhorando experiência do usuário na gestão de atividades.

---

## 📋 Escopo

### Visão

Transformar a extensão em uma **ferramenta completa de acompanhamento**, permitindo ao aluno:
- ✅ Ver todas atividades estruturadas
- ✅ Marcar progresso de conclusão
- ✅ Visualizar % de conclusão
- ✅ Navegar rapidamente entre conteúdos

---

## 🗂️ Issues Incluídas

### 1. [FEATURE-checkbox-conclusao.md](file:///home/sant/extensaoUNIVESP/.github/FEATURE/FEATURE-checkbox-conclusao.md)

**Objetivo**: Adicionar checkbox de conclusão em `DetailsActivitiesWeekView`

**Funcionalidades**:
- Checkbox por atividade
- Progress bar de conclusão
- Persistência de estado
- Sincronização futura com AVA (scraped status)

**Impacto**: ~250 LOC  
**Estimativa**: 3-4 horas

**Dependências**:
- ✅ ~~TECH_DEBT-unificar-estrutura-progresso~~ **RESOLVIDO** (2025-12-24)

---

### 2. Melhorias de UX/UI

Relacionadas a design e usabilidade:

#### [NEXT-CSS-details-activities.md](file:///home/sant/extensaoUNIVESP/.github/NEXT/NEXT-CSS-details-activities.md)

**Objetivo**: Padronizar CSS da `DetailsActivitiesWeekView`

**Melhorias**:
- Remover estilos inline
- Breadcrumb com nome da matéria
- Design System consistente
- Responsividade

**Impacto**: ~173 LOC  
**Estimativa**: 1-2 horas

---

## 🎁 Benefícios para o Usuário

- 📊 **Visibilidade**: Progresso visual por semana
- ✅ **Controle**: Marcar o que já fez
- 🚀 **Produtividade**: Foco no que falta
- 💾 **Memória**: Não perde controle entre sessões

---

## ✅ Critérios de Aceitação

### Funcional
- [ ] Checkbox aparece em cada atividade
- [ ] Click marca/desmarca
- [ ] Progress bar mostra % correto
- [ ] Estado persiste ao fechar extensão

### UX
- [ ] Design consistente com projeto
- [ ] Breadcrumb mostra matéria + semana
- [ ] Responsivo (diferentes larguras)
- [ ] Hover states e transições

### Qualidade
- [ ] Testes unitários passando
- [ ] Performance < 100ms para marcar
- [ ] Zero warnings de lint/type-check

---

## 📊 Progresso

```
[████░░░░░░] 40%
```

**Concluído**: 
- ✅ Navegação de atividades (100%)
- ✅ Sistema básico de progresso (70%)

**Em progresso**:
- 🔄 CSS padronizado (0%)
- 🔄 Checkbox de conclusão (0%)

---

## 🚀 Roadmap

### Phase 1: Fundação ✅
- [x] Scraping de atividades
- [x] Navegação entre views
- [x] Scroll automático

### Phase 2: Controle de Progresso 🔄
- [ ] Unificar estrutura de dados
- [ ] Checkbox de conclusão
- [ ] Progress bar aprimorada

### Phase 3: Polish 📋
- [ ] CSS padronizado
- [ ] Export/import de dados
- [ ] Sincronização com AVA

---

## 🔗 Dependências

- EPIC 1 (Refatoração) → Desbloqueia implementação limpa
- EPIC 2 (Estrutura de dados) → Necessário para checkbox

---

**Criado em**: 2025-12-23  
**Relacionado a**: [SPEC-v2.8.0.md](file:///home/sant/extensaoUNIVESP/.github/SPEC-v2.8.0.md)
