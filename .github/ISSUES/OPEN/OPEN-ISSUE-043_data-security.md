# 🛡️ ISSUE-036: Segurança de Dados - Criptografia e Assinatura

**Status:** 📋 Aberta
**Prioridade:** 🟡 Média (Roadmap v2.11+)
**Componente:** `Security`, `Backup`

---

## 🎯 Objetivo
Elevar o nível de segurança dos backups da extensão, implementando criptografia ponta-a-ponta (E2EE) opcional para proteger dados sensíveis exportados.

## 📝 Descrição
Atualmente (v2.10.0), os backups possuem **Verificação de Integridade (SHA-256 Checksum)**, garantindo que o arquivo não foi corrompido ou adulterado acidentalmente. 

No entanto, o arquivo JSON é legível por qualquer pessoa que tenha acesso a ele. Além disso, um atacante motivado poderia alterar o arquivo e **gerar um novo checksum válido**, já que o algoritmo SHA-256 é público.

**Distinção Importante:**
- **Checksum Atual (ISSUE-019)**: Protege contra **Corrupção de Dados** (falhas de disco, download incompleto).
- **Assinatura Digital (Esta Issue)**: Protege contra **Adulteração Maliciosa** (Hacker re-assinando o arquivo).

O objetivo desta issue é implementar opções para criptografar esse arquivo com uma senha e/ou assiná-lo digitalmente com uma chave privada.

## 🛠️ Requisitos Funcionais

### 1. Criptografia (Encryption)
- [ ] Adicionar opção "Criptografar com Senha" no modal de exportação.
- [ ] Usar **AES-GCM (256-bit)** via Web Crypto API.
- [ ] Derivar chave da senha usando **PBKDF2** (com alto número de iterações, min 100k).
- [ ] Armazenar `salt` e `iv` no cabeçalho do arquivo (não criptografado).

### 2. Descriptografia (Decryption)
- [ ] Detectar se o arquivo está criptografado (flag no `meta`).
- [ ] Solicitar senha ao usuário antes de iniciar o parse.
- [ ] Validar a senha (tentar descriptografar e verificar integridade/tag).

### 3. Assinatura Digital (Opcional/Future)
- [ ] Permitir assinar o backup com uma chave privada gerada na extensão (Key Pair).
- [ ] Validar autoria do backup.

## 🔗 Referências
- [Web Crypto API - AES-GCM](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt)
- [PBKDF2 Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

---
**Tags:** `//ISSUE-security-data` | **Sprint:** Backlog
