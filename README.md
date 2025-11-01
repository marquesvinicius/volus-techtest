# Vólus Tech Test – Dashboard Fullstack

## Visão Geral
Este repositório reúne a solução fullstack desenvolvida para a prova técnica de Desenvolvedor Web Júnior da Vólus. O objetivo foi entregar uma experiência administrativa completa para gestão de produtos e estoque, combinando uma API Python/Django com um frontend React responsivo, interativo e cheio de easter eggs controlados pelo **Modo MALUQUICE**. Além de cumprir os desafios da prova (dashboard rico, filtro multinível sem refresh e backend com autenticação/CRUD), o projeto reflete os requisitos da vaga: Django, React, JavaScript moderno, Tailwind, boas práticas de versionamento e código limpo.

## Arquitetura & Stack
| Camada | Tecnologias | Destaques |
| --- | --- | --- |
| Backend | Python 3.12, Django 4.2, Django REST Framework, SimpleJWT, SQLite | API REST JWT, camada `core` com models, serializers, forms e middleware customizado, validações de negócio (checksum, estoque, preço), filtros e paginação nativos. |
| Frontend | React 19, Vite, TailwindCSS, Chart.js (react-chartjs-2), React Router DOM, React Toastify | SPA protegida por JWT, contexts para auth e tema, serviços HTTP desacoplados, páginas responsivas, gráficos dinâmicos, filtro cascata com chips, Modo MALUQUICE com animações e mini game. |
| Infra/Suporte | Node 20, npm, Vitest (não utilizado), ESLint, documentação em Markdown, screenshots em `docs/` | Scripts padronizados (`npm run dev/build/lint`), fixtures de produtos, capturas para apresentação. |

## Decisões Técnicas
- **Arquitetura em camadas:** o backend foi organizado em domínio (`models`), validação (`forms`/`serializers`), orquestração (`views`/`ViewSets`) e adaptação (`urls`, `middleware`). Essa separação facilita testes, reaproveitamento e evolução contínua.
- **Frontend desacoplado do Django:** apesar das pesquisas indicarem uma abordagem híbrida, optei por manter Django exclusivamente como API. Essa decisão reduz acoplamento, permite evoluir o frontend de forma independente (inclusive com SSR futuro) e casa com o dia a dia Vólus, onde há demanda constante por integrações.
- **Experiência orientada a dados:** gráficos e relatórios usam `Chart.js` com customizações (tooltips, redistribuição dinâmica) e métricas calculadas com `useMemo`, garantindo performance mesmo em datasets maiores.
- **Modo MALUQUICE controlado via `localStorage`:** preferi encapsular os efeitos experimentais (animações, regras escondidas, Snake Game) atrás de uma feature flag persistente. Isso permite apresentar criatividade sem sacrificar usabilidade ou manutenção.
- **Reutilização de validações:** a regra de checksum (soma de dígitos % 3 == 0) vive no modelo Django e é espelhada no frontend via utilitário compartilhado, evitando divergência entre camadas.

## Funcionalidades Entregues
- Dashboard responsivo com métricas de estoque, donut dinâmico e gráfico horizontal dos itens críticos, incluindo interações especiais no Modo MALUQUICE.
- Autenticação JWT (login, registro, refresh, logout com blacklist) e gerenciamento de perfil (edição de dados, alteração de senha, máscara de telefone).
- CRUD completo de produtos com filtros combinados, modal de criação/edição, validações em tempo real e feedback via Toast.
- Filtro cascata 3 níveis (categoria → subcategoria → item) com chips removíveis, busca em tempo real (debounce) e regras ocultas ativadas no modo lúdico.
- Controle de estoque inline (edição célula a célula, status calculado) e relatórios analíticos com gráficos customizados.
- Painel de configurações com toggles de tema, Modo MALUQUICE, cards informativos e easter egg do Jogo da Cobrinha.
- Documentação e screenshots em `docs/screenshots` para agilizar a apresentação do resultado.

## Estrutura de Pastas (resumo)
```
.
├── backend/
│   ├── config/                # Projeto Django (settings, URLs, WSGI)
│   └── core/                  # Aplicação principal (models, serializers, views, fixtures)
├── frontend/
│   ├── src/
│   │   ├── components/        # Layout, charts, formulários e Modo MALUQUICE
│   │   ├── pages/             # Dashboard, Produtos, Relatórios, Configurações etc.
│   │   ├── context/           # AuthContext, ThemeContext
│   │   ├── services/          # Integração com a API Django
│   │   └── utils/             # Validações, máscaras, helpers
├── docs/screenshots/          # Evidências para o README e entrega
└── ProvaTecnicaDevWebJr_volus.md
```

## Configuração e Execução
### Pré-requisitos
- Python 3.12+
- Node.js 20+
- npm 10+

### Setup rápido (PowerShell no Windows)

0. Clone o repositório:
   ```bash
   git clone https://github.com/marquesvinicius/volus-techtest.git
   cd volus-techtest
   ```
