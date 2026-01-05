# Workflow de Lançamento (Release Pipeline)

Este documento descreve o processo profissional para gerar uma nova versão da Central Univesp para a Chrome Web Store.

---

## 🚀 1. Ciclo de Preparação

Antes de cada lançamento, o pipeline garante que a qualidade do código está impecável.

### Passo 1: Atualizar Versão
A versão deve ser atualizada no `package.json`. O sistema sincronizará o `manifest.json` automaticamente.
```bash
# Exemplo: atualizando para v2.10.0
# Edite o package.json -> "version": "2.10.0"
```

### Passo 2: Executar o Pipeline
O comando abaixo executa o **Quality Gate** (Lint + Types) e gera o artefato final.
```bash
npm run build
```

---

## 🏗️ 2. O que acontece nos bastidores?

O script `scripts/build-dist.js` executa as seguintes tarefas:

1.  **Quality Gate**: Executa `npm run check`. Se houver qualquer erro de tipo ou aviso de lint, o build é interrompido.
2.  **Version Sync**: Lê a versão do `package.json` e escreve no `manifest.json` para evitar divergências.
3.  **Higiene de Ativos**: Cria uma pasta `dist/` limpa, contendo apenas o código de produção, ícones e assets. Ignora testes e documentação técnica.
4.  **Artefato ZIP**: Gera um arquivo `.zip` versionado pronto para upload.

---

## 📦 3. Submissão na CWS

1.  Acesse o [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole).
2.  Selecione a extensão **Central Univesp**.
3.  Vá em **Pacote** -> **Enviar nova versão**.
4.  Arraste o arquivo `central-univesp-vX.Y.Y.zip` gerado na raiz.
5.  Consulte o [Guia de Submissão](../CWS_SUBMISSION_GUIDE.md) para os textos de justificativa.

---

## 🛡️ 4. Regras de Segurança

- **Zero Remote Code**: O pipeline bloqueia qualquer arquivo que não esteja no pacote local.
- **XSS Prevention**: O build exige que o `npm run check` passe, validando o uso de `DOMSafe` e `Trusted Types`.
- **Least Privilege**: O manifest processado contém apenas as permissões auditadas.

---
[Voltar para Engenharia](../ENGENHARIA.md)
