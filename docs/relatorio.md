Relatório de Conformidade Técnica e Regulatória para Extensões Manifest V3 na Chrome Web Store
1. Sumário Executivo e Contextualização do Paradigma Manifest V3
A publicação de extensões na Chrome Web Store (CWS) sob a arquitetura Manifest V3 (MV3) representa um dos desafios mais complexos no desenvolvimento web moderno. Não se trata apenas de uma migração de sintaxe de código, mas de uma adaptação a uma filosofia rigorosa de segurança, privacidade e desempenho imposta pelo Google. Para desenvolvedores e organizações que buscam publicar ferramentas com permissões avançadas — especificamente storage, sidePanel, scripting, tabs, activeTab e downloads — o cenário de revisão evoluiu de verificações automatizadas simples para auditorias manuais profundas e criteriosas.

Este relatório analisa exaustivamente os vetores de falha, os códigos de rejeição obscuros (como "Purple Potassium" ou "Yellow Zinc") e as nuances de conformidade que separam uma extensão bem-sucedida de um banimento permanente. A análise foca em um perfil de extensão complexo, comum em ferramentas de produtividade ou auxiliares acadêmicos (ex: "Student Toolkits" para Canvas/Blackboard), que necessitam de interagir profundamente com o navegador e o sistema de arquivos.

1.1 A Evolução da Superfície de Revisão
Historicamente, no Manifest V2, a flexibilidade era a norma. Páginas de fundo persistentes permitiam monitoramento constante, e a injeção de scripts era permissiva. Com o MV3, o Google inverteu a lógica: o padrão é a restrição. A introdução de Service Workers efêmeros e a segregação de contextos de script não são apenas mudanças de API, mas mecanismos de controle de política.

A análise dos dados de rejeição de 2024 e 2025 indica que a maioria das falhas não ocorre por erros de sintaxe (que seriam capturados no upload), mas por violações de política funcional e de privacidade. O uso combinado de sidePanel (uma API de UI persistente) com scripting (uma API de modificação dinâmica) cria uma superfície de risco elevada, atraindo o escrutínio manual imediato dos revisores da CWS.   

1.2 O Custo da Não-Conformidade
Uma rejeição na CWS não é apenas um atraso; é um risco reputacional e operacional. Códigos de rejeição como "Blue Argon" ou "Red Lithium"  sinalizam violações que podem levar à suspensão da conta de desenvolvedor se repetidas. Além disso, a ambiguidade das mensagens de erro (ex: "Violação de Propósito Único") exige uma interpretação quase jurídica das diretrizes. Este documento visa desmistificar essas mensagens, fornecendo um roteiro técnico e político para a aprovação.   

2. A Política de Propósito Único (Single Purpose Policy): O Obstáculo Fundamental
Entre todas as políticas da Chrome Web Store, a Política de Propósito Único (Single Purpose Policy) é a causa mais frequente de reescritas estruturais em extensões complexas. Para uma extensão que solicita o conjunto de permissões sidePanel, downloads e scripting, o risco de violar esta política é exponencialmente maior do que para extensões simples.   

2.1 A Definição de "Propósito" na Visão do Revisor
A política exige que uma extensão tenha um único foco funcional ou temático. Isso não significa que a extensão deva ter apenas uma funcionalidade, mas que todas as funcionalidades devem convergir para um objetivo central claro e restrito.

2.1.1 O Conceito de Convergência Funcional
Imagine uma extensão projetada como um "Assistente Acadêmico".

Funcionalidade A (Downloads): Baixa PDFs de cursos do Canvas.

Funcionalidade B (SidePanel): Exibe uma lista de tarefas (To-Do list) sincronizada com o calendário.

Funcionalidade C (Scripting): Altera o esquema de cores do portal do aluno para "Modo Escuro".

