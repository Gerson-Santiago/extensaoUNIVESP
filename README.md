# AutoPreencher UNIVESP

Extensão para facilitar a vida do aluno UNIVESP, automatizando o preenchimento de emails institucionais no SEI e melhorando a navegação no Blackboard (AVA).

## Funcionalidades

- **Autopreenchimento no SEI**: Detecta campos de login e preenche seu email institucional automaticamente.
- **Painel Lateral (Side Panel)**:
    - Lista suas matérias.
    - **Scraper Inteligente**: Detecta automaticamente as semanas de aula no Blackboard.
    - Navegação rápida para cada semana.
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
Instale as dependências:
```bash
npm install
```

### Rodando Testes
Para verificar a integridade dos arquivos e lógica:
```bash
npm test
```

## Estrutura do Projeto

- `manifest.json`: Configuração principal da extensão (Manifest V3).
- `popup/`: Interface e lógica do popup principal.
- `sidepanel/`: Lógica e UI do painel lateral.
    - `logic/`: Lógica de negócios (scraper, storage, tabs).
    - `ui/`: Componentes visuais.
- `scripts/`: Content scripts injetados nas páginas.
- `tests/`: Testes automatizados.
