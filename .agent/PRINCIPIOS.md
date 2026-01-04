# PRINCÍPIOS DE DOCUMENTAÇÃO PARA IA

v2.9.7 | 2026-01-01

PROIBIDO:
1. Emojis
2. Decoração (---, ***, ===, #, ##, ###)
3. Bold/italic
4. Linhas vazias > 1
5. Code blocks (usar texto simples)
6. Texto prolixo
7. Redundância
8. Arquivos > 100L (CORE) ou > 50L (WORKFLOWS)
9. Refs desatualizadas
10. Prosa

OBRIGATÓRIO:
1. Texto limpo
2. Imperativo
3. Listas
4. Refs não duplicar
5. Versionamento
6. DRY (1 info = 1 lugar)
7. Hierarquia: CORE < 100L, WORKFLOWS < 50L
8. Consistência
9. Atomicidade
10. Manutenibilidade (1 mudança = 1 arquivo)

HIERARQUIA:
CORE (.agent/rules/) ~100L
WORKFLOWS (.agent/workflows/) ~50L
REFS (docs/) sob demanda

FORMATO:
description: [curta]
Título
Conteúdo
Refs: [links]

MÉTRICAS BOM:
< 100L (CORE) ou < 50L (WORKFLOWS)
0 emojis
0 decoração
0 redundâncias
Refs OK
Imperativo

MÉTRICAS RUIM:
> limites
Repetição
Emojis/decoração
Prolixo
Refs quebradas

CHECKLIST PRÉ-COMMIT:
[ ] 0 emojis
[ ] 0 decoração
[ ] Imperativo
[ ] Listas
[ ] Refs válidas
[ ] Versão atualizada
[ ] Dentro limites

NUNCA:
Copiar-colar
Decorar
Prosa
Ultrapassar limites
Refs quebradas

SEMPRE:
Referenciar
Texto limpo
Listas
Validar refs
Atualizar versão

v2.11.0 | 2026-01-04
