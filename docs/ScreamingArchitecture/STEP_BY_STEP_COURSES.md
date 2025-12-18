# 👣 Step-by-Step: Feature Cursos (O Core)

> **Branch**: `refactor/courses-feature`

## 0. Preparação
- [ ] 0.1. Criar branch `refactor/courses-feature` a partir de `dev`.
- [ ] 0.2. Criar pastas: `features/courses/{components,logic,data,services,tests}`.

## 1. Movimentação Leve (Satélites)
Mover arquivos que não dependem de quase ninguém, para "limpar a área".
- [ ] 1.1. **Utils**: Mover `sidepanel/utils/termParser.js` e `courseGrouper.js` -> `features/courses/logic/`.
- [ ] 1.2. **Components**: Mover `CourseItem.js`, `WeekItem.js` -> `features/courses/components/`.
- [ ] 1.3. **Services**: Mover `ScraperService.js` -> `features/courses/services/`.
- [ ] 1.4. **Testes**: Mover testes correspondentes para `features/courses/tests/`.
- [ ] 1.5. **Fix**: Corrigir imports nesses arquivos (usar `@features`, `@shared`).
- [ ] **Check**: `npm run test` (Deve passar).

## 2. Movimentação Crítica (O Núcleo)
Mover o Repositório, que é usado por todo mundo.
- [ ] 2.1. **Data**: Mover `CourseRepository.js` -> `features/courses/data/`.
- [ ] 2.2. **Teste**: Mover `storage.test.js` -> `features/courses/tests/`.
- [ ] 2.3. **Fix Global**: Substituir imports de `CourseRepository` em TODO o projeto (`sidepanel.js`, `BatchImportModal`, etc).
- [ ] **Check**: `npm run test` (Crítico).

## 3. Lógica & View
- [ ] 3.1. **Service**: Mover `CourseService.js` -> `features/courses/logic/`.
- [ ] 3.2. **View**: Renomear e Mover `CoursesView.js` -> `features/courses/components/CoursesList.js`.
- [ ] 3.3. **Fix**: Atualizar `sidepanel.js` para importar `CoursesList`.
- [ ] **Check**: `npm run test`.

## 4. Refatoração: AutoScroll
- [ ] 4.1. **Extrair**: Criar `features/courses/logic/AutoScroll.js` com o conteúdo de `handleAutoScroll` da View.
- [ ] 4.2. **Limpar**: Remover lógica da `CoursesList.js` e apenas chamar a nova função.
- [ ] 4.3. **Teste**: Mover `AutoScroll.test.js` e garantir que testa o novo arquivo.

## 5. Finalização
- [ ] 5.1. **Manifest**: Verificar se `sidepanel.html` ou `manifest.json` precisam de ajuste (provavelmente não, pois só mudou JS).
- [ ] 5.2. **Imports Audit**: Verificar se sobrou algum `../../` feio que poderia ser alias.
- [ ] 5.3. **Manual Test**: Abrir extensão, carregar cursos, adicionar curso, rodar autoscroll.
