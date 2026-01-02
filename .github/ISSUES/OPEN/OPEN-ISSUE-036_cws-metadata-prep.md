# 🛡️ ISSUE-036: Chrome Web Store Metadata & Asset Preparation

**Status:** 📋 Aberta  
**Prioridade:** 🟡 Média (Pre-Launch)  
**Componente:** `Marketing`, `assets/`  
**Versão:** v2.10.0+

---

## 🎯 Objetivo
Preparar todos os metadados, ícones e screenshots exigidos pela Chrome Web Store para evitar rejeição por "Quality Guidelines".

## 📖 Contexto: Rejeições por Metadados

Extensões tecnicamente perfeitas são rejeitadas por:
- Ícones pixelizados ou com bordas incorretas.
- Screenshots genéricas (só logo, sem mostrar a UI real).
- Descrição com "keyword stuffing" (ex: "Canvas Blackboard Student Grades Cheat").

## 🛠️ Requisitos Obrigatórios

### 1. Ícones (PNG)
- **16x16, 48x48, 128x128** (definidos no manifest).
- **Verificação:** Bordas transparentes, não pixelizados, design consistente.

### 2. Screenshots (Obrigatório)
- **Mínimo 1, Máximo 5** (1280x800 ou 640x400).
- **Conteúdo exigido:** Mostrar a UI real da extensão (sidePanel, curso list).
- ❌ **NÃO aceito:** Apenas logotipo ou marketing abstrato.

#### Screenshots Sugeridos
1. **SidePanel aberto** mostrando lista de cursos.
2. **Detalhes de Semana** com atividades listadas.
3. **Content Script SEI** (autopreenchimento em ação).

### 3. Descrição Detalhada (Listing)
- **Short Description (132 chars max):**
  ```
  Produtividade acadêmica para UNIVESP: organize cursos, navegue atividades e agilize protocolos no SEI.
  ```
- **Full Description (evitar keyword stuffing):**
  ```markdown
  # Central Univesp
  
  Extensão oficial não-oficial para alunos UNIVESP.
  
  ## Funcionalidades
  - **Gestão de Cursos:** Organiza materiais do AVA.
  - **Navegação Inteligente:** Painel lateral com chips.
  - **Autopreenchimento SEI:** Agiliza protocolos.
  
  100% local, sem coleta de dados.
  ```

### 4. Categorias e Tags
- **Categoria Principal:** Productivity
- **Tags sugeridas:** education, student, academic, productivity (max 5).

### 5. 🛡️ Compliance
- **Link da Privacy Policy:** (conforme Issue-035)
- **Suporte URL:** Link do GitHub Issues ou email válido.

## ✅ Critérios de Aceite
- [ ] Ícones 16/48/128 criados e validados.
- [ ] 3+ screenshots reais (não mockups) prontos.
- [ ] Descrição sem keyword stuffing, narrativa coesa.
- [ ] Categoria e tags definidas.

---

**Relacionado:** [CWS Listing Guidelines](https://developer.chrome.com/docs/webstore/images/)  
**Tags:** `//ISSUE-cws-metadata` | **Tipo:** Marketing/Compliance
