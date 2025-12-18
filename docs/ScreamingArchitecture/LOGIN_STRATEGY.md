# 🔐 Estratégia de Sessão e Limites de Login

> **Regra de Ouro**: A Extensão NÃO faz login. A Extensão SUPORTA a sessão do usuário.

## 1. O Conceito (Boundary)
Muitos sistemas possuem `Features/Auth` que lidam com senhas, tokens JWT proprietários e formulários de "Esqueci minha senha". **Nós não.**

Nossa extensão atua como um "parasita benéfico" (symbiote) das sessões ativas no navegador:
*   **AVA (Blackboard)**: Se o aluno logar no AVA, nós lemos os cookies/DOM.
*   **SEI**: Se o aluno logar no SEI, nós lemos a sessão.

## 2. O que a Feature faz?
Se não faz login, o que a pasta `features/session` (antiga `auth`) faz?
*   **Monitoramento**: Detecta "O aluno está logado agora?".
*   **Gerenciamento de RA**: Persiste o RA (Registro Acadêmico) identifcado na sessão.
*   **Fallbacks**: Exibe modais do tipo "Faça login no AVA para continuar" (ex: `LoginWaitModal`).

## 3. O Nome Correto
*   ❌ **Features/Auth**: Errado. Sugere que somos uma autoridade de identidade.
*   ✅ **Features/Session**: Correto. Gerenciamos o estado da sessão percebida.

## 4. Fluxo de Dados
0.  Aluno abre Extensão.
1.  `SessionManager` verifica cookies/DOM da aba ativa.
2.  SE (Logado) -> Libera funcionalidades (Extrai RA).
3.  SE (Deslogado) -> Pede para usuário navegar até a página de login oficial.
