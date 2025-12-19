> Status: Active
> Last Update: 2025-12-18
> Owner: Gerson Santiago

# 📖 Glossário do Projeto

Este documento define os termos onipresentes no código para evitar ambiguidades (Ubiquitous Language).

## Domínio (Business)
*   **AVA**: Ambiente Virtual de Aprendizagem (Blackboard).
*   **SEI**: Sistema de Secretaria.
*   **RA**: Registro Acadêmico (ID do aluno).
*   **Term (Período)**: O conjunto letivo (Ex: 2025/1 - Bimestre 1).

## Arquitetura (Tech)
*   **Screaming Architecture**: Organização por pastas de feature (`features/courses`), não por tipo (`views/`).
*   **Host-Agnostic**: Componentes que não sabem onde estão rodando (Sidepanel vs Popup vs Page).
