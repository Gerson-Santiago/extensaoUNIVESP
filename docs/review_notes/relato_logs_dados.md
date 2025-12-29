# Etapa 1
WeekActivitiesService.js:38 [DEBUG-RACE] ========================================
getActivities @ WeekActivitiesService.js:38
WeekActivitiesService.js:39 [DEBUG-RACE] Iniciando scraping: Semana 1
getActivities @ WeekActivitiesService.js:39
WeekActivitiesService.js:40 [DEBUG-RACE] URL alvo: https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15307_1&content_id=_1763491_1&mode=reset
getActivities @ WeekActivitiesService.js:40
WeekActivitiesService.js:41 [DEBUG-RACE] Método: DOM
getActivities @ WeekActivitiesService.js:41
WeekActivitiesService.js:50 [DEBUG-RACE] Tabs.openOrSwitchTo retornou: id=229258546, status=complete
getActivities @ WeekActivitiesService.js:50
WeekContentScraper.js:32 [DEBUG-RACE] Total de abas AVA encontradas: 1
scrapeWeekContent @ WeekContentScraper.js:32
WeekContentScraper.js:33 [DEBUG-RACE] Aba 0: id=229258546, url=https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15307_1&content_id=_1763491_1&mode=reset
(anonymous) @ WeekContentScraper.js:33
WeekContentScraper.js:42 [DEBUG-RACE] Tentou match EXATO (course + content): ENCONTROU id=229258546
scrapeWeekContent @ WeekContentScraper.js:42
WeekContentScraper.js:86 [DEBUG-RACE] ✅ ABA ESCOLHIDA FINAL: id=229258546, url=https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15307_1&content_id=_1763491_1&mode=reset
scrapeWeekContent @ WeekContentScraper.js:86
WeekContentScraper.js:87 [DEBUG-RACE] URL esperada (week.url): https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15307_1&content_id=_1763491_1&mode=reset
scrapeWeekContent @ WeekContentScraper.js:87
WeekActivitiesService.js:86 [DEBUG-RACE] Scraping retornou: 16 itens
getActivities @ WeekActivitiesService.js:86
WeekActivitiesService.js:38 [DEBUG-RACE] ========================================
getActivities @ WeekActivitiesService.js:38
WeekActivitiesService.js:39 [DEBUG-RACE] Iniciando scraping: Semana 1
getActivities @ WeekActivitiesService.js:39
WeekActivitiesService.js:40 [DEBUG-RACE] URL alvo: https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15307_1&content_id=_1763491_1&mode=reset
getActivities @ WeekActivitiesService.js:40
WeekActivitiesService.js:41 [DEBUG-RACE] Método: DOM
getActivities @ WeekActivitiesService.js:41
WeekActivitiesService.js:50 [DEBUG-RACE] Tabs.openOrSwitchTo retornou: id=229258546, status=complete
getActivities @ WeekActivitiesService.js:50
WeekContentScraper.js:32 [DEBUG-RACE] Total de abas AVA encontradas: 1
scrapeWeekContent @ WeekContentScraper.js:32
WeekContentScraper.js:33 [DEBUG-RACE] Aba 0: id=229258546, url=https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15307_1&content_id=_1763491_1&mode=reset
(anonymous) @ WeekContentScraper.js:33
WeekContentScraper.js:42 [DEBUG-RACE] Tentou match EXATO (course + content): ENCONTROU id=229258546
scrapeWeekContent @ WeekContentScraper.js:42
WeekContentScraper.js:86 [DEBUG-RACE] ✅ ABA ESCOLHIDA FINAL: id=229258546, url=https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15307_1&content_id=_1763491_1&mode=reset
scrapeWeekContent @ WeekContentScraper.js:86
WeekContentScraper.js:87 [DEBUG-RACE] URL esperada (week.url): https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15307_1&content_id=_1763491_1&mode=reset
scrapeWeekContent @ WeekContentScraper.js:87
WeekActivitiesService.js:86 [DEBUG-RACE] Scraping retornou: 16 itens
getActivities @ WeekActivitiesService.js:86
WeekContentScraper.js:32 [DEBUG-RACE] Total de abas AVA encontradas: 1
scrapeWeekContent @ WeekContentScraper.js:32
WeekContentScraper.js:33 [DEBUG-RACE] Aba 0: id=229258546, url=https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15307_1&content_id=_1763491_1&mode=reset
(anonymous) @ WeekContentScraper.js:33
WeekContentScraper.js:42 [DEBUG-RACE] Tentou match EXATO (course + content): ENCONTROU id=229258546
scrapeWeekContent @ WeekContentScraper.js:42
WeekContentScraper.js:86 [DEBUG-RACE] ✅ ABA ESCOLHIDA FINAL: id=229258546, url=https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15307_1&content_id=_1763491_1&mode=reset
scrapeWeekContent @ WeekContentScraper.js:86
WeekContentScraper.js:87 [DEBUG-RACE] URL esperada (week.url): https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15307_1&content_id=_1763491_1&mode=reset
scrapeWeekContent @ WeekContentScraper.js:87