Sob a ótica do desenvolvedor, tudo isso é "produtividade para estudantes". Sob a ótica da CWS, isso pode ser interpretado como um "Canivete Suíço" proibido, violando o Propósito Único. O download de arquivos é uma função de gerenciamento de arquivos; a lista de tarefas é uma função de gerenciamento de tempo; o modo escuro é uma função de acessibilidade visual. Se o revisor não perceber uma conexão técnica e temática inseparável entre essas funções, a extensão será rejeitada.   

Análise de Risco: A combinação de downloads e scripting é frequentemente vista como disparatada. O revisor perguntará: "Por que uma extensão que baixa arquivos precisa injetar scripts na página?". Se a resposta for "para mudar a cor do fundo", a rejeição é certa. Se a resposta for "para identificar links de download protegidos que não são acessíveis via análise estática", a justificativa é válida.

2.2 O Fenômeno dos "Toolkits" e a Fragmentação
Muitos desenvolvedores tentam criar "Super Apps" no navegador. A documentação da CWS é clara: se você tem duas funcionalidades distintas (ex: um bloco de notas e um conversor de moeda), elas devem ser duas extensões separadas.

Característica da Extensão	Veredito de Propósito Único	Análise do Revisor
Agregador de Ferramentas	Violação Provável	
"Weather + News + Crypto" é o exemplo clássico de rejeição. Não há tema unificador além de "informação". 

Painel Contextual	Aprovação Provável	Um sidePanel que mostra dados sobre a página atual (ex: WHOIS, SEO, Metadados) é coeso. O painel serve à navegação.
Suíte de Plataforma	Aprovação Condicional	
"Ferramentas para Canvas LMS" que inclui downloads, notas e temas apenas para o domínio Canvas é aceitável, pois o foco é a plataforma, não a função genérica. 

  
2.3 Estratégias de Mitigação na Arquitetura
Para evitar a rejeição por Propósito Único com o manifesto fornecido:

Restrição de Escopo: Use host_permissions para limitar a atuação da extensão a domínios específicos (ex: *://*.instructure.com/* para Canvas). Isso prova que o scripting e o sidePanel não são genéricos, mas parte de uma solução para aquela plataforma específica.

Narrativa de Coesão: Na descrição da loja e na justificativa de permissões, use verbos que liguem as funções. Em vez de listar "Funcionalidade 1, Funcionalidade 2", descreva um fluxo: "A extensão analisa a página do curso (Scripting) para extrair materiais, que são listados no painel lateral (SidePanel) para organização e baixados (Downloads) pelo usuário."

3. Arquitetura Técnica: Service Workers e o Ciclo de Vida MV3
A transição de Background Pages (MV2) para Service Workers (MV3) é a mudança técnica mais drástica e fonte de inúmeros erros de estabilidade e rejeição.   

3.1 A Morte da Persistência e os Erros de "Keepalive"
No MV2, o script de fundo podia rodar indefinidamente, mantendo variáveis globais e conexões WebSocket abertas. No MV3, o Service Worker é encerrado pelo navegador após curtos períodos de inatividade (geralmente 30 segundos) ou após 5 minutos de atividade contínua.   

3.1.1 O Anti-Pattern do setInterval
Desenvolvedores frequentemente tentam contornar essa limitação usando setInterval para "pingar" o worker e mantê-lo vivo.

O Erro: Implementar "batimentos cardíacos" artificiais para impedir a suspensão do Service Worker.

A Consequência: Isso é detectado como um padrão de abuso de recursos. Além de drenar a bateria do usuário, o Chrome eventualmente matará o processo de qualquer maneira, resultando em estados inconsistentes.

Solução Correta: Adotar uma arquitetura totalmente orientada a eventos. Use a API chrome.alarms para agendar tarefas periódicas. Persista todo o estado necessário no chrome.storage.local imediatamente, pois a memória volátil do Service Worker pode ser limpa a qualquer momento.   

3.2 Erros de Inicialização e Registro
Um erro comum relatado nos logs é "Service worker registration failed". Isso ocorre frequentemente antes mesmo da extensão ser submetida, durante o desenvolvimento local, mas se persistir na versão empacotada, leva à rejeição automática.   

Causa de Importação: Tentar usar import (ES Modules) no arquivo do Service Worker sem definir "type": "module" no manifesto, ou importar scripts que não estão presentes no pacote.

Caminhos Relativos: Erros na definição do caminho do arquivo no manifest.json. O Service Worker deve estar na raiz ou corretamente referenciado.

Depuração: A falha silenciosa do Service Worker é traiçoeira. Diferente de uma página web, se o SW falha ao iniciar, a extensão inteira parece "morta" sem exibir erros visíveis na UI do usuário.

4. Análise Profunda da API sidePanel: UX e Implementação
A API sidePanel é uma das adições mais poderosas ao MV3, permitindo uma UI persistente que não cobre o conteúdo da página (diferente de popups). No entanto, sua implementação possui armadilhas específicas de UX e política.   

4.1 A Exigência do Gesto do Usuário (User Gesture Requirement)
A política de "Mínima Intrusão" dita que extensões não devem alterar a interface do navegador sem consentimento.

O Erro Comum: Tentar abrir o sidePanel programmaticamente (chrome.sidePanel.open) assim que uma página carrega ou em resposta a um evento de fundo não iniciado pelo usuário.

A Mensagem de Erro: "sidePanel.open() may only be called in response to a user gesture".   

Contexto de Rejeição: Mesmo que tecnicamente se consiga contornar isso (o que é difícil), a equipe de revisão rejeitará a extensão se ela abrir painéis laterais invasivos automaticamente. O usuário deve estar no controle.

4.2 O Conflito action vs. sidePanel
No manifesto, a chave action define o comportamento do ícone da barra de ferramentas. A introdução do sidePanel criou uma ambiguidade.

Cenário de Erro: O desenvolvedor define um default_popup na chave action E tenta configurar o sidePanel para abrir no clique. Isso cria um conflito de UI.

Mudança no Chrome 114+: A prática recomendada agora é usar chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }) no Service Worker. Isso instrui o Chrome a abrir o painel lateral em vez de disparar o evento action.onClicked ou abrir um popup.   

