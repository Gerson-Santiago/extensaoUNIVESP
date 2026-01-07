# 🗄️ BACKLOG (Blocklog)

Este documento centraliza ideias, débitos técnicos e funcionalidades futuras que ainda não estão priorizadas em um Roadmap de Release.

> **Status:** 🚧 Em construção
> **Priorização:** Review mensal

---

## 🔧 Débitos Técnicos (Tech Debt)

- [ ] **Refatoração do Seletor de Scraper (Issue-001)**: Remover lógica legada de seleção baseada em URL frágil.
- [ ] **Migração para CSS Modules/JSS**: Avaliar viabilidade para isolar estilos da extensão da página da UNIVESP.
- [ ] **Testes E2E com Puppeteer/Playwright**: Automatizar fluxos completos de instalação e login.

## 💡 Ideias & Sugestões (Inception)

### Funcionalidades
- **Dark Mode forcing**: Forçar tema escuro no AVA mesmo sem suporte nativo.
- **Integração com Calendar**: Exportar prazos de atividades para Google Calendar/.ics.
- **Calculadora de Notas**: Simulação de notas para atingir média.

### Infraestrutura
- **Analytics Privado**: Coleta de erros anônima (Sentry self-hosted ou similar) - *Requer revisão de privacidade*.
- **CI/CD no GitHub Actions**: Pipeline completo de build e teste na nuvem.

## 🚫 Won't Do (Descartados)

- **Chatbot Interno**: Complexidade alta, valor baixo.
- **Sync na Nuvem**: Viola princípio Local-First (por enquanto).

---

[Voltar para Roadmap](ROADMAP.md)
