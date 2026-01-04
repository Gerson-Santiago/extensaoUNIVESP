# Master Roadmap: Publicação Chrome Web Store

**Versão**: 1.0 (02/01/2026)  
**Meta**: Publicação MVP Seguro (v2.10.0)

## 📅 Timeline Consolidado

**Caminho Crítico**: EPIC-001 (Security) + EPIC-003 (Compliance) = **8-11 dias**

### Semana 1: Segurança Hardcore (5 dias)
**Foco**: Eliminar XSS e Race Conditions (EPIC-001)

- ~~**Dia 1-2**: **SPEC-001** (DOM Safe Refactoring)~~ ✅ **CONCLUÍDO (04/01/2026)**
  - ~~Refatorar 11 arquivos críticos (Modal, Views, Factory).~~
  - ~~Implementar `DOMSafe.js`.~~
- ~~**Dia 3-4**: **SPEC-004** (Storage Concurrency)~~ ✅ **CONCLUÍDO (03/01/2026)**
  - ~~Implementar `StorageGuard.js` e atualizar Repositories.~~ ✅
  - ~~Testes de concorrência.~~ ✅
- **Dia 5**: Testes de Segurança + **SPEC-002** (Single Purpose) + **SPEC-003** (Content Scripts).

### Semana 2: Compliance Final (3-6 dias)
**Foco**: Preparar pacote para CWS (EPIC-003)

- **Dia 6**: **SPEC-033** (Permissions Justification) + **SPEC-035** (Privacy Policy).
- **Dia 7**: **SPEC-034** (Service Worker Polish) + **SPEC-038** (SidePanel UX).
- **Dia 8-11**: **SPEC-036** (Store Assets/Screenshots) + QA Final.
- **Dia 12**: 🚀 **SUBMISSÃO CWS**

---

## 🛑 O Que Ficou Fora (v2.11.0)
- **EPIC-002**: Data Sovereignty / Settings UI Avançada (9 dias).
- Issue-031: Type Safety Refinement (Já está bom o suficiente).
- Features "Nice to have" de UI.

## ✅ Milestones
- [/] **M1 (Dia 5)**: Codebase Seguro (~~Zero XSS~~ ✅, ~~Zero Race Conditions~~ ✅).
- [ ] **M2 (Dia 8)**: Compliance Administrativa (Docs prontos).
- [ ] **M3 (Dia 11)**: Pacote Final (Zipado e testado).
- [ ] **M4 (Dia 12)**: Publicado.
