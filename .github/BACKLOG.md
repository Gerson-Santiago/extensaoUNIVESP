# 🎯 Backlog Estratégico (Visão de Produto v2.10.0)

Este documento é o repositório central de todo o trabalho potencial, servindo como o mapa estratégico para a evolução da extensão UNIVESP como um produto maduro e enxuto.

---

## 🏗️ 1. Preferências do Usuário (Ergonomia Visual)
*Ajustes que melhoram o conforto sem alterar a lógica do sistema.*
- **[x] Densidade Visual**: Toggle `Compacto` vs `Confortável` (Redução de paddings para usuários com muitas matérias). ✅ ISSUE-022

## 🏗️ 2. Comportamento da Aplicação (Ajustes de Fluxo)
*Ajustes de "como funciona", focados na redução de fricção.*
- **[x] Auto-Pin (Última Semana)**: ✅ ISSUE-022
  - Ao carregar um curso, verificar no `storage` qual foi o último `weekNumber` expandido.
  - Se ativado, acionar o evento de expansão automaticamente.
- **[ ] Automação Sob Demanda**: Opção para desativar a execução automática ao carregar a página (rodar apenas ao clicar em Refresh).
- **[ ] Feedback Contextual**: Ativar/Desativar badge no ícone e alertas (Toasts).

## 🏗️ 3. Permissões e Privacidade (Governança de Dados)
*Obrigatório para transparência e controle soberano do usuário.*
- **[x] Sistema de Backup**: ✅ ISSUE-019
  - Exportar / Importar o estado acadêmico com integridade.
  - **Meta-Informação:** Incluir no JSON a data e versão da extensão.
  - **Restauração Segura:** Garantir que o `chrome.storage.local.clear()` seguido de `set()` não deixe o sistema em estado inconsistente em caso de erro.
  - **Feedback:** Notificar conclusão da exportação/importação via Toaster simples.
- **[x] Reset de Fábrica (Danger Zone)**: Botão para deletar absolutamente todos os dados locais. ✅ ISSUE-020
- **[ ] Painel de Transparência**: Texto explicando que os dados são 100% locais (Local-First).

## 🏗️ 4. Sobre / Diagnóstico (Suporte e Identidade)
*Conexão com a comunidade e ferramentas de solução de problemas.*
- **[ ] Central de Suporte**: Versão do produto, Link do GitHub, Reportar Bugs.
- **[ ] Toggle de Diagnóstico**: Habilitar/Desativar logs detalhados no console para suporte técnico.

---

## 🛠️ Checklist de Maturidade (v2.10.0)
Seguindo o padrão ouro para extensões Chrome:
- [ ] Ativar / Desativar funcionalidades (Master Switch).
- [ ] Onde a extensão atua (Contexto de sites/abas).
- [ ] Quando a extensão roda (Automação).
- [ ] Notificações (Feedback on/off).
- [ ] Limpar dados / Resetar (Privacidade).
- [ ] Versão + Suporte (Diagnóstico).

---

## 📐 Regra de Ouro Permanente
> **"Se não muda o comportamento da extensão, NÃO é configuração."**
> Configuração é **ESTADO** (`chrome.storage`). A UI apenas reflete e altera esse estado. O código principal não conhece a UI.

---

## 📥 Arquivo de Ideias (Aguardando Decisão / Baixa Prioridade)
Itens removidos das issues ativas por serem considerados "invenções de moda" ou sobre-engenharia no momento.

- **[ ] Checksum de Integridade no Backup**: Validar JSON via hash. (JSON.parse já valida sintaxe).
- **[ ] Barra de Progresso no Backup**: Operação é rápida demais para justificar UI complexa.
- **[ ] Seletor de Scroll (Smooth vs Instant)**: Navegação nativa já atende bem.
- **[ ] Accent Color Customizer**: Perfumaria visual de baixa prioridade.
- **[ ] Toggle de Animações**: Otimização prematura; as animações atuais são leves.
- **[ ] Dark Mode Toggle**: O navegador/SO já gerencia temas globais satisfatoriamente.
- **[ ] Créditos Detalhados**: Manter apenas versão e links por enquanto.

---
**Última Revisão**: 06/01/2026 | **Status**: Baseline v2.10.0 Implementada
