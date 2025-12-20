# 🦅 Auditoria Técnica

Este documento apresenta uma análise objetiva da qualidade de engenharia do projeto **AutoPreencher UNIVESP**, demonstrando conformidade com padrões de excelência técnica adotados por empresas de tecnologia de ponta.

## 1. Arquitetura & Design
*   **Screaming Architecture**: O projeto não esconde suas intenções. A estrutura de pastas (`features/`) reflete o domínio de negócio, facilitando onboarding instantâneo de novos engenheiros.
*   **Domain-Driven Design (DDD)**: Separação clara entre `Logic` (Negócio), `Data` (Persistência) e `UI` (Apresentação).
*   **Zero-Backend**: Alinhado com a iniciativa **Privacy Sandbox**. Toda a inteligência reside no cliente (Client-Side Intelligence), eliminando custos de servidor e riscos de vazamento de dados.

## 2. Qualidade de Código & Modernidade
*   **Manifest V3 Native**: O projeto não foi "portado". Ele foi desenhado para o modelo de eventos do Service Worker, sem dependência de `background pages` persistentes.
*   **Vanilla / No-Build Step**: O código em produção é ES Modules padrão. Isso garante performance máxima (sem overhead de runtime) e auditabilidade total (o código fonte é o código executado).
*   **Test-Driven Culture**: Suite de testes robusta (`jest` + `webextension-mock`) cobrindo lógica e integração.

## 3. Privacidade & Segurança
*   **Least Privilege**: Permissões estritamente necessárias.
*   **Soberania de Dados**: O usuário é dono do próprio dado. `chrome.storage.sync` é o único meio de persistência.

## 4. Diferenciais Competitivos
*   **Modularidade Atômica**: Cada feature pode ser removida ou atualizada independentemente.
*   **Navegação Inteligente**: Algoritmos de detecção de abas evitam "tab pollution", respeitando a memória (RAM) do usuário.

---

> *"Este projeto exemplifica como construir para a Web Platform moderna: usando a plataforma, não lutando contra ela."*
