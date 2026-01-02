# SPEC-022: Settings UI Layout (Hierarchy & Structure)

**ID:** SPEC-022  
**Epic Parent:** EPIC-002 (Data Sovereignty)  
**Prioridade:** 🟡 Alta (Estrutura Base)  
**Estimativa:** 3 dias  
**Status:** 📋 Aberta  
**Owner:** Frontend Lead + UX  
**QA Reviewer:** QA Lead  
**Data:** 02/01/2026

---

## 🎯 Objetivo de Negócio

Criar a estrutura visual e hierárquica da interface de **Settings**, organizando configurações em seções claras e navegáveis, servindo como **base** para todas as futuras funcionalidades de settings (backup, reset, preferências).

**Justificativa:**
- **Usability:** Usuário encontra facilmente o que procura (não precisa scrollar uma lista infinita).
- **Scalability:** Novas configurações podem ser adicionadas sem desorganizar a UI.

---

## 📖 Contexto Técnico

### Localização
**Componente:** `features/settings/ui/SettingsView.js`  
**Renderização:** Side Panel da extensão (quando usuário navega para rota `/settings`)

### Arquitetura Visual Proposta

```
┌────────────────────────────────────┐
│ ⚙️ Configurações                   │
├────────────────────────────────────┤
│ [Aba: Geral] [Aba: Dados] ...     │ ← Tab Navigation
├────────────────────────────────────┤
│                                    │
│  [Conteúdo da Aba Selecionada]    │
│                                    │
│  ex: Se "Geral" selecionada:      │
│  ┌─ Preferências ────────────┐   │
│  │ ○ Densidade Visual         │   │
│  │ ○ Auto-Pin Última Semana   │   │
│  └────────────────────────────┘   │
│                                    │
└────────────────────────────────────┘
```

---

## 📋 Requisitos Funcionais

### RF-001: Estrutura de Abas
**Abas Obrigatórias (em ordem):**

1. **Geral** (Preferências de UX)
   - Densidade Visual (Issue-022)
   - Auto-Pin Última Semana (Issue-022)
   - (Futuro) Tema escuro/claro

2. **Dados** (Backup & Storage)
   - Exportar Backup (SPEC-019)
   - Importar Backup (SPEC-019)
   - Tamanho do armazenamento usado (read-only)

3. **Sobre** (Info & Support)
   - Versão da extensão (dinâmico via `chrome.runtime.getManifest()`)
   - Links: GitHub, Report Bug, Privacy Policy
   - Modo de Diagnóstico (Issue-023)

4. **Zona de Perigo** (Danger Zone)
   - Factory Reset (SPEC-020)
   - **Estilo:** Fundo vermelho claro, ícone de alerta

**Critérios:**
- [ ] 4 abas visíveis e clicáveis.
- [ ] Aba ativa tem indicador visual (ex: underline, cor diferente).
- [ ] Conteúdo muda ao trocar de aba (sem reload de página).

---

### RF-002: Navegação por Teclado (Acessibilidade)
**Objetivo:** Usuário pode navegar sem mouse.

**Comportamento:**
- `Tab` navega entre abas.
- `Enter` ou `Space` seleciona aba focada.
- `Arrow Left/Right` navega entre abas.

**Critérios:**
- [ ] Abas têm `tabindex="0"`.
- [ ] Aba ativa tem `aria-selected="true"`.
- [ ] Conteúdo tem `role="tabpanel"`.

---

### RF-003: Persistência de Aba (Opcional)
**Objetivo:** Lembrar última aba visitada.

**Implementação:**
```javascript
// Salvar no session storage (não precisa persistir entre sessões)
sessionStorage.setItem('settings_active_tab', 'dados');

// Restaurar ao abrir Settings
const lastTab = sessionStorage.getItem('settings_active_tab') || 'geral';
```

**Critérios:**
- [ ] Se usuário fecha e reabre Settings, aba anterior está selecionada.

---

### RF-004: Responsividade (Scroll Vertical)
**Objetivo:** Suportar conteúdo longo.

**Comportamento:**
- Se conteúdo de uma aba exceder altura do sidePanel, permitir scroll vertical.
- Cabeçalho (abas) permanece fixo no topo.

**Critérios:**
- [ ] Conteúdo longo (ex: 20+ opções) não quebra layout.
- [ ] Abas permanecem visíveis ao rolar.

---

## 🔒 Requisitos Não-Funcionais

### RNF-001: Design System Consistency
- Usar mesmas classes CSS de outros componentes (ex: `MainLayout`, `Modal`).
- Cores semânticas:
  - Geral/Dados/Sobre: Cores neutras.
  - Danger Zone: `background-color: #fee;` (vermelho claro).

### RNF-002: Performance
- Troca de abas: < 100ms (sem lag perceptível).

### RNF-003: Testabilidade
- Cada aba tem `data-testid` para seleção em testes:
  ```html
  <button data-testid="tab-geral">Geral</button>
  ```

---

## ✅ Critérios de Aceite (Testáveis)

