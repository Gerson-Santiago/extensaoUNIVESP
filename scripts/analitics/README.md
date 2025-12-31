# 📂 Scripts de Análise e Desenvolvimento

Esta pasta contém scripts utilitários para desenvolvimento e análise do projeto.

---

## 📊 Scripts Disponíveis

### 🎯 **Desenvolvimento e Progresso**

| Script | Descrição | Uso |
|--------|-----------|-----|
| [`show-steps-progress.sh`](./show-steps-progress.sh) | Mostra progresso dos #STEPs com cores e indicador visual | `bash scripts/analitics/show-steps-progress.sh` |

### 📈 **Análise de Código**

| Script | Descrição | Uso |
|--------|-----------|-----|
| [`dashboard.sh`](./dashboard.sh) | Dashboard de análise do projeto | `bash scripts/analitics/dashboard.sh` |
| [`path.sh`](./path.sh) | Análise de caminhos | `bash scripts/analitics/path.sh` |
| [`all_path.sh`](./all_path.sh) | Lista todos os caminhos | `bash scripts/analitics/all_path.sh` |
| [`rows.sh`](./rows.sh) | Conta linhas de código | `bash scripts/analitics/rows.sh` |
| [`ver_log.sh`](./ver_log.sh) | Visualiza logs | `bash scripts/analitics/ver_log.sh` |

---

## 🚀 Quick Start

### Ver Progresso dos STEPs

```bash
# Do diretório raiz do projeto
bash scripts/analitics/show-steps-progress.sh

# Ou criar alias (adicione ao ~/.bashrc)
alias steps='cd ~/extensaoUNIVESP && bash scripts/analitics/show-steps-progress.sh'
```

**Output Esperado:**
```
=======================================
  🎯 STEPs Roadmap de Implementação  
=======================================

#STEP-0
 ✓ (OK) Remova o .skip...          ← Verde = concluído
   📁 ./tests/unit/...

#STEP-1
   Implemente a regex...            ← Amarelo = pendente
   📁 ./shared/logic/...

=======================================
  Progresso: 1/8 STEPs (12%)
  Status: 📝 Iniciando
=======================================
```

---

## 🎓 Material de Estudo

### 📖 LeetCode-Style Problem Set

**Arquivo:** [`.gemini/brain/.../leetcode_steps.md`](file:///home/sant/.gemini/antigravity/brain/2ff1560c-49a7-4da5-9454-f00beb6f95e3/leetcode_steps.md)

**Abrir com:**
```bash
code /home/sant/.gemini/antigravity/brain/2ff1560c-49a7-4da5-9454-f00beb6f95e3/leetcode_steps.md
```

**Conteúdo:**
- 🎯 Descrição de cada STEP
- 💡 Dicas progressivas
- 🔧 Templates de código
- ✅ Test cases
- 🏆 Soluções (reveladas)

### 📚 Outros Materiais

| Material | Link | Descrição |
|----------|------|-----------|
| **Índice de Estudos** | [indice_estudos.md](file:///home/sant/.gemini/antigravity/brain/2ff1560c-49a7-4da5-9454-f00beb6f95e3/indice_estudos.md) | Hub central de aprendizado |
| **Mapa de Arquivos** | [mapa_arquivos_resolucao.md](file:///home/sant/.gemini/antigravity/brain/2ff1560c-49a7-4da5-9454-f00beb6f95e3/mapa_arquivos_resolucao.md) | Quais arquivos revisar |
| **Guia Rápido** | [guia_rapido_comandos.md](file:///home/sant/.gemini/antigravity/brain/2ff1560c-49a7-4da5-9454-f00beb6f95e3/guia_rapido_comandos.md) | Comandos prontos |
| **Aula Completa** | [aula_engenharia_reversa.md](file:///home/sant/.gemini/antigravity/brain/2ff1560c-49a7-4da5-9454-f00beb6f95e3/aula_engenharia_reversa.md) | Teoria profunda |

---

## 🎮 Como Marcar STEP como Concluído

**No código:**

```javascript
// Antes
// #STEP-1: Implementar regex

// Depois de completar
// #STEP-1: (OK) Implementar regex
```

O script detecta `(OK)` e mostra **VERDE COM BACKGROUND**! 🟢

---

## 🛠️ Criar Novos Scripts Aqui

Se criar novos scripts de análise/desenvolvimento, coloque nesta pasta e atualize este README.

**Convenções:**
- Usar `.sh` para bash scripts
- Tornar executável: `chmod +x script.sh`
- Documentar uso no README
- Adicionar comentários no topo do script

---

*Última atualização: 2025-12-30*
