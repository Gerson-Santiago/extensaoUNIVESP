# 🔐 Privacidade, Dados e Conformidade LGPD

> **Última Atualização:** 01/01/2026
> **Versão:** 2.9.6

Este documento detalha como a extensão **AutoPreencher UNIVESP** coleta, processa e protege os dados dos usuários, servindo como referência para conformidade com a LGPD (Lei Geral de Proteção de Dados) e normas da UNIVESP.

---

## 1. Princípios Fundamentais

### 1.1 Local-First & Zero-Backend
A extensão opera sob o princípio de **Soberania de Dados**.
*   **Sem Servidores Próprios:** Não existe um "servidor da extensão".
*   **Armazenamento Local:** Todos os dados ficam salvos no navegador do usuário (`chrome.storage`).
*   **Sincronização:** Ocorre exclusivamente via Google Sync (se ativado pelo usuário no Chrome), criptografado pela infraestrutura do Google.

### 1.2 Legítimo Interesse (LGPD Art. 7, IX)
A extensão visa apenas facilitar o acesso a serviços educacionais já contratados pelo aluno, sem desvio de finalidade ou monetização de dados.

---

## 2. Tratamento de Dados

### 2.1 Mapeamento de Dados Processados

| Dado | Finalidade | Armazenamento | Compartilhamento |
| :--- | :--- | :--- | :--- |
| **Email do Aluno** | Auto-preenchimento no login do SEI | `chrome.storage.sync` | Google (Sync) |
| **Estrutura de Cursos** | Organização no Painel Lateral (IDs, Nomes) | `chrome.storage.sync` | Google (Sync) |
| **Cache de Atividades** (v2.9.2) | Performance (evita re-scraping) | `chrome.storage.local` (5MB quota) | **Nenhum** (local-only) |
| **Progresso de Tarefas** (v2.9.2) | Checklist de conclusão | `chrome.storage.sync` | Google (Sync) |
| **Links de Aulas** | Navegação rápida (Deep Linking) | `chrome.storage.sync` | Google (Sync) |
| **Cookies de Sessão** | Autenticação no AVA/SEI | Memória/Browser | Servidores UNIVESP (Nativo) |

### 2.2 O que NÃO coletamos
*   ❌ **Senhas:** O campo de senha é ignorado tecnicamente.
*   ❌ **Dados Bancários/Financeiros.**
*   ❌ **Histórico de Navegação fora da UNIVESP.**

---

## 3. Detalhes Técnicos de Interação

### 3.1 Portal SEI (`https://sei.univesp.br/*`)
*   **Automação:** Um script (`content.js`) roda apenas na tela de login.
*   **Ação:** Se o campo de email estiver vazio, preenche com o email salvo nas configurações.
*   **Segurança:** Roda em `Isolated World`, impedindo conflito com scripts da página.

### 3.2 AVA / Blackboard (`https://ava.univesp.br/*`)
*   **Importação Inteligente:**
    *   Lê a lista de matérias no DOM da página inicial.
    *   Identifica Bimestre/Ano baseando-se nos códigos das disciplinas (IDs).
    *   *Deep Feature:* Acessa silenciosamente a página de cada matéria para extrair links das semanas (Scraping local).
*   **Armazenamento Seguro:**
    *   `chrome.storage.local`: Cache de atividades (5MB quota, não sincroniza entre dispositivos)
    *   `chrome.storage.sync`: Configurações e progresso (sincroniza via Google, se habilitado)
    *   **Isolamento:** APIs Chrome Extension são isoladas de scripts maliciosos (mitigação de XSS)

### 3.3 Links Rápidos
O popup da extensão fornece atalhos estáticos para:
*   Portal SEI
*   AVA (Blackboard)
*   Área do Aluno
*   Sistema de Provas

---

## 4. Análise de Segurança

*   **Permissões de Host:** Estritas aos domínios `*.univesp.br`.
*   **Exfiltração de Dados:** Nenhuma chamada (`fetch`/`XHR`) para domínios de terceiros.
*   **Anti-Tracking:** Não contém scripts de Analytics ou Rastreadores.

---

## 5. Recomendações de Uso Seguro

1.  **Mantenha o Chrome Atualizado:** Para garantir a segurança do `chrome.storage`.
2.  **Não compartilhe sua conta Google:** Seus dados da extensão são sincronizados com sua conta.

---

*Este documento é um parecer técnico baseado no código fonte aberto e não constitui aconselhamento jurídico formal.*
