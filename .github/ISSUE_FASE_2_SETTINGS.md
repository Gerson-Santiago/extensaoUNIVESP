# Issue: Fase 2 - Desacoplar settings de courses

## 🎯 Objetivo
Remover dependência direta de `features/settings/` em `features/courses/` através de eventos.

## 📋 Problema Atual

`SettingsView` importa diretamente de `courses`:
```javascript
// features/settings/ui/SettingsView.js
import { AddManualModal } from '../../courses/components/AddManualModal/index.js';
import { CourseRepository } from '../../courses/data/CourseRepository.js';
import { CourseService } from '../../courses/logic/CourseService.js';
```

**Violação**: Feature INFRA (settings) conhece intimamente feature CORE (courses).

## ✅ Solução Proposta

**Padrão: Event-Driven Decoupling**

### Mudanças em `SettingsView.js`:
```javascript
// ANTES
onAddManual() {
  const modal = new AddManualModal({ onSave: () => this.refresh() });
  modal.open();
}

// DEPOIS
onAddManual() {
  window.dispatchEvent(new CustomEvent('request:add-manual-course'));
}
```

### Mudanças em `sidepanel.js`:
```javascript
// Listener centralizado
window.addEventListener('request:add-manual-course', () => {
  const modal = new AddManualModal({ 
    onSave: () => coursesView.refresh() 
  });
  modal.open();
});
```

## 📝 Checklist de Implementação

### 1. Preparação (TDD)
- [ ] Criar branch `refactor/settings-decouple`
- [ ] Escrever testes para evento `request:add-manual-course`
- [ ] Escrever testes para evento `request:scrape-course`
- [ ] Garantir baseline verde (200 testes)

### 2. Refatoração
- [ ] Refatorar `SettingsView.js` para emitir eventos
- [ ] Adicionar listeners em `sidepanel.js`
- [ ] Remover imports de `courses` de `SettingsView`
- [ ] Atualizar imports de `CourseService` se necessário

### 3. Verificação
- [ ] Testes passando (200+)
- [ ] Testar manualmente:
  - [ ] Botão "Adicionar Manual" em Settings
  - [ ] Botão "Scrape Aba Atual" em Settings
  - [ ] Importação em lote

### 4. Documentação
- [ ] Atualizar `features/README.md`
- [ ] Atualizar `features/_CATEGORIES.md`
- [ ] Adicionar ADR se necessário
- [ ] Atualizar CHANGELOG

## ⚠️ Riscos

| Risco | Mitigação |
|:---|:---|
| Quebrar funcionalidade existente | TDD: escrever testes primeiro |
| Eventos não propagam | Testar em ambiente real (browser) |
| Ordem de inicialização | Garantir listeners antes de views |

## 📊 Critério de Sucesso

- ✅ `settings/` NÃO importa de `courses/`
- ✅ 200+ testes passando
- ✅ Funcionalidade manual testada
- ✅ Documentação atualizada

## 🔗 Refs
- Baseado em: `implementation_plan.md` Fase 2
- Branch: `refactor/settings-decouple`
