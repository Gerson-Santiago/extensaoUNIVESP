# 🗣️ Manifesto de Visão: Screaming Architecture
**Status:** Ativo | **Última Atualização:** 2025-12-31 (v2.9.5)

### 🏗️ Pilares da Arquitetura
1. **Intenção sobre Ferramenta**: O negócio (UNIVESP) manda; a UI é detalhe.
2. **Features como Cidadãs**: Código organizado por domínio (`features/`).
3. **Common Closure Principle**: Coisas que mudam juntas ficam juntas.
4. **Dependência para Dentro**: O domínio nunca sabe sobre o mecanismo (ex: DOM).

### 🏆 A Base de Ouro (Blueprints)
- **Independência**: Features isoladas (Notes, Grades, Chat).
- **Escalabilidade**: Extensão cresce sem poluir o `sidepanel/`.
- **Testabilidade**: Lógica de negócio pura = Teste fácil.

### 🛡️ Regras de Ouro (The Law)
1. **Conteúdo > Nome**: Leia o arquivo antes de mover. Imports ditam o destino.
2. **Zero Broken Windows**: Não quebre a branch sem plano de conserto imediato.
3. **Relativo é Lei**: Imports em produção DEVEM ser relativos.
4. **Refat = Teste**: Mudança estrutural exige teste de integração verde.
5. **Separar Preocupações**: Lugar de mudar estrutura não é lugar de mudar lógica.
6. **Zero Console Log**: Logs são dados, não frases. Use `Logger.js`. (Limpeza massiva v2.9.2 e v2.9.5).

### 🔍 Exemplo Real: `DetailsActivitiesWeekView`
Esta pasta é o "coração quente" do projeto. Sua estrutura grita sua função:
```text
DetailsActivitiesWeekView/
├── index.js (Regente)
├── ViewTemplate.js (HTML/Layout)
├── HeaderManager.js (Topo Dinâmico)
├── ChipsManager.js (Navegação Contextual)
├── SkeletonManager.js (Estado de Loading)
├── ActivityRenderer.js (Renderização de Lista)
├── ActivityItemFactory.js (Criação de Itens)
└── handlers/ (Ações: Clear, Refresh)
```
**Por que isso grita?**
- Não é apenas uma "View". É um ecossistema.
- Se o **Header** quebra, você vai em `HeaderManager.js`.
- Se o **Loading** trava, você vai em `SkeletonManager.js`.
- A intenção está na cara do desenvolvedor, não escondida em pastas genéricas.

---
*Referência Técnica: [ADR 000-A](./ADR_000_A_SCREAMING_ARCHITECTURE.md)*
