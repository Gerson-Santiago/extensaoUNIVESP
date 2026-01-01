# 📝 ISSUE-020: Implementação de Reset Total (Limpar Todos os Dados)

**Status:** 📋 Aberta
**Prioridade:** Média
**Componente:** `features/settings`
**Versão:** v2.10.0

---

## 🎯 Objetivo

Implementar uma funcionalidade de "Reset de Fábrica" (Factory Reset) que remova absolutamente todos os dados armazenados pela extensão no `chrome.storage.local`. Diferente da função atual de "Remover Matérias", esta deve limpar configurações de UI, histórico, cache de chips e qualquer metadado persistido.

---

## 📖 Contexto

O usuário precisa de uma forma soberana de limpar seu rastro e preferências na extensão, seja por privacidade ou para resolver estados inconsistentes (bugs). Esta ação é o oposto da Importação de Backup.

---

## 🛠️ Requisitos Técnicos

### 1. Extensão do StorageService / BackupService
- Implementar um método `factoryReset()` que execute `chrome.storage.local.clear()`.
- Garantir que a ação seja precedida por um `confirm()` de UI com aviso crítico.

### 2. Interface de Usuário (SettingsView)
- Adicionar uma seção de "Zona de Perigo" (Danger Zone) nas configurações.
- Estilizar o botão de Reset com cores de alerta (vermelho/destrutivo).

### 3. Fluxo de Pós-Reset
- Após o reset, a extensão deve forçar um reload para re-inicializar todos os serviços com os valores padrão.

---

## ✅ Critérios de Aceite

- [ ] O botão "Reset de Fábrica" está isolado dentro de um container "Danger Zone" com borda vermelha e aviso explícito.
- [ ] Implementação de **Barreira de Segurança**: A ação de Reset deve exigir que o usuário marque um checkbox de confirmação ou confirme em um modal específico, impedindo cliques acidentais.
- [ ] Após a confirmação, o `chrome.storage.local` é esvaziado completamente.
- [ ] A extensão recarrega e volta ao estado inicial de instalação.

---

## 🧪 Plano de Verificação (AAA Pattern)

1.  **Cenário: Reset Global com Sucesso**
    - **Arrange:** Poblar o storage com dados (cursos, chips_settings, ui_settings).
    - **Act:** Executar o comando de Reset.
    - **Assert:** Verificar se `chrome.storage.local.get(null)` retorna um objeto vazio `{}`.

---

**Tags:** `//ISSUE-settings-reset` | **Tipo:** Feature | **Sprint:** v2.10.0-Evolution
**Relatada por:** IA do Projeto | **Data:** 31/12/2025
