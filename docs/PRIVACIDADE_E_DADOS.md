# Privacidade e Dados

[[README](README.md)]

### 1. Filosofia Local-First
A extensão opera sem servidores da aplicação. Todos os dados residem no navegador do usuário.

### 2. Tratamento de Dados
- RA/Email/Cursos: Armazenados em chrome.storage.sync (criptografado pelo Google) para sincronia entre dispositivos.
- Logs: Apenas para diagnóstico local. Zero telemetria externa.
- Senhas: Jamais solicitadas ou armazenadas pela extensão.

### 3. Permissões (Strict Least Privilege)
- Host: Restrito a `ava.univesp.br` e `sei.univesp.br`.
- Storage: Para cache de atividades e configurações.

### 4. Conformidade CWS
A extensão segue rigorosamente as políticas da Chrome Web Store. Para mais detalhes legislativos, consulte nossa [Política de Privacidade Formal](./governance/PRIVACY_POLICY.md) e a [Justificativa de Permissões](./governance/CWS_PERMISSION_JUSTIFICATION.md).
---
[README](README.md)
