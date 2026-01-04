# Arquitetura e Tecnologias

[[README](README.md)] | [[ADR Index](architecture/)]

### 1. Stack Tecnológica
- Plataforma: Chrome Extension (Manifest V3)
- Linguagem: JavaScript (ES2024+)
- Tipagem: JSDoc + TypeScript Check
- Testes: Jest + jsdom
- Estilo: ESLint + Prettier

### 2. Princípios
- Screaming Architecture: Organização por domínios (features/).
- Local-First: Persistência exclusiva em chrome.storage. Zero backend.
- Minimalismo: Vanilla JS nativo sem frameworks ou build steps complexos.

### 3. Anatomia
- Side Panel: Interface principal (Shell).
- features/: Vertical Slices (Courses, Session, Settings).
- scripts/: Background (Eventos) e Content Scripts (Scraping).
- shared/: Componentes agnósticos (ver `utils/DOMSafe.js`).
- **Segurança**: Trusted Types Policy (`dom-safe-policy`) obrigatória para manipulação de DOM.

### 4. Camadas (Features)
- logic/: Regras puras.
- services/: I/O (DOM, APIs).
- repository/: Persistência.
- icons/ui/: Visual.
- models/: @typedefs.

Referência técnica: [Pasta Architecture](architecture/)