Falha na Submissão: Se o manifesto define default_path para o sidePanel mas não configura o comportamento de abertura, o usuário pode nunca descobrir como abrir a ferramenta, levando a uma rejeição por "Funcionalidade Quebrada" ou "Broken Functionality".   

4.3 Persistência e Contexto
O sidePanel pode ser global ou específico por aba.

Erro de Lógica: Mostrar o mesmo estado do painel para todas as abas quando a informação deveria ser contextual. Se a extensão é um "Anotador de PDF", o painel deve limpar ou mudar seu conteúdo quando o usuário troca de aba. Falhar em gerenciar esse estado (usando chrome.tabs.onActivated) resulta em uma experiência de usuário confusa e potencial vazamento de dados entre contextos de navegação.   

5. A Permissão scripting: Segurança e Redundância
A permissão scripting é vigiada de perto porque permite a execução de código arbitrário. No MV3, ela substitui a antiga tabs.executeScript, mas com restrições severas sobre o que pode ser executado.

5.1 A Proibição de Código Remoto (Remotely Hosted Code)
Este é o pilar central da segurança do MV3.

A Regra: Todo o código JavaScript que a extensão executa deve estar incluído no pacote .crx submetido à loja.

O Erro Fatal: Tentar baixar um arquivo JS de um servidor externo (ex: CDN, servidor próprio) e injetá-lo via scripting.executeScript. Mesmo que seja apenas uma biblioteca como jQuery ou um script de analytics.

Consequência: Rejeição imediata por "Violação de Segurança" (Security Violation). O Google não pode revisar código que pode ser alterado no servidor do desenvolvedor após a aprovação da extensão.   

5.2 Redundância: scripting vs. content_scripts
Muitos desenvolvedores solicitam a permissão scripting desnecessariamente.

