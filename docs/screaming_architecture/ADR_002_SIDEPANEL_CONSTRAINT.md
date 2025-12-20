> Status: Active
> Last Update: 2025-12-20
> Owner: Gerson Santiago

# ADR-002: Por que a Pasta `sidepanel/` Não Pode Ser Renomeada

## Contexto

Durante a refatoração Screaming Architecture, surgiu a tentativa de renomear `sidepanel/` para algo mais semântico ou mover seus componentes para `shared/`. A tentativa resultou em quebra catastrófica de testes e build.

## Decisão

**A pasta `sidepanel/` deve manter seu nome original e localização.**

## Razões

### 1. **Manifest V3 Hard-coded Path**
```json
"side_panel": {
  "default_path": "sidepanel/sidepanel.html"
}
```
O Chrome Extension Manifest aponta explicitamente para este caminho. Alterar requer update do manifest E garantia de que extensões já instaladas migrem corretamente.

### 2. **Jest Path Aliases**
```js
// jest.config.js (histórico)
moduleNameMapper: {
  '@sidepanel': '<rootDir>/sidepanel'
}
```
Testes antigos usavam aliases. Embora removíveis, criar dependência de refatoração massiva.

### 3. **Imports Relativos Hardcoded**
Centenas de imports do tipo `../../../sidepanel/components/...` espalhados pelo código. Mudança requer atualização em cascata de todos os arquivos.

## Implicações

- A pasta `sidepanel/` é um **Shell minimalista** (apenas `sidepanel.html` e `sidepanel.js` após refatoração).
- Componentes que eram dela foram migrados para `shared/` e `features/`.
- O nome não ideal é aceito como custo técnico menor que a refatoração total.

## Alternativas Consideradas

1. **Renomear para `shell/`**: Descartada (quebra manifest e testes).
2. **Mover tudo para `app/`**: Descartada (complexidade de migração).
3. **Status Quo**: ✅ Aceita. Manter nome, migrar apenas conteúdo.

## Referências

- Tentativa de refatoração documentada em logs (Dez/2025)
- Screaming Architecture permite "concessions" em entry points do framework