1. Abra o PowerShell na RAIZ do projeto (pasta volus-techtest).
2. Execute `./scripts/setup.ps1` (instala dependências, aplica migrações, carrega produtos e garante o usuário `Volus`).
3. Rode `./scripts/start.ps1` para abrir automaticamente duas janelas: backend (`http://localhost:8000`) e frontend (`http://localhost:5173`).
   - Use `./scripts/start.ps1 -SkipSetup` se o ambiente já estiver configurado.
   - Os scripts funcionam mesmo fora do Windows, desde que executados via PowerShell 7+.

   ### Solução de Problemas Comuns

#### Erro: `Python não foi encontrado` ou `Couldn't import Django` no Windows

- **Causa:** O Windows utiliza atalhos para a Microsoft Store que se passam pelo `python.exe`. Isso confunde o script, que precisa instalar a versão correta (Python 3.12) para criar o ambiente virtual.

- **Solução:** Desabilitar os "Aliases de Execução de Aplicativo" para permitir que o script gerencie a instalação.
  1. No menu Iniciar, pesquise por **"Gerenciar aliases de execução de aplicativo"** e abra.
  2. Na lista, encontre `python.exe` e `python3.exe` (ambos de "Instalador de Aplicativo").
  3. **Desative os dois.**
  4. Feche o terminal e abra um novo. Rode `.\scripts\setup.ps1` novamente. O script agora vai identificar a ausência do Python e tentar instalar a versão correta automaticamente.

![Desabilitando os aliases do Python](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fbo9z0xvny36jw3orbgv4.png)


### Setup manual
#### Backend (Django + DRF)
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
python manage.py setup_demo    # migrações + fixtures (idempotente)
python manage.py runserver
```
> A API sobe em `http://localhost:8000`. Ajuste `ALLOWED_HOSTS` e configurações de banco se for publicar.

#### Frontend (React + Vite + Tailwind)
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000" > .env.local
npm run dev
```
- O Vite iniciará em `http://localhost:5173`. As rotas privadas redirecionam para `/login` se não houver JWT válido.
- Para build de produção execute `npm run build` seguido de `npm run preview`.


### Usuários e Login
- Usuário demo garantido pelo comando `setup_demo`: `Volus` / `volus123` (com acesso ao `/admin`).
- Registre-se via `/register` se quiser testar o fluxo completo de onboarding.
- Tokens são armazenados em `localStorage` e renovados via endpoint `/api/auth/refresh/`.

## API REST (resumo)
| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/api/auth/login/` | Login com usuário/senha, retorna `access`, `refresh` e dados do usuário. |
| POST | `/api/auth/register/` | Cadastro de novo usuário (com confirmação de senha). |
| POST | `/api/auth/logout/` | Invalida o refresh token via blacklist. |
| POST | `/api/auth/refresh/` | Emite novo access token a partir do refresh. |
| GET/PUT | `/api/auth/me/` | Perfil autenticado (consulta e atualização parcial). |
| POST | `/api/auth/change-password/` | Troca de senha autenticada com validação de senha antiga. |
| GET | `/api/categories/` | Estrutura hierárquica para o filtro cascata. |
| GET/POST | `/api/products/` | Listagem com filtros (`q`, `category`, `subcategory`, `ordering`) e criação de produtos. |
| GET/PUT/PATCH/DELETE | `/api/products/{id}/` | CRUD completo de produtos. |
| GET | `/api/products/by_category/` | Métricas agregadas por categoria. |

Outras rotas nativas do Django (admin, static) continuam disponíveis para suporte.

## Regras de Negócio e Validações
- **Checksum do SKU:** soma dos dígitos deve ser divisível por 3 (ex.: `ELE-120`). Validado no `model`, `form` e utilitário frontend.
- **Preço positivo e estoque não negativo:** garantido por validações server-side, impedindo inconsistências em inserções diretas na base.
- **Máscara de telefone e verificação de e-mail único** no fluxo de cadastro e edição de perfil.
- **Filtros avançados**: busca multiparamétrica (`q`, categoria, subcategoria, chips de itens), debounce no frontend e filtros server-side para performance.
- **Controle JWT com blacklist** garante logout seguro e bloqueio imediato de tokens comprometidos.

## Testes e Qualidade
- **Lint:** `npm run lint` (frontend) e validações do Django (backend) mantêm o código padronizado.
- **Testes automatizados:** pontos de entrada preparados (`python manage.py test`), porém ainda sem suíte dedicada. A prioridade foi entregar a maior cobertura funcional possível em pouco tempo; próximos passos estão listados abaixo.
- **Monitoramento manual:** listas e gráficos exibem fallbacks quando a API está fora, garantindo UX consistente durante demos.

## Capturas de Tela
As imagens usadas na defesa do projeto estão em `docs/screenshots/`:
- `dashboard-page.png`, `dashboard-mobile-page.png`, `dashboard-menu-bar-page.png`
- `products-page.png`, `categorias-filter-page.png`, `estoque-page.png`
- `relatorios-page.png`, `login-page.png`


---
Projeto construído com foco em escalabilidade, clareza e aderência ao perfil da vaga. Qualquer dúvida ou sugestão, fique à vontade para abrir uma issue ou entrar em contato.

