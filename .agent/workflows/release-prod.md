---
description: Realiza o merge da dev para main (Release) com verificação de segurança.
---

Este workflow realiza o processo de release da `dev` para a `main` de forma segura.

1. Garante que estamos na dev atualizada
   - `git switch dev`
   - `git pull origin dev`

2. Executa verificações de segurança (Turbo Check)
   - `npm run lint`
   - `npm test`

3. Realiza o Merge para Produção
   - `git switch main`
   - `git pull origin main` (Garante base atualizada)
   - `git merge dev` (Traz as novidades)

4. Publica a versão
   - `git push origin main`

5. Retorna para dev
   - `git switch dev`

> **Nota:** Se houver conflitos no passo 3, o comando falhará e você deverá resolver manualmente.
