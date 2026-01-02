# SPEC-020: Factory Reset with Safety Barriers

**ID:** SPEC-020  
**Epic Parent:** EPIC-002 (Data Sovereignty)  
**Prioridade:** 🟡 Alta (User Safety)  
**Estimativa:** 2 dias  
**Status:** 📋 Aberta  
**Owner:** TBD  
**QA Reviewer:** QA Lead  
**Data:** 02/01/2026

---

## 🎯 Objetivo de Negócio

Permitir que o usuário retorne a extensão ao estado "pós-instalação", apagando **todos os dados e configurações**, mas com **barreiras de segurança** que previnam perda acidental de dados.

**Justificativa:**
- **Privacy/GDPR:** Usuário tem direito ao "esquecimento" (deletar todos os seus dados).
- **User Safety:** Clique acidental em "Reset" pode destruir semanas de organização acadêmica.

---

## 📖 Contexto Técnico

### Localizção na UI
**Aba "Danger Zone" (Zona de Perigo)** da `SettingsView`:
- Última seção da interface de configurações.
- Cor semântica destrutiva (vermelho ou contorno vermelho).
- Separada visualmente (ex: linha divisória, ícone de alerta).

### Fluxo de Reset (Estado Desejado)
```
[Usuário] Clica "Reset"
    ↓
[Sistema] Abre Modal de Confirmação
    ↓
[Usuário] OPÇÃO 1: Cancelar → Nada acontece
[Usuário] OPÇÃO 2: Confirmar → Digitar "CONFIRMAR" OU clicar checkbox
    ↓
[Sistema] Executa chrome.storage.local.clear()
    ↓
[Sistema] Executa chrome.runtime.reload()
    ↓
[Resultado] Extensão reinicia em estado limpo
```

---

## 📋 Requisitos Funcionais

### RF-001: Barreira de Confirmação Dupla
**Objetivo:** Prevenir cliques acidentais.

**Implementação (Modal de Confirmação):**
```javascript
// features/settings/ui/DangerZone.js
export class DangerZoneView {
  handleResetClick() {
    // 1. Abrir Modal
    const modal = new ConfirmationModal({
      title: '⚠️ Apagar TODOS os dados?',
      message: `
        Esta ação é IRREVERSÍVEL. Você perderá:
        - Todos os cursos organizados
        - Histórico de navegação
        - Configurações personalizadas
        
        Digite "CONFIRMAR" para continuar:
      `,
      destructive: true,
      onConfirm: (inputValue) => {
        if (inputValue === 'CONFIRMAR') {
          this.executeReset();
        } else {
          Toaster.error('Texto incorreto. Reset cancelado.');
        }
      }
    });
    
    modal.open();
  }
}
```

**Critérios:**
- [ ] Modal exige digitação de "CONFIRMAR" (case-sensitive).
- [ ] Botão "Confirmar" do modal está desabilitado até texto correto ser digitado.
- [ ] Botão "Cancelar" fecha modal sem executar reset.

---

### RF-002: Execução de Reset + Reload
**Objetivo:** Limpar storage e reiniciar extensão.

**Implementação:**
```javascript
async executeReset() {
  try {
    // 1. Limpar storage
    await chrome.storage.local.clear();
    
    // 2. Log de auditoria (se Logger estiver ativo)
    Logger.warn('Factory Reset executado pelo usuário');
    
    // 3. Reload imediato (antes que variáveis em memória causem inconsistências)
    chrome.runtime.reload();
  } catch (error) {
    Logger.error('Falha no Factory Reset', { error });
    Toaster.error('Erro ao resetar. Contate o suporte.');
  }
}
```

**Critérios:**
- [ ] `chrome.storage.local.clear()` é chamado.
- [ ] `chrome.runtime.reload()` é chamado **imediatamente** após clear.
- [ ] Se clear falhar, usuário é notificado (não silencioso).

---

### RF-003: Fail-Safe (Tratamento de Erro)
**Objetivo:** Se reset falhar parcialmente, usuário é notificado.

**Cenários de Erro:**
1. **`clear()` falha:** Toaster mostra "Erro ao deletar dados".
2. **Permissão negada:** Unlikely, mas deve logar.

**Critérios:**
- [ ] Erros são logados via `Logger.error`.
- [ ] Toaster exibe mensagem amigável (não erro técnico bruto).

---

## 🔒 Requisitos Não-Funcionais

### RNF-001: Acessibilidade
- **Keyboard Navigation:** Modal deve ser acessível via Tab + Enter/Esc.
- **Screen Readers:** Mensagem de alerta deve ter `role="alertdialog"` e `aria-describedby`.

