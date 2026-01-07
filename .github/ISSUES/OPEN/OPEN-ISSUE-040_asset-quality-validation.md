# 🎨 ISSUE-040: Icon & Asset Quality Validation (CWS)

**Status:** 🏗️ Em Progresso (Manifesto Pronto)  
**Prioridade:** 🟡 Média (Pre-Launch Quality)  
**Componente:** `assets/`  
**Versão:** v2.9.7+

---

## 🎯 Objetivo
Validar tecnicamente a qualidade de ícones e assets gráficos para garantir conformidade com Chrome Web Store Quality Guidelines.

## 📖 Contexto: Rejeição por "Quality Issues"

Extensões tecnicamente perfeitas são rejeitadas por:
- Ícones pixelizados (upscale de 16px para 128px)
- Bordas opacas (fundo branco em vez de transparente)
- Formato incorreto (JPEG em vez de PNG)

**Referência MV3 (Relatório Seção 9.1):**  
> "Ícones com bordas incorretas levam a rejeição por Quality Guidelines."

---

## 🛠️ Checklist Técnico de Validação

### 1. Ícones da Extensão (Manifest)
**Arquivos obrigatórios:**
- `assets/icon.png` (atualmente usado para 16, 48, 128)

**Testes:**
- [ ] **Formato:** PNG com transparência alfa (não JPEG, não GIF).
- [ ] **Resolução nativa:** Criar 3 versões separadas:
  - `icon-16.png` (16x16px)
  - `icon-48.png` (48x48px)
  - `icon-128.png` (128x128px)
- [ ] **Não pixelizado:** Cada tamanho renderizado nativamente (não upscale de 16→128).
- [ ] **Bordas transparentes:** Usar fundo transparente, não branco.
- [ ] **Consistência visual:** Mesmo design em todos os tamanhos (apenas escala muda).

**Ferramentas de Validação:**
```bash
# Verificar formato e transparência
file assets/icon-16.png  # Deve retornar "PNG image data"
identify -verbose assets/icon-16.png | grep Alpha  # Deve ter canal alfa
```

---

### 2. Screenshots (Store Listing)
**Conforme Issue-036, mas com validação técnica:**

**Testes:**
- [ ] **Dimensões exatas:** 1280x800 ou 640x400 (não "aproximadamente").
- [ ] **Formato:** PNG ou JPEG alta qualidade (>90%).
- [ ] **Conteúdo:** Mostra UI real (não apenas logo/marketing).
- [ ] **Quantidade:** Mínimo 1, máximo 5.

**Comando de Validação:**
```bash
identify screenshots/*.png | grep -E "(1280x800|640x400)"
```

---

### 3. Promotional Images (Opcional)
Se usarmos "featured" images na CWS:
- Small Tile: 440x280
- Large Tile: 920x680
- Marquee: 1400x560

---

## 🛠️ Plano de Correção

Se os ícones atuais falharem:
1. **Redesenhar** em vetor (SVG) para escalabilidade perfeita.
2. **Exportar** 3 tamanhos nativos do SVG.
3. **Testar** com `pngcheck` ou similar.

---

## ✅ Critérios de Aceite
- [ ] 3 ícones separados (16, 48, 128) criados e validados.
- [x] `manifest.json` atualizado para referenciar arquivos corretos.
- [ ] Screenshots em dimensões exatas (1280x800).
- [ ] Zero warnings de `pngcheck` ou `identify`.

---

**Relacionado:** Issue-036 (CWS Metadata)  

## 🔗 GitHub Issue

- **Status:** N/A
- **Link:** Aguardando publicação
- **Data:** -

---
**Tags:** `//ISSUE-asset-quality` | **Tipo:** Quality/Pre-Launch
