# 🔐 Features/Session - Autenticação & Identidade

**Status**: Produção (v2.8.7)  
**Responsabilidade**: Gerenciar a validação de identidade do aluno e o estado de acesso ao AVA.

---

## 🎯 O que é?

O módulo `session` é a **camada de identidade** da extensão.
Ele parte do princípio de que a autenticação (login) acontece exclusivamente no site oficial da UNIVESP/Blackboard. 
- **✅ É seguro**: A senha nunca é guardada na extensão, apenas no navegador.
- **✅ É transparente**: Não pede senha adicional, aproveita o login já feito.
- **✅ Auxilia no Login**: Redireciona para o campo correto no AVA, evitando confusão com os múltiplos campos de login da página da UNIVESP.
- **✅ Sincronizado**: Se o aluno está logado no AVA, automaticamente está logado na extensão.

### 🚫 O que este módulo NÃO é:
- ❌ **Não é** um sistema próprio de login (não pede senha).
- ❌ **Não é** um banco de dados de usuários.
- ❌ **Não é** um automatizador de login (não preenche senhas por você).

---

## ⚙️ O que ele faz?

### 1. Validação de Credenciais (RA)
A extensão precisa saber **quem você é** para formatar e-mails e identificar o contexto.
- **Formatação Inteligente**: Recebe apenas o RA (ex: `1234567`) e transforma no e-mail institucional completo (`1234567@aluno.univesp.br`).
- **Validação de Domínio**: Garante que o domínio correto (`aluno.univesp.br` ou `univesp.br`) esteja sendo usado.

### 2. "Gatekeeper" de Acesso
Como a extensão depende de dados do AVA, este módulo atua como um porteiro:

- **Verifica o acesso (Cookies)**: A extensão checa se existem *Cookies de Sessão* válidos do domínio `ava.univesp.br` no seu navegador.
- **Orienta o Usuário**: Se os cookies não existirem (sessão expirada), a extensão exibe o **`LoginWaitModal`** (uma janela da própria extensão) pedindo para que você faça login no site da faculdade.
- **Espera Passiva**: Fica aguardando até identificar que o login foi realizado com sucesso pelo usuário.

### 3. Diferença Crítica: Scraping vs CRUD

É vital entender quando a sessão é necessária:

| Operação | Precisa Estar Logado? | Por quê? |
| :--- | :--- | :--- |
| **Scraping (Buscar Dados)** | **SIM** 🔐 | A extensão precisa ler o site da Univesp, e o site só mostra o conteúdo se você estiver logado. |
| **CRUD (Usar a Extensão)** | **NÃO** 🔓 | Uma vez baixados, os dados vivem no seu computador (`LOCAl`). Você pode marcar tarefas, ver progressos e naveger **Offline**. |

---

## 🏗️ Por que foi feito assim?

### Decisão Arquitetural: "Shared Session" (Sessão Compartilhada)

Em vez de pedir sua senha (o que seria um risco de segurança e privacidade), a extensão reutiliza os **Cookies de Sessão** do navegador.

**Vantagens:**
1.  **Segurança Extrema**: A extensão NUNCA vê sua senha. 
2.  **UX Fluida**: Você não precisa logar duas vezes. Fez login na faculdade? A extensão já está pronta.
3.  **Privacidade**: Seus dados de login nunca saem do domínio `univesp.br`.

### 🛡️ Segurança e Privacidade: É seguro? (Cookies)

Uma dúvida comum: *"Usar cookies é perigoso ou ilegal?"*

**A resposta é: NÃO.**
No contexto desta extensão, é **padrão e seguro**.

1.  **O que é um Cookie?**: É como uma "pulseira de balada". Quando você faz login no AVA, o site te dá essa pulseira (Cookie) para você não precisar mostrar o RG (Senha) em toda sala que entrar.
2.  **Uso Local**: A extensão roda **no seu computador**. Ela apenas "olha" para o seu navegador e vê: *"Ah, ele está com a pulseira do AVA, então pode entrar"*.
3.  **Não é Roubo**: Roubo de sessão (Session Hijacking) é quando um *hacker* pega sua pulseira e usa no computador *dele*. A extensão não envia sua pulseira para ninguém; ela usa no **seu próprio computador** para facilitar sua vida.

---

### Estrutura Interna

| Componente | Função |
| :--- | :--- |
| **`models/Session.js`** | Define o que é uma validação válida (Interface). |
| **`logic/SessionManager.js`** | Regras de negócio puras (validação regex, formatação). Não toca no DOM. |
| **`components/LoginWaitModal.js`** | UI que guia o usuário quando a sessão cai ("Por favor, faça login..."). |

---

## 🧩 Como usar (Code Snippet)

Para validar um RA em qualquer lugar do sistema:

```javascript
import { RaManager } from '../../features/session/logic/SessionManager.js';

// Transforma RA em credencial válida
const result = RaManager.prepareCredentials('2100567', 'aluno.univesp.br');

if (result.isValid) {
  console.log(result.fullEmail); // 2100567@aluno.univesp.br
} else {
  alert(result.error);
}
```
