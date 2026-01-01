# ADR 000-A: Screaming Architecture
Status: Aceito (v2.6.0) | Data: 2025-12-18

Contexto: Estrutura MVC dificultava o onboarding.
Decisão: Organizar por Features (Features/Courses, Features/Import). Colocação de UI, Lógica e Testes na mesma pasta.
Consequências:
- Onboarding rápido e baixo acoplamento.
- Risco de poluição na pasta shared/.