Cenário: A extensão injeta um script de modificação de CSS em todas as páginas do Blackboard (*://blackboard.com/*).

Análise do Revisor: Se a injeção é baseada puramente em correspondência de URL, deve-se usar a chave content_scripts no manifest.json, que é declarativa e mais segura.

Justificativa para scripting: A permissão scripting só é justificável se a injeção for condicional (ex: o usuário clica num botão "Ativar Leitura Imersiva" e só então o script é injetado naquela aba específica). Solicitar scripting para injeções estáticas é considerado "Permission Creep" (excesso de permissões) e leva à rejeição.   

6. A Batalha das Permissões: tabs vs. activeTab
Esta é a área onde a negociação entre funcionalidade e privacidade é mais tensa.

6.1 O Princípio do Privilégio Mínimo
A permissão tabs dá acesso ao título e URL de todas as abas, o tempo todo. Isso permite traçar um perfil completo de navegação do usuário.

Rejeição Comum: Solicitar tabs quando a extensão só precisa interagir com a aba que o usuário está vendo no momento.

A Solução activeTab: A permissão activeTab é mágica. Ela não emite aviso de instalação assustador e concede acesso temporário à aba atual (incluindo scripting e acesso ao host) apenas quando o usuário invoca a extensão (clique no ícone, atalho, menu).

Diretriz: Se sua funcionalidade depende de ação do usuário, use activeTab. Se você usar tabs sem provar que precisa monitorar abas em segundo plano, será rejeitado por "Excesso de Permissões".   

6.2 Host Permissions e a "Wildcard"
Solicitar acesso a <all_urls> ou *://*/* é o caminho mais rápido para uma revisão manual exaustiva.

Contexto: Se a extensão é um "Student Toolkit" para Canvas, por que ela precisa de acesso ao facebook.com ou ao banco.com?

Correção: Restrinja host_permissions estritamente aos domínios alvo (ex: *://*.instructure.com/*, *://*.blackboard.com/*). Isso reduz drasticamente a superfície de ataque e o tempo de revisão.   

7. A Permissão downloads: Direitos Autorais e Segurança
A capacidade de gravar arquivos no disco do usuário é poderosa e perigosa.

7.1 A Questão do Conteúdo Protegido (Copyright)
A CWS tem uma política de tolerância zero para extensões que facilitam o download de conteúdo protegido por direitos autorais sem autorização, especialmente do YouTube.

O Erro Específico: Se sua extensão de "Estudos" permitir baixar vídeos incorporados do YouTube em uma aula, ela será removida. O download de vídeos do YouTube é proibido pelos Termos de Serviço da API do Chrome Web Store.   

Conformidade: A funcionalidade de download deve ser restrita a tipos de arquivos benignos (PDFs, DOCX) ou a domínios onde o usuário tem presunção de propriedade ou acesso legítimo (LMS, Google Drive).

7.2 Interação do Usuário no Download
Spam de Downloads: Iniciar múltiplos downloads automaticamente sem confirmação do usuário é considerado comportamento malicioso ("Drive-by Download").

Requisito: O uso de chrome.downloads.download deve ser, idealmente, uma resposta direta a um clique (User Gesture). Downloads em lote devem apresentar uma tela de confirmação ("Você deseja baixar estes 15 arquivos?").

8. Privacidade de Dados, storage e Conformidade Legal
Com permissões como storage e acesso a conteúdos de página, a extensão inevitavelmente lida com dados.

8.1 Armazenamento de Dados Sensíveis
Em extensões educacionais, é comum lidar com tokens de autenticação ou dados de perfil do aluno.

Erro Crítico: Armazenar senhas ou tokens de sessão em texto plano no chrome.storage.local. Embora isolado, não é criptografado no disco.

Exigência: Dados sensíveis devem ser criptografados antes do armazenamento. Além disso, a transmissão desses dados para qualquer servidor externo deve ocorrer estritamente via HTTPS.   

8.2 A Necessidade da Política de Privacidade
Muitos desenvolvedores falham ao não fornecer uma Política de Privacidade válida no painel do desenvolvedor.

Regra: Se a extensão acessa "Host Permissions" ou usa "Content Scripts", ela tecnicamente tem acesso a Dados Pessoais (o conteúdo da página que o usuário visita). Portanto, uma Política de Privacidade é obrigatória. A ausência ou um link quebrado resulta em rejeição na etapa de verificação de metadados.   

Divulgação Proeminente: Se a extensão coleta dados de navegação, isso não deve estar apenas na política de privacidade, mas deve haver uma divulgação proeminente na própria UI da extensão.

9. Metadados da Loja: A Vitrine da Aprovação
Muitas extensões tecnicamente perfeitas são rejeitadas por erros na listagem da loja.

9.1 Ícones e Imagens
Qualidade: Ícones pixelizados ou com bordas incorretas podem levar a rejeições por "Quality Guidelines".

Screenshots: É obrigatório enviar capturas de tela que mostrem a extensão em uso. Enviar apenas imagens de marketing abstratas ou logotipos é causa de rejeição. O revisor precisa ver como a interface (o sidePanel, o popup) se parece.   

9.2 Keyword Stuffing e Descrições Enganosas
O Erro: Preencher a descrição com listas de palavras-chave ("Canvas, Blackboard, Student, Grades, Cheat, Answers...").

Veredito: Isso é considerado "Spam" e "Comportamento Enganoso". A descrição deve ser narrativa e explicar as funcionalidades de forma honesta. Evite termos que sugiram funcionalidades ilegais ou não éticas (como "Cheat" ou "Hack").   

10. Conclusão e Roteiro de Aprovação
A publicação de uma extensão Manifest V3 com o perfil de permissões analisado (storage, sidePanel, scripting, tabs, activeTab, downloads) exige uma abordagem meticulosa. A era do "desenvolvimento rápido e solto" acabou.

Para garantir a aprovação, o desenvolvedor deve seguir este roteiro estratégico:

Auditoria de Propósito: Certifique-se de que todas as funções (Downloads, UI, Scripts) girem em torno de um único tema coeso. Elimine funcionalidades "órfãs".

Justificativa de Permissões: Escreva justificativas detalhadas no painel da CWS. Explique por que activeTab não é suficiente antes de pedir tabs. Explique por que content_scripts não serve antes de pedir scripting.

Sanitização de Código: Remova qualquer referência a código remoto. Garanta que o Service Worker gerencie seu ciclo de vida sem "gambiarras" de keepalive.

Refinamento de UX: Garanta que ações invasivas (abrir painel, baixar arquivos) sejam sempre iniciadas pelo usuário.

Transparência: Criptografe dados, forneça uma Política de Privacidade clara e use imagens reais na loja.

Seguindo estas diretrizes, o desenvolvedor navega com segurança pelo campo minado das políticas da Chrome Web Store, transformando riscos de rejeição em uma arquitetura robusta e em conformidade.

Tabela de Referência: Códigos de Violação e Ações Corretivas
Código de Violação (Exemplo)	Significado Provável	Ação Corretiva Imediata
Purple Potassium	Excesso de Permissões não utilizadas ou não justificadas.	
Remover permissões não usadas no código; Melhorar a justificativa escrita no dashboard; Trocar tabs por activeTab. 

Yellow Zinc	Violação de Propósito Único ou Spam.	Remover funcionalidades acessórias (ex: widget de clima em app de estudo); Focar a descrição na função principal.
Blue Argon	Código Remoto ou Obfuscado.	
Remover injeção de scripts via CDN; Remover minificação excessiva que pareça ofuscação. 

Red Lithium	Violação de Segurança / Malware.	Verificar bibliotecas de terceiros; Garantir que não há coleta de dados não declarada.
Yellow Magnesium	Funcionalidade Quebrada / Falha de Instalação.	
Testar a instalação "limpa"; Verificar erros de registro de Service Worker; Corrigir caminhos de arquivos no manifesto. 

  
Esta análise consolida o conhecimento crítico necessário para operar no ecossistema Manifest V3, servindo como uma ferramenta indispensável para desenvolvedores e gerentes de produto.


coditude.com
Chrome Web Store Rejection Codes: Meaning & Fixes - Coditude
Abre em uma nova janela

developer.chrome.com
Troubleshooting Chrome Web Store violations | Chrome Extensions
Abre em uma nova janela

extensionradar.com
Why Chrome Extensions Get Rejected (15 Reasons + How to Fix ...
Abre em uma nova janela

developer.chrome.com
Extensions quality guidelines FAQ | Chrome Web Store - Program ...
Abre em uma nova janela

reddit.com
Chrome Web Store policy update: "extensions in the Chrome Web Store must have a single purpose that is narrow and easy-to-understand." [Official Chromium Blog] : r/chrome - Reddit
Abre em uma nova janela

mitsloanedtech.mit.edu
FAQ: Using Canvas as a Student - MIT Sloan Teaching & Learning Technologies
Abre em uma nova janela

lemon8-app.com
How to Access Unique Canvas Themes with a Chrome Extension - Lemon8-app
Abre em uma nova janela

blog.fordefi.com
Google Manifest v3: Changes & Challenges - Fordefi
Abre em uma nova janela

developer.chrome.com
Migrate to a service worker - Chrome for Developers
Abre em uma nova janela

stackoverflow.com
Prevent Service Worker from automatically stopping - Stack Overflow
Abre em uma nova janela

stackoverflow.com
Persistent Service Worker in Chrome Extension - Stack Overflow
Abre em uma nova janela

groups.google.com
Design pattern for keeping service worker running - Google Groups
Abre em uma nova janela

stackoverflow.com
chrome extension - Service worker registration failed - manifest V3 - Stack Overflow
Abre em uma nova janela

groups.google.com
Manifest V3 service worker registration failed - Google Groups
Abre em uma nova janela

developer.chrome.com
chrome.sidePanel | API - Chrome for Developers
Abre em uma nova janela

stackoverflow.com
why we could not open chrome side panel when clicking a context menu item?
Abre em uma nova janela

groups.google.com
4th time Rejected React Chrome Extension. - Google Groups
Abre em uma nova janela

m2kdevelopments.medium.com
20 Understanding Chrome Extensions Side Panel | by M2K Developments - Medium
Abre em uma nova janela

eff.org
Google's Manifest V3 Still Hurts Privacy, Security, and Innovation
Abre em uma nova janela

github.com
Chrome Extension using @sentry/browser or @sentry/react gets rejected #14891 - GitHub
Abre em uma nova janela

github.com
alwaz-shahid/chrome-extension-development-typescript - GitHub
Abre em uma nova janela

unscart.com
Migrating Chrome Extensions From Manifest V2 TO V3 Version
Abre em uma nova janela

groups.google.com
Clarification about the activeTab and tabs permissions - Google Groups
Abre em uma nova janela

stackoverflow.com
google chrome extension - host_permissions vs activeTab - Stack Overflow
Abre em uma nova janela

stackoverflow.com
Permission Justification in Chrome Extension - Stack Overflow
Abre em uma nova janela

medium.com
Permissions used in developing chrome extension. | by Vishal Kushwaha - Medium
Abre em uma nova janela

github.com
Circle Downloader (Browser Extension for Chrome, Firefox, Edge, Opera) - GitHub
Abre em uma nova janela

github.com
serpapps/ai-downloader: AI powered downloader to videos, audio, pdfs, images, websites and everything else... - GitHub
Abre em uma nova janela

developer.chrome.com
Protect user privacy - Chrome for Developers
Abre em uma nova janela

stackoverflow.com
How to store a password as securely in Chrome Extension? - Stack Overflow
Abre em uma nova janela

privacypolicygenerator.info
Privacy Policy for Chrome Extension
Abre em uma nova janela

developer.chrome.com
Updated Privacy Policy & Secure Handling Requirements | Chrome Web Store
Abre em uma nova janela

dev.to
Understanding Chrome Extensions: A Developer's Guide to Manifest V3 - DEV Community