### RNF-002: Performance
- **Reload Time:** < 2 segundos para extensão reiniciar após reset.

### RNF-003: Privacy Policy Compliance (Issue-035)
**Menção Obrigatória:**
```markdown
## Direito ao Esquecimento
Você pode deletar TODOS os seus dados da extensão a qualquer momento usando a função "Factory Reset" nas Configurações.
```

---

## ✅ Critérios de Aceite (Testáveis)

### CA-001: Cancelamento de Reset
```javascript
// Arrange
const storage = await chrome.storage.local.get(null);
const initialData = JSON.stringify(storage);

// Act
DangerZoneView.handleResetClick(); // Abre modal
ConfirmationModal.cancel(); // Usuário cancela

// Assert
const finalData = JSON.stringify(await chrome.storage.local.get(null));
expect(finalData).toEqual(initialData); // Nada mudou
```

### CA-002: Reset com Texto Incorreto
```javascript
// Act
DangerZoneView.handleResetClick();
ConfirmationModal.inputText('confirmar'); // Minúsculo (errado)
ConfirmationModal.confirm();

// Assert
expect(Toaster.error).toHaveBeenCalledWith('Texto incorreto');
expect(chrome.storage.local.clear).not.toHaveBeenCalled();
```

### CA-003: Reset Bem-Sucedido
```javascript
// Act
DangerZoneView.handleResetClick();
ConfirmationModal.inputText('CONFIRMAR'); // Correto
ConfirmationModal.confirm();

// Assert
expect(chrome.storage.local.clear).toHaveBeenCalled();
expect(chrome.runtime.reload).toHaveBeenCalled();
```

---

## 📦 Entregáveis

1. **UI Components:**
   - [ ] `features/settings/ui/DangerZone.js` (seção na Settings)
   - [ ] `shared/ui/ConfirmationModal.js` (reutilizável, não específico de reset)

2. **Logic:**
   - [ ] `features/settings/logic/ResetController.js` (orquestra clear + reload)

3. **Testes:**
   - [ ] `ResetController.test.js` (AAA pattern)
   - [ ] `ConfirmationModal.test.js` (UI behavior)

4. **Documentação:**
   - [ ] Atualizar Issue-035 (Privacy Policy) com menção ao Factory Reset

---

## 🧪 Plano de Testes (AAA Pattern)

### Teste 1: Modal Não Deleta Dados ao Cancelar
```javascript
describe('DangerZone - Factory Reset', () => {
  it('não deve deletar dados se usuário cancelar', async () => {
    // Arrange
    await chrome.storage.local.set({ testKey: 'testValue' });
    const view = new DangerZoneView();
    
    // Act
    view.handleResetClick(); // Abre modal
    const modal = document.querySelector('.confirmation-modal');
    modal.querySelector('[data-action="cancel"]').click();
    
    // Assert
    const data = await chrome.storage.local.get('testKey');
    expect(data.testKey).toBe('testValue'); // Ainda existe
  });
});
```

### Teste 2: Reset Executa Reload
```javascript
it('deve chamar runtime.reload após clear', async () => {
  // Arrange
  const reloadSpy = jest.spyOn(chrome.runtime, 'reload');
  const controller = new ResetController();
  
  // Act
  await controller.execute();
  
  // Assert
  expect(reloadSpy).toHaveBeenCalled();
});
```

---

## 🔗 Dependencies

| Dependency | Tipo | Bloqueador? |
|------------|------|-------------|
| SPEC-022 (Settings UI Layout) | Técnica | ✅ Sim (precisa da aba Danger Zone) |
| ConfirmationModal component | Técnica | ⚠️ Se não existir, criar genérico |
| Issue-035 (Privacy Policy) | Legal | ⚠️ Deve mencionar reset |

---

## 🚨 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Usuário perde dados sem querer (barreira falhou) | Muito Baixa | Muito Alto | Testes de usabilidade + confirmação dupla |
| `reload()` falha, extensão fica em estado inconsistente | Baixa | Médio | Error handling + log |
| Modal é confuso (usuário não entende) | Baixa | Médio | UX Review + mensagem clara |

---

## 📅 Timeline Sugerido

| Dia | Atividade |
|-----|-----------|
| **D1** | Criar ConfirmationModal (componente genérico) + DangerZone UI |
| **D2** | Implementar ResetController + testes + integração |

---

**Aprovação QA Lead:** ✅ SPEC completa, barreiras de segurança robustas. Prioridade ALTA devido a risco de perda de dados.
