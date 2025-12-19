> Status: Active
> Last Update: 2025-12-18
> Owner: Gerson Santiago

# 🕵️ Relatório de Dependências Quebradas (Legacy Audit)

Após a renomeação de `sidepanel` para `sidepanel_old` (sem atualizar os imports), identificamos as seguintes conexões que ainda dependem da estrutura antiga.

> **Importante**: Estes arquivos precisam ser atualizados para pontar para os novos locais (se já existirem) ou para `sidepanel_old` (temporariamente).

## 🚨 1. Imports Relativos Quebrados
Estes arquivos tentam acessar `../../../sidepanel/...`.

| Arquivo Consumidor (Features) | Dependência (Sidepanel) | Sugestão de Correção |
| :--- | :--- | :--- |
| `features/settings/ui/SettingsView.js` | `utils/statusManager.js` | Mover para `shared/utils`? |
| `features/settings/ui/SettingsView.js` | `components/Forms/ConfigForm.js` | Mover para `features/settings/components` |

## 🧪 2. Testes Quebrados (Jest)
Baseado na execução do `npm test`:

*   **Status**: Testes falhando devido a módulos não encontrados (`Cannot find module`).
*   **Module Name Mapper**: O Jest ainda mapeia `@sidepanel` para `sidepanel/`, mas a pasta não existe.

## 📝 Próximos Passos
1.  **Imediato**: Corrigir `jest.config.js` e `jsconfig.json` para apontar `@sidepanel` -> `sidepanel_old`.
2.  **Refatoração**: Migrar `Modal`, `ActionMenu` e `ConfigForm` para suas novas casas definitivas.
