# Side Panel (Main Entry Point)

**Responsabilidade**: Orquestrador principal da aplicação.

> [!IMPORTANT]
> O Side Panel é o ponto de entrada oficial (Manifest V3). Ele inicializa o Layout, Roteamento e conecta os serviços globais.

## Arquitetura: Orquestração
O `sidepanel.js` atua como o "Main" da aplicação. Suas funções são:
1. **Injeção de Dependência**: Instancia Serviços (`CourseService`) e Views (`CoursesView`).
2. **Roteamento**: Configura o `MainLayout` e define as rotas (`views` map).
3. **Gestão de Estado Global**: Ouve eventos globais (`window` events) e conecta Modais aos fluxos.

## Estrutura
- `sidepanel.html`: Shell da aplicação (carrega CSS global e container `#app`).
- `sidepanel.js`: Script de inicialização (Module).

## Regras
- ❌ **Não conter Regras de Negócio**: Deve apenas delegar para `features/*/logic` ou `services`.
- ✅ **Conectar Componentes**: Pode passar callbacks de um componente para outro.
