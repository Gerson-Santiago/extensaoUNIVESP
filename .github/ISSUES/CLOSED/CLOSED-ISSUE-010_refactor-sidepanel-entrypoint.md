# ISSUE-010: Refatoração de Entrypoints (Sidepanel)

**Status**: Concluído (v2.9.5)
**Data**: 31/12/2025
**Responsável**: IA

## 1. O Problema
O `sidepanel.js` estava importando e chamando o `CourseRepository` diretamente para a função de "Limpar Cursos", violando a arquitetura de camadas (View -> Repository). Além disso, o Sidepanel concentrava muita responsabilidade de orquestração.

## 2. A Solução
- **Encapsulamento**: Adicionado o método `clearAll()` na classe `CourseService`.
- **Desacoplamento**: `sidepanel.js` agora importa apenas `CourseService` e delega a limpeza para ele.
- **Limpeza**: Removido o import do Repositório no arquivo de UI.

## 3. Resultados
- Melhor separação de conceitos (SoC).
- Sidepanel agora atua apenas como orquestrador de serviços.
- Código mais fácil de testar (mockando o Service em vez do Repository).

## 🔗 GitHub Issue

- **Status:** N/A  
- **Link:** Issue local concluída
- **Data:** -

---

