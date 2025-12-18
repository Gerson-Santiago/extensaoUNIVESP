# 🗺️ Plano de Migração: Screaming Architecture

Este documento descreve o "Esqueleto" da nova arquitetura e as etapas para migrar o projeto atual (`sidepanel/`, `scripts/`) para o novo modelo orientado a domínios.

## 💀 O Novo Esqueleto (Target Structure)

> **🚀 Protocolo de Git (Cloud Checkpoints)**
> A cada Fase concluída (ex: Import, Courses):
> 1.  Merge da Feature Branch -> `dev` (Local).
> 2.  **PUSH imediato** para `origin/dev` (Remote).
> 3.  Só então cria-se a branch da próxima fase.
> *Isso garante que `origin/dev` seja sempre um "Save Point" seguro e funcional.*

```
/
├── core/                  # O "Kernel" da extensão (Mecanismos puros)
│   ├── background/        # Service Workers
│   ├── content/           # Injetores genéricos
│   ├── storage/           # Abstração do Chrome Storage
│   └── messaging/         # Barramento de mensagens
│
├── features/              # Onde o negócio vive (Gritando!)
│   ├── auth/              # "Autopreenchimento", Login SEI
│   ├── courses/           # "Meus Cursos", Lista, Progresso
│   ├── grades/            # "Notas", Cálculo de médias (Futuro?)
│   ├── import/            # "Importação", Batch Scraper
│   └── settings/          # Configurações do usuário
│       ├── components/    # UI específica da feature
│       ├── logic/         # Regras de negócio puras
│       └── services/      # Comunicação com externo
│
├── shared/                # Utilitários genéricos (não de negócio)
│   ├── ui/                # Design System (Botões, Modais)
│   └── utils/             # Formatadores de data, texto
│
└── platforms/             # Adaptadores de plataforma (Opcional - Chrome/Firefox)
    └── chrome/            # Manifest, assets específicos
```

---

## 👣 Mini-Etapas de Migração

Não faremos um "Big Bang Rewrite". A migração será gradativa, feature por feature.

### Fase 1: Fundação (Core & Shared)
1.  [ ] Criar pastas base: `core`, `features`, `shared`.
2.  [ ] Mover Design System: `sidepanel/components/Shared/*` -> `shared/ui/`.
3.  [ ] Refatorar Utils: `shared/utils/*.js` mantêm-se, mas revisar dependências.

### Fase 2: Feature "Importação" (Piloto)
Escolhemos Importação pois é isolada e complexa.
1.  [ ] Criar `features/import/`.
2.  [ ] Mover `BatchImportFlow.js` para `features/import/logic/`.
3.  [ ] Mover `batchScraper.js` para `features/import/services/`.
4.  [ ] Extrair UI de Importação para `features/import/components/`.

### Fase 3: Feature "Cursos" (O Core)
1.  [x] Criar `features/courses/`.
2.  [x] Mover `CoursesView.js` -> `features/courses/components/CourseList.js`.
3.  [x] Separar Lógica: Extrair regras de `CourseService.js` para `features/courses/logic/CourseDomain.js`.
4.  [x] Scraper: `ScraperService.js` vai para `features/courses/services/`.

### Fase 4: Limpeza
1.  [x] Remover pastas antigas (`sidepanel/views`, `sidepanel/logic`) quando vazias.
2.  [x] Atualizar imports em todo o projeto.
3.  [x] Atualizar `manifest.json` com novos caminhos.

---

## 🛡️ Regras de Ouro da Migração

1.  **Move & Test**: Moveu um arquivo? Roda os testes.
2.  **No Broken Builds**: A `dev` deve estar sempre funcional.
3.  **Links Relativos**: Cuidado com `../../` em imports. Use alias se configurarmos Webpack futuramente (por enquanto, atenção manual).
