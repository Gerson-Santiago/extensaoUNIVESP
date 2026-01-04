# Produto e Negócio - Central Univesp

Este documento detalha o propósito da extensão, as regras de negócio acadêmicas e a filosofia de proteção de dados.

---

## 🎯 1. Propósito Único (Single Purpose)
A Central Univesp é um **Assistente Acadêmico Integrado**. Todas as suas funcionalidades convergem para um único objetivo: **Otimizar a produtividade do aluno no ecossistema UNIVESP (AVA e SEI).**

### Funcionalidades Unificadas:
- **Gestão de Tarefas**: Extração automática e acompanhamento de progresso.
- **Navegação Inteligente**: Atalhos contextuais e acesso rápido a semanas.
- **Automação de Login**: Preenchimento seguro de credenciais no SEI.

---

## ⚖️ 2. Regras de Negócio (v2.9.7)

### Organização de Cursos
- **Agrupamento**: Cursos são agrupados por período acadêmico (Ano/Semestre - Bimestre).
- **Ordenação**: O conteúdo mais recente aparece primeiro.
- **Semanas**: Identificação inteligente de Semanas 1-15 e **Semanas de Revisão**.

### Gestão de Dados
- **Persistência Dual**: 
  - `local storage`: Dados volumosos (cache de atividades).
  - `sync storage`: Configurações e progresso (sincronizado via conta Google).
- **Soberania**: O usuário pode exportar (Backup) ou apagar (Reset) todos os dados a qualquer momento.

---

## 🛡️ 3. Privacidade e Segurança de Dados

### Filosofia Local-First
Não existem servidores externos de aplicação. Seus dados morrem no seu navegador.
- **Zero Telemetria**: Não rastreamos seu comportamento.
- **Criptografia**: Credenciais e backups são protegidos com integridade SHA-256 e, futuramente, E2EE.

### Permissões (Strict Least Privilege)
- **ava.univesp.br**: Acesso necessário para scraping de atividades.
- **sei.univesp.br**: Acesso necessário para automação de login.
- **activeTab**: Usado preferencialmente para evitar acesso contínuo desnecessário.

---

## 🚀 4. Documentação de Apoio
- [Guia de Engenharia](ENGENHARIA.md)
- [Conformidade Chrome Web Store](CONFORMIDADE.md)
- [Roadmap de Evolução](ROADMAP.md)

---
[Voltar para o Índice](README.md)
