# Guia de Revisão de Testes com Jest (Foco em Engenharia e Qualidade)

Ao revisar testes, a mentalidade deve mudar em relação à revisão de código de produção. O objetivo não é apenas "ver se passa", mas garantir que o teste seja **confiável**, **útil a longo prazo** e **comunicativo**.

Na engenharia de software, tratamos o código de teste como **cidadão de primeira classe**. Ele deve ser tão bem cuidado quanto o código da aplicação.

Aqui estão os pontos cruciais para analisar, divididos por conceitos de engenharia e especificidades do Jest:

## 1. O Princípio F.I.R.S.T.

Antes de olhar a sintaxe, avalie se os testes seguem este acrônimo clássico da engenharia de qualidade:

* **F - Fast (Rápido):** O teste demora muito? Se sim, os desenvolvedores vão parar de rodá-lo localmente.
* *Dica:* Verifique se estão fazendo chamadas de rede reais em vez de usar Mocks.


* **I - Independent (Independente):** Um teste falha se for rodado numa ordem diferente? Eles compartilham estado global?
* *No Jest:* Cuidado com variáveis declaradas fora do `beforeEach`.


* **R - Repeatable (Repetível):** O teste passa na sua máquina mas falha no CI/CD?
* *Causas comuns:* Fuso horário (`Date`), aleatoriedade (`Math.random`) ou dependência de dados externos não mockados.


* **S - Self-validating (Auto-validável):** O teste diz claramente "Passou" ou "Falhou"? Evite testes que exigem inspeção manual de logs para saber se funcionou.
* **T - Timely (Oportuno):** O teste foi escrito junto com a feature (ou antes, no TDD) ou meses depois apenas para cumprir tabela?

## 2. O Que Validar na Revisão (Checklist Técnico)

### A. Testando Comportamento vs. Implementação

Este é o erro mais comum. O teste deve validar **o que** o código faz, não **como** ele faz.

* **Sinal de Alerta:** O teste quebra toda vez que você refatora uma função interna, mesmo que o resultado final para o usuário não tenha mudado.
* **No Jest:** Evite espionar (`jest.spyOn`) funções privadas ou internas demais. Foque na API pública do módulo.

### B. Qualidade das Asserções (Expects)

* **Asserções Fracas:** Evite `expect(resultado).toBeDefined()` ou `expect(resultado).toBeTruthy()`. Isso deixa passar muitos bugs.
* **O que buscar:** Seja específico. Prefira `expect(resultado).toEqual({ id: 1, status: 'ativo' })`.
* **Falsos Positivos:** Verifique se o teste não está passando "por sorte". Por exemplo: testar se um array tem `length > 0` quando deveria testar se ele contém exatamente o item `X`.

### C. Isolamento e Mocks

* **Limpeza:** O `jest.clearAllMocks()` ou `resetAllMocks()` está configurado? Se não, a contagem de chamadas de um teste pode vazar para o próximo.
* **Over-mocking:** Se você tem 50 linhas de configuração de mock para 2 linhas de teste, algo está errado. Talvez o código esteja muito acoplado ou você esteja mockando coisas desnecessárias (como bibliotecas utilitárias simples).

### D. Tratamento de Assincronicidade

O Jest é síncrono por padrão. Erros aqui geram os piores *flaky tests* (testes intermitentes).

* **Verifique:** O teste usa `async/await` corretamente?
* **Promessas:** Se houver uma Promise, o teste retorna a Promise ou usa `await`? Se não, o Jest pode finalizar o teste antes da asserção rodar (dando um falso "Sucesso").

## 3. Manutenibilidade, Legibilidade e Idioma

### A. Idioma e Localização (pt-BR)

A comunicação do teste é fundamental para a equipe.

* **Regra:** Todo o contexto textual deve estar em **Português (pt-BR)**. Isso inclui:
* Descrições dos blocos `describe` e `it`.
* Comentários explicativos no código.
* Logs de erro ou mensagens de debug deixadas no teste.



### B. Descrições Narrativas

O nome do teste deve ser uma frase que descreve a regra de negócio claramente em português.

* *Ruim:* `it('should work', ...)` ou `test('login', ...)`
* *Bom:* `it('deve lançar um erro caso o formato do email seja inválido', ...)`
* *Dica:* Ao ler o output do terminal, deve parecer uma documentação do sistema em pt-BR.

### C. Padrão AAA (Arrange, Act, Assert)

O corpo do teste está organizado visualmente?

1. **Arrange (Preparar):** Prepara os dados e mocks.
2. **Act (Agir):** Executa a função.
3. **Assert (Verificar):** Verifica o resultado.
Isso ajuda muito na leitura rápida.

### D. Snapshots com Cautela

Snapshots do Jest (`expect(x).toMatchSnapshot()`) são úteis, mas perigosos.

* **O Risco:** Desenvolvedores tendem a atualizar snapshots (`-u`) sem ler o que mudou quando o teste falha.
* **Na Revisão:** Se o snapshot for muito grande (ex: 200 linhas de HTML/JSON), peça para mudar para asserções específicas em campos chave. Snapshot serve para garantir que a estrutura não mudou acidentalmente, não para validar lógica complexa.

---

### Resumo para o Revisor

Ao olhar o Pull Request, faça a si mesmo estas três perguntas:

1. **Confiança:** Se eu quebrar o código de produção intencionalmente agora, este teste vai falhar? (Se não falhar, o teste é inútil).
2. **Clareza:** Se este teste falhar daqui a 6 meses, eu vou entender o porquê lendo apenas a descrição (em pt-BR) e a mensagem de erro?
3. **Valor:** Estamos testando regras de negócio ou apenas testando se o JavaScript funciona (ex: testar se `a = b` atribui o valor)?