## Relato 1 etapa 1
desta vez e das outras vezes tbm na semana 1 de ingles apareceu outras atividades que não de ingles, o modal do site do AVA está correto mas o script não capturou os dados de lá


## Relato 2 Etapa 1

outra coisa vou tentar outro semana de outra materia 
fiz assim fechei todas as abas
abrir primeiro a semana deixei carregar a pagina dei scroll até o final da página voltei para o top da pagina abrir o modal do ava e deixei aberto 

### Dados do botão no site AVA
<a id="quick_links_lightbox_link" href="#" onclick="quickLinks.lightboxHelper.toggleLightbox(); return false;" role="button" aria-haspopup="true" tabindex="1" title="Abrir links rápidos">Links rápidos</a>

## Continuçaõ do relato 2 Etapa 1
com os Links rápidos abertos no site do ava depois so scroll da página até o fim o voltando ao top e com o modal aberto eu fui na extensão, abri  a Cursos > ver semanas > rápido funcionou.

eu fechei a extensão abri novamente e sumiu as atividades que já estavam lá com todo esse jeito para fazer funcionar 

### Informações da semana 1 do relato 2 da etapa 1
Matemática Básica - MMB002 - Turma 006
Semana 1

https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15323_1&content_id=_1767444_1&mode=reset

====================================
# Etapa 2 Gravação





cliquei em matemática e estava aparentemente salvo e funcionando mas quando voltar após passar por ingles sumiu

Eu sai de matematema e entrei em inglês
semana 1 e como já acanteceu outras vezes não funcionou, tenho a impressão que o botão rápido funciona muito melhor que o completo pois o completo vive vazio pelo menos na extensão nunca vi funcionar podemos tentar isolar uma view para rápido uma view para completo para consiguir isolar os testes sei lá ter realmente caminhos diverentes e não compartilhado para ver qual é mais estavel e se a materia ser diferente influencia se a semana da materia influencia se ter varias abas de varias semanas da mesma materia influencia ou se varias aba de diverass materias influencia se ficar só um pagina funciona melhor como isso se relaciona com o site. 

## json salvo 
@/home/sant/extensaoUNIVESP/docs/review_notes/Inglês semana 1 com 3 guias de outras materias na página.json


### urls abertas conjuntamente
TESTE ava

https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15349_1&content_id=_1762420_1&mode=reset | Semana 1 – Projetos e métodos para a produção do ...
https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15349_1&content_id=_1762421_1&mode=reset | Semana 2 – Projetos e métodos para a produção do ...
https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15349_1&content_id=_1762422_1&mode=reset | Semana 3 – Projetos e métodos para a produção do ...
https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15307_1&content_id=_1763491_1&mode=reset | Semana 1 – Inglês - LET100 - Turma 006