### CA-001: Renderização de Abas
```javascript
// Arrange
const view = new SettingsView();

// Act
view.render();

// Assert
const tabs = document.querySelectorAll('[role="tab"]');
expect(tabs.length).toBe(4); // Geral, Dados, Sobre, Danger Zone
expect(tabs[0].textContent).toBe('Geral');
```

### CA-002: Troca de Aba
```javascript
// Act
const dadosTab = document.querySelector('[data-testid="tab-dados"]');
dadosTab.click();

// Assert
const activePanel = document.querySelector('[role="tabpanel"]:not([hidden])');
expect(activePanel.textContent).toContain('Exportar Backup');
```

### CA-003: Acessibilidade (Keyboard Navigation)
```javascript
// Act
const geralTab = document.querySelector('[data-testid="tab-geral"]');
geralTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

// Assert
const activeTab = document.querySelector('[aria-selected="true"]');
expect(activeTab.textContent).toBe('Dados'); // Próxima aba
```

---

## 📦 Entregáveis

1. **UI Components:**
   - [ ] `features/settings/ui/SettingsView.js` (container principal)
   - [ ] `features/settings/ui/TabNavigation.js` (componente de abas reutilizável)
   - [ ] `features/settings/ui/tabs/GeralTab.js`
   - [ ] `features/settings/ui/tabs/DadosTab.js`
   - [ ] `features/settings/ui/tabs/SobreTab.js`
   - [ ] `features/settings/ui/tabs/DangerZoneTab.js`

2. **Styles:**
   - [ ] `features/settings/ui/settings.css` (estilos das abas)

3. **Testes:**
   - [ ] `SettingsView.test.js` (renderização + navegação)
   - [ ] `TabNavigation.test.js` (keyboard accessibility)

---

## 🧪 Plano de Testes (AAA Pattern)

### Teste 1: Renderização Inicial (Aba Geral Ativa)
```javascript
describe('SettingsView', () => {
  it('deve renderizar com aba Geral ativa por padrão', () => {
    // Arrange
    document.body.innerHTML = '';
    
    // Act
    const view = new SettingsView();
    document.body.appendChild(view.render());
    
    // Assert
    const activeTab = document.querySelector('[aria-selected="true"]');
    expect(activeTab.textContent).toBe('Geral');
    
    const activePanel = document.querySelector('[role="tabpanel"]:not([hidden])');
    expect(activePanel).toContain(document.querySelector('.densidade-visual'));
  });
});
```

### Teste 2: Danger Zone Está Separada Visualmente
```javascript
it('deve aplicar estilo destrutivo em Danger Zone', () => {
  // Arrange & Act
  const view = new SettingsView();
  document.body.appendChild(view.render());
  
  // Assert
  const dangerTab = document.querySelector('[data-testid="tab-danger"]');
  const computedStyle = window.getComputedStyle(dangerTab);
  expect(computedStyle.backgroundColor).toMatch(/rgba?\(255,\s*238,\s*238/); // Vermelho claro
});
```

---

## 🔗 Dependencies

| Dependency | Tipo | Bloqueador? |
|------------|------|-------------|
| Screaming Architecture (ADR-000-A) | Governança | ❌ Não |
| Design System (CSS existente) | Técnica | ⚠️ Se não existir, criar classes base |
| Nenhuma funcionalidade específica | - | ❌ Esta SPEC é a base |

---

## 🚨 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Abas confusas (usuário não sabe onde está) | Baixa | Médio | Indicador visual claro (underline + cor) |
| Conteúdo muito longo (scroll infinito) | Média | Baixo | Limitar altura de tabpanels (max-height + scroll) |
| Navegação por teclado não funciona | Baixa | Médio | Testes de acessibilidade automatizados |

---

## 📅 Timeline Sugerido

| Dia | Atividade |
|-----|-----------|
| **D1** | Criar estrutura HTML + TabNavigation component |
| **D2** | Implementar 4 tabs (conteúdo placeholder) + CSS |
| **D3** | Testes de acessibilidade + refinamento visual |

---

**Aprovação QA Lead:** ✅ SPEC completa, estrutura base essencial. DEVE ser implementada ANTES de SPEC-019 e SPEC-020.

---

## 📝 Notas de Implementação

### Conteúdo Placeholder das Abas (Fase Inicial)

**Aba Geral:**
```html
<div>
  <h3>Preferências</h3>
  <p>Configurações de UX serão implementadas em SPEC futura.</p>
</div>
```

**Aba Dados:**
```html
<div>
  <h3>Backup & Armazenamento</h3>
  <button disabled>Exportar Backup (Em Breve)</button>
  <button disabled>Importar Backup (Em Breve)</button>
</div>
```

**Aba Sobre:**
```html
<div>
  <h3>Central Univesp</h3>
  <p>Versão: <span id="version">2.10.0</span></p>
  <a href="https://github.com/..." target="_blank">GitHub</a>
</div>
```

**Aba Danger Zone:**
```html
<div class="danger-zone">
  <h3>⚠️ Zona de Perigo</h3>
  <button disabled class="btn-destructive">Factory Reset (Em Breve)</button>
</div>
```

**Após SPEC-022 estar completa:**
- SPEC-019 substituirá placeholders da aba Dados.
- SPEC-020 ativará botão da aba Danger Zone.
