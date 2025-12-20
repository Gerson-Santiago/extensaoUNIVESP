# Relatório de Conformidade Técnica e Privacidade

**Data:** 20/12/2025
**Escopo:** Extensão Chrome "AutoPreencher UNIVESP" (v2.7.0)

## 1. Resumo Executivo
A análise técnica do código fonte indica que a extensão opera sob o princípio de **Local-First**, não possuindo infraestrutura de backend própria. Todos os dados processados permanecem no ambiente do navegador do usuário ou nos servidores da instituição (quando acessados legitimamente via sessão ativa do aluno).

## 2. Coleta e Tratamento de Dados (LGPD)

### 2.1 Dados Pessoais Processados
| Dado | Finalidade | Armazenamento | Compartilhamento |
| :--- | :--- | :--- | :--- |
| **Email do Aluno** | Auto-preenchimento no login do SEI | `chrome.storage.sync` | Conta Google do Usuário (Sincronização Chrome) |
| **Lista de Matérias/Notas** | Organização e navegação no Painel Lateral | `chrome.storage.sync` | Conta Google do Usuário (Sincronização Chrome) |
| **Cookies de Sessão** | Autenticação no AVA/SEI | Memória/Browser | Servidores da UNIVESP (Nativo) |

### 2.2 Base Legal (LGPD)
- **Legítimo Interesse (Art. 7, IX):** A extensão visa apenas facilitar o acesso a serviços já contratados pelo aluno junto à instituição, sem desvio de finalidade.
- **Consentimento:** A instalação da extensão é voluntária.

## 3. Conformidade com Normas da UNIVESP
- **Automatização:** A extensão automatiza a navegação (scraping de links de aulas) mas **não realiza ações acadêmicas críticas** (como fazer provas ou postar em fóruns) de forma autônoma.
- **Segurança:** Utiliza as credenciais já logadas no navegador. Não há captura ("log") de senhas. O campo de senha é explicitamente ignorado no preenchimento do SEI.

## 4. Análise de Segurança Técnica
- **Permissões de Host:** Estritas a `*://sei.univesp.br/*` e `*://ava.univesp.br/*`.
- **Exfiltração de Dados:** Nenhuma chamada de rede (`fetch`/`XHR`) para domínios de terceiros (trackers, analytics, servidores próprios) foi detectada no código fonte analisado.
- **Isolated World:** Scripts de conteúdo rodam em ambiente isolado.
- **Armazenamento Seguro (Antivazamento de XSS):** 
    - A extensão usa EXCLUSIVAMENTE `chrome.storage.sync/local` e nunca `localStorage`.
    - **Por que:** O `localStorage` é compartilhado com os scripts da página web. Se o site da UNIVESP sofresse um ataque XSS, o atacante poderia ler dados salvos no `localStorage`.
    - O `chrome.storage` é isolado e acessível apenas pela extensão, protegendo os dados do aluno mesmo em cenários de comprometimento do site hospedeiro.
- **Zero Backend Trust:** A extensão não confia, não possui e não se comunica com backends proprietários. Toda inteligência está no cliente (Client-Side).
    - Riscos Mitigados: Vazamento de banco de dados (não existe), Interceptação de dados em trânsito (não há trânsito externo).

## 5. Recomendações
1. **Manter Política Zero-Backend:** Não adicionar servidores intermediários.
2. **Minimização de Dados:** Continuar salvando apenas o estritamente necessário (IDs de cursos e nomes).
3. **Transparência:** Manter este documento atualizado em cada release.

---
*Este documento é um parecer técnico baseado no código fonte e não constitui aconselhamento jurídico formal.*
