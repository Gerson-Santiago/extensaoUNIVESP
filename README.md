# AutoPreencher UNIVESP

**Ferramentas de produtividade para alunos UNIVESP: Autopreenchimento SEI, Gestão de Cursos e Navegação Inteligente no AVA.**

Extensão para facilitar a vida do aluno UNIVESP, automatizando o preenchimento de emails institucionais no SEI e melhorando a navegação no Blackboard (AVA).

## Funcionalidades

- **Autopreenchimento no SEI**: Detecta campos de login e preenche seu email institucional automaticamente.
- **Painel Lateral (Side Panel)**:
    - **Importação em Lote**: Importe todas as suas matérias do bimestre com um clique.
    - **Links Diretos**: Cria atalhos diretos para a "Página Inicial" e Semanas do curso.
    - **Navegação Inteligente**: Ao clicar em uma matéria, a extensão foca na aba já aberta em vez de criar duplicatas.
- **Scraper Inteligente**:
    - *Deep Scraping*: Visita a página do curso em segundo plano para garantir links precisos.
    - *Detecção de Semanas*: Lista automaticamente as semanas de aula.
- **Configurações**: Personalize seu RA e domínio de email.

## Instalação (Desenvolvimento)

1.  Clone este repositório.
2.  Acesse `chrome://extensions/` no seu navegador.
3.  Ative o "Modo do desenvolvedor" (Developer mode).
4.  Clique em "Carregar sem compactação" (Load unpacked).
5.  Selecione a pasta raiz deste projeto.

## Desenvolvimento e Testes

O projeto utiliza **Node.js** e **Jest** para garantir a qualidade do código.

### Pré-requisitos
- Node.js instalado.

### Configuração
```bash
npm install
```

### Rodando Testes
Para verificar a integridade, importação e lógica dos scripts (incluindo Scrapers e Abas):
```bash
npm test
```

## Arquitetura Técnica

- **Manifest V3**: Base segura e moderna para extensões Chrome.
- **Estrutura Modular**:
    - `sidepanel/`: Lógica principal.
        - `batchScraper.js`: Realiza a varredura em massa e "Deep Scraping" para obter metadados do curso.
        - `tabs.js`: Gerenciador de abas inteligente (evita duplicidade).
    - `scripts/`: Scripts injetados (Content Scripts).
- **Testes**: Cobertura unitária para lógica de negócios crítica (`tests/`).

