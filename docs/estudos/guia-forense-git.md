# 🕵️ Guia de Forense Git: Investigando o Passado Oculto

> **Objetivo:** Ensinar como rastrear ações que "desapareceram" do histórico oficial (`git log`), focando em branches deletadas e comandos voláteis.

Este guia foi criado a partir de um estudo de caso real onde precisávamos provar a existência de uma branch (`chore/audit-sync-docs`) que havia sido deletada.

---

## 1. O Conceito: Por que `git log` mente?

O comando `git log` mostra apenas a **história pública** e **sobrevivente** do projeto.
*   Se você deleta uma branch, os commits exclusivos dela ficam "órfãos" e somem do log padrão.
*   Se você faz um `rebase` ou `amend`, a história antiga é substituída.

Para ver a **história real** (todos os movimentos, inclusive os erros e desfazer), precisamos de ferramentas forenses.

---

## 2. As Ferramentas Forenses

### 🛠️ A Caixa Preta do Git: `git reflog`
O **Reflog** (Reference Logs) é o diário de bordo automático do Git. Ele grava **cada movimento do HEAD** (seu cursor local).
*   Fez checkout? Ele grava.
*   Mergeou? Grava.
*   Resetou? Grava.

**Comando Mágico:**
```bash
git reflog -n 20
```

**Como Ler:**
*   `HEAD@{0}`: Onde você está agora.
*   `HEAD@{5} checkout: moving from dev to feature`: Prova que você saiu de `dev` e foi para `feature` há 5 movimentos atrás.

### 🐚 A Memória do Shell: `history`
O Git não grava o comando textual que você digitou (ex: "apagar branch"). O Shell (Bash/Zsh) grava.

**Comando Mágico:**
```bash
history | grep "git branch -d"
# OU, se a sessão foi fechada e salva em disco:
cat ~/.bash_history | grep "git branch -d"
```

---

## 3. Estudo de Caso: O Mistério de `chore/audit-sync-docs`

**Cenário:** O desenvolvedor jurava que criou a branch, trabalhou nela e a deletou corretamente. O `git log` não mostrava nada disso, pois a branch já tinha ido embora.

**A Investigação:**

1.  **Busca no Reflog:**
    ```bash
    git reflog
    ```
    *Encontramos:*
    *   `HEAD@{5}: checkout: moving from dev to chore/audit-sync-docs` (Nascimento)
    *   `HEAD@{4}: checkout: moving from chore/audit-sync-docs to dev` (Retorno à base)

    ✅ **Conclusão:** A branch existiu e foi acessada.

2.  **Busca no Histórico:**
    ```bash
    history | grep "chore/audit-sync-docs"
    ```
    *Encontramos:*
    *   `git merge chore/audit-sync-docs` (Fusão)
    *   `git branch -d chore/audit-sync-docs` (Deleção)

    ✅ **Conclusão:** O ciclo de vida foi encerrado corretamente.

---

## 4. Receita de Bolo para Recuperação

Se você perdeu algo, siga esta ordem:

1.  **Olhe o Reflog imediatamente:**
    `git reflog`
    *(Se achar o commit perdido, use `git checkout <HASH>` para recuperá-lo)*.

2.  **Busque no histórico do Shell:**
    `history | grep "termo-chave"`

3.  **Nunca entre em pânico.** O Git raramente apaga dados imediatamente (o *Garbage ector* demora semanas). Se está no sua máquina recentemente, quase sempre é recuperável.
