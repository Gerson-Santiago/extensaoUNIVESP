# 🛡️ ISSUE-035: Privacy Policy & Data Handling Disclosure

**Status:** 📋 Aberta  
**Prioridade:** 🔴 Crítica (Legal/CWS Requirement)  
**Componente:** `Governance`, `Documentation`  
**Versão:** v2.10.0+

---

## 🎯 Objetivo
Criar uma **Política de Privacidade** válida e hospedá-la publicamente, conforme exigido pela Chrome Web Store para extensões com host_permissions.

## 📖 Contexto: Obrigatoriedade Legal

**Regra da CWS:** Se a extensão:
- Usa `host_permissions` (acessa conteúdo de páginas), OU
- Usa `content_scripts`, OU
- Coleta/transmite dados do usuário

...então **Privacy Policy é OBRIGATÓRIA**.

### Consequência de Não Conformidade
- ❌ Rejeição automática na submissão.
- ❌ Link quebrado ou genérico (ex: "privacy-policy-generator.com") = rejeição.

## 🛠️ Requisitos Técnicos

### 1. Criar `PRIVACY_POLICY.md`
Estrutura obrigatória:
```markdown
# Política de Privacidade - Central Univesp

## Dados Coletados
- Cursos e atividades do AVA UNIVESP (armazenados localmente via chrome.storage).
- URLs visitadas APENAS em sei.univesp.br e ava.univesp.br.

## Transmissão de Dados
- ❌ NÃO transmitimos dados para servidores externos.
- ✅ Dados permanecem 100% no dispositivo do usuário.

## Acesso de Terceiros
- Nenhum. Não usamos analytics, ads ou trackers.

## Criptografia
- Dados sensíveis (se houver tokens) são criptografados antes do armazenamento.

## Contato
- Email: [contato]
- GitHub: [repo]
```

### 2. Hospedar Publicamente
- **Opção 1:** GitHub Pages (`https://gerson-santiago.github.io/extensaoUNIVESP/privacy`)
- **Opção 2:** Site estático (Netlify/Vercel)

### 3. Adicionar ao Manifesto Listing
- No painel do desenvolvedor da CWS, campo "Privacy Policy URL": Link HTTPS válido.

### 4. 🛡️ Segurança (ADR-012)
- **Log Sanitization:** Garantir que logs de diagnóstico (Issue-023) NÃO exponham tokens ou dados do usuário.
- **Divulgação Proeminente:** Se futuramente coletar dados, adicionar aviso na UI (não apenas na policy).

## ✅ Critérios de Aceite
- [ ] `PRIVACY_POLICY.md` criado, revisado e publicado.
- [ ] Link HTTPS funcional (não retorna 404).
- [ ] Policy menciona **especificamente** AVA e SEI (não genérica).

---

**Relacionado:** [CWS Privacy Requirements](https://developer.chrome.com/docs/webstore/program-policies/privacy/)  
**Tags:** `//ISSUE-mv3-privacy` | **Tipo:** Legal/Compliance
