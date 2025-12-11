# Plano de Implementação de Importação em Lote (Batch Course Scraper)

## Objetivo
Implementar uma funcionalidade de "Importação em Lote" acessível via um ícone de configurações no painel lateral. Esta funcionalidade permitirá que os usuários extraiam e adicionem automaticamente múltiplas matérias da página `https://ava.univesp.br/ultra/course`. O usuário poderá configurar o número de matérias a serem extraídas e o sistema focará no bimestre atual (ex: "2025/2 - 4º Bimestre").

## Revisão do Usuário
> [!IMPORTANT]
> A lógica do scraper depende de estruturas específicas do DOM (atributos Angular como `ng-bind`, classes como `js-course-title-element`) que podem mudar se a plataforma AVA for atualizada.
> A lógica assume que o usuário já está logado e na página correta, ou valida a URL antes de rodar.

## Mudanças Propostas

### Componentes de UI (`sidepanel/`)
#### [MODIFY] [sidepanel.html](file:///c:/Users/gerson_6061/Desktop/PROJETOS/extensaoUNIVESP/sidepanel/sidepanel.html)
- Adicionar um ícone de "Configurações" (engrenagem) no cabeçalho superior direito.
- Criar um Modal/Seção para "Configurações e Importação".
  - **Botão "Escanear Matérias"**: Inicia a leitura da página para descobrir os bimestres.
  - **Seleção de Bimestre (Dropdown)**: Aparece após o escaneamento. Lista os termos encontrados (ex: "2025/2 - 4º Bimestre", "2025/2 - 3º Bimestre").
    - *Default*: O primeiro termo encontrado após o filtro.
  - **Pré-visualização**: Lista os nomes das matérias que serão importadas baseadas no bimestre selecionado e no limite numérico.
  - **Entrada Numérica**: Quantidade de matérias a importar (padrão: 3).
  - **Botão "Confirmar Importação"**: Salva efetivamente as matérias.

#### [MODIFY] [sidepanel.css](file:///c:/Users/gerson_6061/Desktop/PROJETOS/extensaoUNIVESP/sidepanel/sidepanel.css)
- Estilos para o ícone de configurações.
- Estilos para o modal, dropdown de seleção e lista de pré-visualização (lista simples com scroll se necessário).

#### [MODIFY] [sidepanel.js](file:///c:/Users/gerson_6061/Desktop/PROJETOS/extensaoUNIVESP/sidepanel/sidepanel.js)
- Controlar o fluxo de 3 passos:
  1. **Scan**: Chama o scraper para retornar a estrutura de termos e matérias disponíveis.
  2. **Select/Preview**: Popula o dropdown e mostra a lista de matérias previstas.
  3. **Confirm**: Salva os itens selecionados.

### Lógica do Scraper
#### [NEW] [sidepanel/logic/batchScraper.js](file:///c:/Users/gerson_6061/Desktop/PROJETOS/extensaoUNIVESP/sidepanel/logic/batchScraper.js)
- `scanAvailableTerms(tabId)`: Função principal exportada.
- **Lógica da Função Injetada**:
  1. **Validação e Filtro**: Verifica URL e filtro "Cursos abertos".
  2. **Mapeamento de Termos**:
     - Varre todos os elementos `h3` com `ng-switch-when="REGULAR_TERM"`.
     - Para cada termo encontrado, coleta o nome (ex: "2025/2 - 4º Bimestre").
     - Coleta TODAS as matérias associadas a este termo (buscando os `h4.js-course-title-element` dentro do container do termo).
  3. **Retorno Complexo**: Retorna um objeto contendo uma lista de Termos, onde cada Termo possui uma lista de Matérias `{ name, url }`.
- O processamento de "quantas matérias pegar" é feito no lado do **Client (Sidepanel)** durante a pré-visualização, não mais hardcoded no scraper. Isso dá flexibilidade visual instantânea.

## Plano de Verificação

### Verificação Manual
1.  **Verificação de UI**: Confirmar se o ícone de engrenagem aparece e abre o painel de configurações corretamente.
2.  **Verificação de Navegação**: Garantir que o botão "Importar" alerte o usuário caso ele não esteja na página correta do AVA.
3.  **Verificação do Scraper**: Na página de cursos do AVA:
    -   Verificar se o script detecta corretamente o primeiro termo regular (Bimestre Atual).
    -   Verificar se extrai corretamente o número de matérias solicitado (ex: 3).
    -   Confirmar que ignora cursos fechados ou de outros semestres (pegando apenas os abaixo do header do termo).
4.  **Armazenamento de Dados**: Confirmar que as novas matérias aparecem na lista principal do painel após a importação e persistem após fechar/abrir a extensão.
