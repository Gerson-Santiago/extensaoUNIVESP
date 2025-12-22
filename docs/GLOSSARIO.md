# Glossário Técnico (Ubiquitous Language)

Definição estrita dos termos utilizados no domínio do projeto.

---

## 1. Entidades de Domínio

### AVA (Ambiente Virtual de Aprendizagem)
Sistema Blackboard utilizado pela UNIVESP. Fonte primária de dados para scraping.

### Feature
Unidade funcional autônoma do sistema. Representa um Bounded Context na arquitetura.
- Ex: `courses`, `session`, `settings`.

### View
Interface gráfica de alto nível que ocupa a área principal do painel lateral. Equivalente a uma "Página" em SPAs.
- Ex: `CoursesView`, `HomeView`.

### Component
Elemento de interface reutilizável e de escopo menor que uma View.
- Ex: `WeekItem`, `CourseItem`, `Modal`.

---

## 2. Conceitos Técnicos

### Screaming Architecture
Padrão arquitetural onde a estrutura de diretórios comunica a intenção de negócio do sistema. 

### Isolated World
Contexto de execução dos Content Scripts no Chrome, onde compartilham o DOM da página hospedeira mas possuem um escopo JavaScript isolado (sem acesso às variáveis window da página).

### Service Worker (Background)
Script de event-handling que roda em background, independente da interface gráfica. Responsável pela persistência e lógica de longa duração.

### Repository Pattern
Padrão de acesso a dados que abstrai a fonte de persistência (`chrome.storage`), oferecendo uma interface de coleção para o domínio.

### Scraper
Serviço especializado em extrair dados estruturados a partir do DOM de páginas HTML (AVA/SEI).

---

## 3. Diferenciações Importantes

| Termo | Definição | Contraparte |
| :--- | :--- | :--- |
| **Logic** | Regras de negócio puras (Testável unitariamente). | **Service** (Integração externa/IO). |
| **Feature** | Módulo de domínio específico. | **Shared** (Módulo genérico reutilizável). |
| **Modal** | Overlay de interrupção temporária. | **View** (Navegação persistente). |
