# 🛑 Antes de Mudar: O Protocolo de Segurança

> *"Refatoração sem testes não é refatoração, é apenas mudança de código arriscada."*

Você mencionou que uma tentativa anterior falhou. Migrações de arquitetura (especialmente para Screaming/Domain-Driven) geralmente falham por **4 motivos capitais**.

Aqui está o que deve ser feito **ANTES** de mover o primeiro arquivo.

---

## 1. A Rede de Segurança (The Safety Net)
**O Erro Comum:** Mover arquivos e tentar "consertar os bugs depois".
**O Correto:** Ter uma suíte de testes que te dá confiança.

*   **Pré-requisito:** Cobertura de Testes de Integração.
*   **Por que:** Quando você muda `CourseService.js` de lugar, o import quebra. Se você tem um teste, ele grita "Erro de Import!". Se não tem, você só descobre em produção quando o aluno clica no botão.
*   **Ação:** Antes de migrar, rode `npm test`. Se algo já estiver quebrado, **PARE**. Conserte primeiro (Green State).

## 2. Mapeamento de Dependências (The Map)
**O Erro Comum:** "Circular Dependency Hell". Você move A para pasta X, e B para pasta Y. Mas A precisa de B e B precisa de A. O bundler (Webpack/Vite) explode ou entra em loop.
**O Correto:** Desenhar o grafo de dependência atual.

*   **Ação:** Identificar os "God Objects" (arquivos que todo mundo importa, ex: `utils/storage.js`). Esses devem ser movidos para `shared/` ou `core/` **PRIMEIRO**, antes de qualquer feature. Se você mover a `Feature A` antes do `Core`, a `Feature A` vai tentar importar algo que ainda não está no lugar certo.

## 3. Code Freeze (O Sinal Vermelho)
**O Erro Comum:** Tentar trocar o pneu com o carro andando. Um dev está migrando pastas, outro está criando uma "Nova Feature" na estrutura antiga.
**Resultado:** Merge Conflicts impossíveis de resolver. Arquivos duplicados e imports fantasmas.

*   **Ação:** Durante a migração estrutural (especialmente a Fase 1 e 2 do nosso plano), **ninguém cria features novas**. A branch `dev` vira zona de construção exclusiva.

## 4. Estratégia Strangler Fig (A Figueira Estranguladora)
**O Erro Comum:** "Big Bang Rewrite". Tentar mover TUDO num fim de semana.
**Resultado:** Segunda-feira de manhã nada funciona e o rollback é impossível.

*   **O Correto:** Mover **UMA** feature pequena e isolada (ex: `features/auth` ou `features/import`).
    1.  Crie a pasta nova.
    2.  Mova os arquivos.
    3.  Arrume os imports SÓ dessa feature.
    4.  Rode os testes.
    5.  Faça o deploy/merge.
    6.  Respire.
    7.  Vá para a próxima.
    *Isso permite que você pare no meio se der errado, sem destruir o projeto.*

---

## Diagnóstico da Falha Anterior

Provavelmente a tentativa falhou porque:
1.  Faltaram testes para garantir que a mudança de caminho não quebrou a lógica.
2.  Moveram-se coisas demais ao mesmo tempo (Big Bang), perdendo o controle dos imports (`../../../../utils`).
3.  Misturou-se "Refatoração de Pastas" com "Refatoração de Código" (Mudar o lugar E mudar a lógica ao mesmo tempo = Suicídio).

**Regra de Ouro:** Quando mudar a estrutura, **NÃO** mude o código (exceto imports).
