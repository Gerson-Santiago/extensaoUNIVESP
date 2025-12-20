> Status: Active
> Last Update: 2025-12-20
> Owner: Gerson Santiago

# 📖 Glossário (Ubiquitous Language)

Este documento define os termos centrais do projeto para evitar ambiguidades. Quando discutir arquitetura ou negócio, use estes termos.

---

## 🎓 Domínio de Negócio

### AVA (Ambiente Virtual de Aprendizagem)
Plataforma Blackboard da UNIVESP onde os alunos acessam conteúdo de aulas, semanas e materiais. É o sistema de origem dos dados que scrapamos.

### SEI (Sistema Eletrônico de Informações)
Portal de secretaria acadêmica. Usamos para verificar notas e documentos. A extensão preenche automaticamente o email no login.

### RA (Registro Acadêmico)
Identificador único do aluno (ex: `2123456`). Usado para login e identificação.

### Term / Período Letivo
Conjunto de cursos de um bimestre específico (ex: `2025/1 - 1º Bimestre`). Usado para agrupar matérias visualmente.

### Semana
Unidade de conteúdo dentro de um curso no AVA. Cada semana contém vídeos, PDFs e atividades.

### Curso / Matéria
Disciplina acadêmica (ex: "Cálculo I"). No código, representado pela classe/objeto `Course`.

---

## 🏗️ Arquitetura (Screaming Architecture)

### Feature
**Definição**: Unidade funcional independente que representa um caso de uso de negócio.

**Estrutura**: Cada feature contém `ui/`, `logic/`, `data/`, `services/`, `tests/`.

**Exemplo**: `features/courses/` (com submódulo `import/`), `features/settings/`.

**Regra**: Features não conhecem detalhes de implementação de outras features (baixo acoplamento).

---

### View
**Definição**: Tela completa que ocupa toda a área útil do Side Panel (exceto TopNav).

**Localização**: `features/*/views/` ou `features/*/ui/` (dependendo da convenção da feature).

**Diferença de Component**: Uma View é uma tela inteira. Um Component é um widget reutilizável.

**Exemplo**: `CoursesView` (View que lista cursos), `HomeView` (tela inicial), `SettingsView` (tela de configurações).

---

### Component
**Definição**: Widget reutilizável, menor que uma View. Pode ser usado em múltiplas telas.

**Localização**: `features/*/components/` ou `shared/ui/`.

**Diferença de View**: Um Component é parte de uma View, não uma tela completa.

**Exemplo**: `CourseItem` (card de curso), `Modal` (overlay reutilizável), `ActionMenu` (dropdown).

---

### Modal
**Definição**: Componente especial que sobrepõe a View atual para uma tarefa interruptiva e curta.

**Diferença de View**: Modal não muda a rota/navegação principal. É temporário.

**Exemplo**: `AddManualModal`, `BatchImportModal`, `LoginWaitModal`.

---

### Repository
**Definição**: Camada de acesso a dados. Abstrai `chrome.storage` ou qualquer outra persistência.

**Responsabilidade**: CRUD (Create, Read, Update, Delete) de entidades de negócio.

**Exemplo**: `CourseRepository` (gerencia cursos no storage).

**Regra**: Repository NÃO contém lógica de negócio, apenas acesso a dados.

---

### Service
**Definição**: Classe que encapsula operações externas ou complexas (scraping, parsing, HTTP).

**Diferença de Logic**: Service lida com mundo externo. Logic contém regras de negócio puras.

**Exemplo**: `ScraperService` (extrai dados do AVA), `BatchScraper` (importação em lote).

---

### Logic
**Definição**: Regras de negócio puras, agnósticas de UI e infraestrutura.

**Testabilidade**: Deve ser 100% testável unitariamente sem mocks de DOM ou chrome.storage.

**Exemplo**: `CourseGrouper` (agrupa cursos por termo), `TermParser` (extrai bimestre de string).

---

### Scraper
**Definição**: Serviço especializado em extrair dados de páginas web via DOM.

**Por que não API?**: O AVA não tem API pública, então lemos o HTML diretamente.

**Exemplo**: `ScraperService.scrapeWeeksFromTab()`.

---

## ⚙️ Padrões e Convenções

### Host-Agnostic
**Definição**: Código que não sabe onde está rodando (Sidepanel, Popup, Content Script).

**Benefício**: Facilita reutilização e testes.

### Screaming Architecture
**Definição**: Estrutura de pastas que "grita" o domínio de negócio, não o framework.

**Exemplo**: Ao abrir `features/`, você vê `courses/`, `import/`, `session/` (casos de uso), não `controllers/`, `views/`, `models/`.

### Local-First
**Definição**: Toda persistência ocorre no dispositivo do usuário (`chrome.storage`). Zero backend proprietário.

**Implicação**: Privacidade total e funcionamento offline.

### Zero-Backend
**Definição**: A extensão não depende de servidores próprios. Apenas scraping de sites públicos (AVA, SEI).

---

## 🔄 Diferenças Sutis (Evite Confusão)

| Termo A | vs | Termo B | Diferença Principal |
|:---|:---:|:---|:---|
| **View** | ≠ | **Component** | View = tela completa. Component = widget reutilizável. |
| **Service** | ≠ | **Logic** | Service = mundo externo. Logic = regras puras. |
| **Repository** | ≠ | **Service** | Repository = CRUD de dados. Service = operações complexas. |
| **Modal** | ≠ | **View** | Modal = overlay temporário. View = tela persistente na navegação. |
| **Feature** | ≠ | **Shared** | Feature = domínio específico. Shared = reutilizável sem domínio. |

---

> **Regra de Ouro**: Se você não sabe onde colocar código novo, consulte este glossário e a arquitetura (`TECNOLOGIAS_E_ARQUITETURA.md`).
