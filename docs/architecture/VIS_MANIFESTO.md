# Manifesto: Screaming Architecture
Status: v2.9.7 | Padrão: Vertical Slices

Pilares:
- Intenção sobre Ferramenta: Negócio (UNIVESP) > UI.
- Domínio: features/ agrupa UI, Lógica e Dados.
- CCP: Coisas que mudam juntas ficam juntas.
- Dependência: Domínio agnóstico de I/O.

Regras:
- Relativo é Lei: Imports locais sempre relativos.
- Zero Broken Windows: Branch sempre verde.
- Zero Console Log: Usar Logger.js.
- Refatoração exige teste de integração.
