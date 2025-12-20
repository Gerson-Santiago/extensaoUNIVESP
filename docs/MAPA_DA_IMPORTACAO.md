# Mapa de Nomes: Funcionalidade de Importação

Este documento serve para traduzir os nomes técnicos (existentes no código) para o que aparece na tela do usuário. O objetivo é desmistificar termos como `Batch`, `Scraper`, etc.

## 🗺️ De Código para Interface

| Nome no Código (`Code Name`) | Tipo | O que faz no sistema? | O que o Usuário Vê? |
| :--- | :--- | :--- | :--- |
| **`BatchImportFlow`** | *Controller* | O "Gerente". Decide se abre a tela de Login ou direto a de Importação. | (Invisível) É o clique no botão "Importar Múltiplos". |
| **`LoginWaitModal`** | *Component* | Janela de espera caso o usuário não esteja logado. Monitora a URL até detectar o login. | Janela: "Aguardando Login no AVA...". |
| **`BatchImportModal`** | *Component* | A janela principal de seleção. Mostra os checkboxes e bimestres. | Janela: "**Importação em Lote**". |
| **`BatchScraper`** | *Service* | O "Robô". É injetado na página do AVA para ler o HTML. | (Invisível) Mensagem: "Identificando bimestres...". |
| **`scrapeAvailableTerms`** | *Function* | Faz a leitura da página atual para achar os títulos dos cursos. | Ação automática ao abrir a janela. |
| **`processSelectedCourses`** | *Function* | Entra em cada link selecionado para pegar as semanas. | Mensagem: "Coletando informações...". |
| **`foundTerms`** | *Variable* | A lista de bimestres encontrados (ex: 2025/1, 2024/2). | As categorias/cabeçalhos na lista ("2025/2 - 4º Bimestre"). |
| **`.btn-refresh`** | *CSS Class* | Botão que reacione o scraper + scroll. | O ícone **↻** (Recarregar). |
| **`handleAutoScroll`** | *Logic* | (No Scraper) Força a página a descer para carregar itens escondidos (Infinite Scroll). | A barra de rolagem da página do AVA se movendo sozinha. |

## ❓ Por que "Batch" (Lote)?
Usamos o prefixo `Batch` (Lote) porque essa funcionalidade se diferencia da importação manual (um por um). Ela processa **vários cursos de uma vez**.

- `BatchImport` = Importação em Lote (Vários)
- `ManualImport` = Importação Manual (Um só)
