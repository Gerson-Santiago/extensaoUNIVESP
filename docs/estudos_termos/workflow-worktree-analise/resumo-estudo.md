# Estudo: Estratégias de Gerenciamento de Configuração de Software x Git Worktree

## 📌 O que exatamente estamos estudando?

Este estudo se enquadra principalmente em **3 áreas clássicas da Ciência da Computação**:

---

## 1️⃣ **Engenharia de Software**

### Subárea:
**Gerenciamento de configuração e evolução de software**

É aqui que entram:
* Git
* workflows
* branching strategies
* controle de versões
* rastreabilidade de mudanças

### Conceitos teóricos envolvidos:
* **Evolução de software** (Lehman’s Laws)
* **Manutenção corretiva, adaptativa e evolutiva**
* **Controle de mudanças**
* **Isolamento de responsabilidades**
* **Processos de desenvolvimento**

👉 Workflow e worktree são **implementações práticas** desses conceitos.

---

## 2️⃣ **Sistemas de Controle de Versão (SCM – Source Code Management)**

### Campo específico:
**Versionamento distribuído**

Git não é só ferramenta — é um **modelo matemático de grafos acíclicos direcionados (DAG)**.

Estamos estudando:
* grafos de commits
* referências (refs)
* histórico imutável
* operações de cópia vs integração

### Onde entram:
* `merge` → união de grafos
* `rebase` → reescrita de caminho
* `cherry-pick` → transposição de vértices
* `worktree` → múltiplas visões do mesmo grafo

---

## 3️⃣ **Sistemas Operacionais / Sistemas de Arquivos**

Especialmente no **git worktree**.

Estamos estudando na prática:
* compartilhamento de objetos
* separação de estado lógico vs físico
* múltiplas views sobre o mesmo dado
* economia de espaço via hard links / objetos imutáveis

👉 Git aplica conceitos típicos de SO:
* imutabilidade
* referências
* isolamento de contexto

---

## 🎯 O que NÃO estamos estudando (importante)

❌ Linguagem de programação
❌ Framework
❌ Ferramenta específica (Git é meio, não fim)
❌ “Truque de produtividade”

---

## 🧠 Nome acadêmico correto deste estudo

Se você tivesse que nomear isso em um plano de ensino ou TCC:

> **“Estratégias de Gerenciamento de Configuração de Software utilizando Sistemas de Controle de Versão Distribuídos”**

Ou, mais simples:

> **“Modelos de organização e evolução de código-fonte em projetos de software”**

---

## 🔬 Competências em desenvolvimento

Do ponto de vista acadêmico e profissional:
* Pensamento sistêmico
* Modelagem de processos
* Controle de complexidade
* Gestão de risco técnico
* Arquitetura de fluxo de desenvolvimento
* Consciência histórica do código

---

## 🧭 Por que isso é nível Ciência da Computação?

Porque:
* você não está aprendendo **comandos**
* está aprendendo **modelos**
* decisões são **estruturais**
* erros custam caro em sistemas reais

Isso separa:
* operador de ferramenta
* **engenheiro de software**
