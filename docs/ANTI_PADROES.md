# Anti-Padrões: Proibido

[[README](README.md)] | [[Padrões](PADROES.md)]

Lista de falhas técnicas que travam o Quality Gate:

### 1. Ambiente (Testes/DOM)
- window.location: Nunca reatribua valor direto. Use Object.defineProperty no mock.
- Mocks Globais: Devem implementar a interface completa da Web API.
- Spies DOM: Nunca em instância; use o Prototype ou mock direto do método.
- JSDOM: Adicione polyfills (TextEncoder, etc) se a API Web estiver ausente.

### 2. Qualidade e Segurança
- Console: Zero console.log em código de feature/core.
- Imports: Remova variáveis não utilizadas (no-unused-vars).
- Aspas: Sempre aspas simples (quotes rule).
- RegExp: Justifique fontes dinâmicas com eslint-disable-next-line security.
- innerHTML: PROIBIDO. Use `DOMSafe.createElement` ou `textContent` (Issue-30).

### 3. Arquitetura
- Colocation: Não coloque testes de feature fora da pasta da feature.
- Ciclos: Evite dependências cíclicas entre features. Use shared/ se necessário.

---
[README](README.md)
