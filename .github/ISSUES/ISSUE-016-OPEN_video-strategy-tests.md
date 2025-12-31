# 🧪 TEST-COV: Testes da Estratégia de Vídeo (VideoStrategy)

**Status:** 📋 Planejado (v2.9.6)
**Prioridade:** Média (Quality/Scraping)
**Componentes:** `VideoStrategy`, `WeekContentScraper`
**Tipo:** Testes / Scraping

---

## 🔗 Relacionado

**ISSUE Pai:** [ISSUES_v2.9.6](./ISSUES_v2.9.6.md)

A `VideoStrategy` tem cobertura abaixo do ideal (48.38%) e é um dos componentes mais importantes para a experiência do usuário (detecção de aulas).

---

## 📋 Problema Atual

### **Falhas de Detecção:**
Alguns formatos de player (ex: Vimeo embeddado via iframe específico, ou players proprietários da Univesp TV antiga) podem não ser detectados.
A lógica atual foca muito em YouTube e links diretos, deixando `iframes` genéricos com cobertura de teste fraca.

## 📐 Padrões Arquiteturais Obrigatórios
- **[ADR 000-C: Padrão AAA](../../docs/architecture/ADR_000_C_AAA_TESTING_PATTERN.md)**: Fixtures de HTML devem ser definidas no Arrange.

---

## ✅ Solução Proposta

### **Matriz de Testes de Players:**
Implementar testes que simulem diferentes estruturas de DOM para players de vídeo conhecidos da Univesp.

### **Cenários de DOM:**
1.  **YouTube Iframe:** Padrão atual.
2.  **Vimeo Iframe:** Comuns em cursos mais antigos.
3.  **HTML5 Video Tag:** Uploads diretos (raro mas possível).
4.  **Links Externos:** Link com ícone de vídeo mas sem player embed.

---

## 🛠️ Implementação Proposta

### **Arquivo de Teste:**
`features/courses/services/WeekContentScraper/strategies/__tests__/VideoStrategy.test.js`

```javascript
test('deve detectar iframe do Vimeo', () => {
    document.body.innerHTML = '<iframe src="https://player.vimeo.com/video/123" title="Aula Vimeo"></iframe>';
    const strategy = new VideoStrategy();
    const result = strategy.parse(document.body);
    
    expect(result).toContainEqual(expect.objectContaining({
        type: 'video',
        url: expect.stringContaining('vimeo.com')
    }));
});
```

---

## 🧪 Plano de Testes

### **Cenários a Cobrir:**
1.  **Detecção por SRC:** Iframes com `youtube`, `vimeo`, `univesp.tv`.
2.  **Detecção por Título:** Links que contêm "Vídeo Aula" no texto.
3.  **Metadados:** Extração correta do título da aula a partir do contexto do iframe.
4.  **Deduplicação:** Evitar detectar o mesmo vídeo duas vezes (iframe + link).

---

## ✅ Critérios de Sucesso

- [ ] Testes cobrindo pelo menos 3 tipos de players diferentes.
- [ ] Validação de que Iframes de publicidade ou outros conteúdos não são falsos positivos.
- [ ] Cobertura de statements da `VideoStrategy.js` > 90%.

---

**Tags:** `//ISSUE-video-strategy-coverage` | **Tipo:** Testing | **Versão:** 2.9.6
**Criado:** 2025-12-31 | **Autor:** Prof. Antigravity
