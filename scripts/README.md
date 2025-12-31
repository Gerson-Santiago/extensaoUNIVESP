# � Scripts de Manutenção (DevTools)

Esta pasta contém scripts Shell (.sh) para auxílio na manutenção e análise estática do código-fonte da extensão.

> **Nota**: Estes scripts são para uso interno dos desenvolvedores (manutenção da qualidade) e não impactam a extensão em produção.

---

## �️ Scripts Disponíveis

| Script | Descrição | Uso Típico |
|--------|-----------|------------|
| [`dashboard.sh`](./dashboard.sh) | **Painel Principal**. Exibe um resumo completo do projeto: Contagem de linhas, proporção código/testes, e peso por Feature. | `./scripts/dashboard.sh` |
| [`rows.sh`](./rows.sh) | Contador simples de linhas de código (LOC) para arquivos JavaScript. | `./scripts/rows.sh` |
| [`path.sh`](./path.sh) | Utilitário para listar caminhos de arquivos de uma forma limpa (ignora node_modules, .git, etc). | `./scripts/path.sh` |
| [`all_path.sh`](./all_path.sh) | Similar ao `path.sh`, mas com escopo mais abrangente. | `./scripts/all_path.sh` |
| [`ver_log.sh`](./ver_log.sh) | Utilitário para visualização rápida de logs ou arquivos específicos. | `./scripts/ver_log.sh` |

---

## 🚀 Como Usar

A partir da raiz do projeto, certifique-se que o script tem permissão de execução e rode:

```bash
chmod +x scripts/*.sh

# Visualizar o Dashboard do Projeto
./scripts/dashboard.sh
```

## 🏗️ Manutenção

Esses scripts devem ser mantidos leves e sem dependências de NPM (pure bash) sempre que possível, para garantir execução rápida em qualquer ambiente Unix-like.
