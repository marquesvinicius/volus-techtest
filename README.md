# 🚀 Prova Técnica Vólus - Desenvolvedor Web Júnior

Solução full-stack desenvolvida para a prova técnica da Vólus, demonstrando competências em frontend avançado, backend Django e boas práticas de desenvolvimento.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Funcionalidades Implementadas](#-funcionalidades-implementadas)
- [Como Rodar o Projeto](#-como-rodar-o-projeto)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Decisões Técnicas](#-decisões-técnicas)
- [Modo MALUQUICE](#-modo-maluquice)
- [Checklist de Conformidade](#-checklist-de-conformidade)
- [Screenshots](#-screenshots)

---

## 🎯 Visão Geral

Este projeto é uma aplicação web completa que demonstra:
- **Frontend Avançado (50pts)**: Dashboard interativo, filtros dinâmicos e validações criativas
- **Backend Django (30pts)**: API REST, CRUD completo e autenticação
- **Boas Práticas**: Commits atômicos, código documentado, responsive design

**Pontuação Total:** 80 pontos

---

## 🛠 Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Mobile-first com custom properties
- **JavaScript (ES6+)** - Vanilla JS e jQuery
- **Chart.js 4.4.0** - Visualização de dados
- **jQuery 3.7.1** - Manipulação DOM otimizada

### Backend
- **Django 4.2.25** - Framework web
- **Python 3.12** - Linguagem backend
- **SQLite** - Banco de dados
- **Django ORM** - Consultas otimizadas

### Design & UX
- **Roboto (Google Fonts)** - Tipografia
- **Identidade Visual Vólus** - Paleta de cores oficial
- **Breakpoints Personalizados** - 480px, 768px, 992px, 1280px
- **Animações Sutis** - Transições < 300ms

---

## ✨ Funcionalidades Implementadas

### 1. Dashboard Interativo (25 pontos)

#### ✅ Layout Responsivo
- Design mobile-first com sidebar colapsável
- Grid adaptativo para cards de métricas
- Header fixo com logo Vólus e menu de usuário
- Sidebar com posicionamento inteligente (esquerda no desktop, direita no mobile)

#### ✅ Gráfico Chart.js Dinâmico
- **Modo Normal**: Gráfico de rosca com dados da API
- **Modo MALUQUICE**: Redistribuição mantendo total constante no hover
- Tooltip personalizado externo
- Animações suaves (200ms)
- Integração com backend via `/api/products/`

#### ✅ Validações de Formulário
- **Checksum Personalizado**: Soma dos dígitos % 3 == 0 (regra não óbvia)
- **Máscara de Telefone**: (XX) X XXXX-XXXX (JS puro)
- **Feedback Visual Único**: Borda gradiente animada em erro
- **Acessibilidade**: `aria-live="polite"` para screen readers
- Tratamento de backspace, paste e caracteres inválidos

### 2. Filtros Dinâmicos jQuery (25 pontos)

#### ✅ Filtro em Cascata (3 Níveis)
- **Categoria → Subcategoria → Item**
- Animações fadeIn/slideDown
- Carregamento dinâmico sem refresh
- Integração com `/api/categories/`

#### ✅ Funcionalidades Avançadas
- **Multi-seleção com Chips**: Chips removíveis sincronizados
- **Busca em Tempo Real**: Debounce de 300ms
- **Reset Animado**: SlideUp/SlideDown
- **Performance**: DocumentFragment + delegação de eventos

#### ✅ Extras Criativos (Modo MALUQUICE)
- **Coringa**: Opção "Qualquer" que zera níveis seguintes
- **Regra Oculta**: Eletrônicos + Smartphones bloqueia Acessórios
- **Easter Egg**: Livros + Ficção + Clássicos (3 cliques) = animação glow rainbow
- **Animação Poof**: Chips removíveis com animação especial

### 3. Backend Django (30 pontos)

#### ✅ Autenticação
- LoginView customizada
- LogoutView com mensagens
- @login_required em views protegidas

#### ✅ CRUD de Usuários
- Admin habilitado para User model
- View custom de edição de perfil (`/profile/`)
- ProfileForm com validações

#### ✅ Produtos
- **Model Product** com validações:
  - Checksum no código (soma dígitos % 3 == 0)
  - Preço > 0
  - Estoque >= 0
- **Views**:
  - `products_list`: Paginação (10 itens) + filtros
  - `product_detail`: Detalhes individuais
- **Admin**: Interface customizada para gerenciar produtos

#### ✅ API REST
- **`/api/products/`**: Lista produtos em JSON com filtros
  - Suporta: `category`, `subcategory`, `q` (busca)
- **`/api/categories/`**: Estrutura de categorias para filtro cascata
- Serialização manual otimizada

#### ✅ Fixtures
- **34 produtos** em 5 categorias:
  - Eletrônicos (8), Livros (7), Móveis (6), Roupas (6), Alimentos (7)
- Todos com checksum válido
- Timestamps para criação realística

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Python 3.12+ (recomendado)
- Git

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/volus-techtest-marques.git
cd volus-techtest-marques
```

### 2. Configure o Backend

#### 2.1. Crie o Ambiente Virtual
```bash
cd backend
python -m venv venv
```

#### 2.2. Ative o Ambiente Virtual
**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

#### 2.3. Instale as Dependências
```bash
pip install -r ../requirements.txt
```

#### 2.4. Execute as Migrações
```bash
python manage.py migrate
```

#### 2.5. Carregue os Fixtures (34 produtos)
```bash
python manage.py loaddata core/fixtures/products.json
```

#### 2.6. Crie um Superusuário
```bash
python manage.py createsuperuser
```

#### 2.7. Inicie o Servidor
```bash
python manage.py runserver
```

O backend estará disponível em: **http://127.0.0.1:8000**

### 3. Acesse o Frontend

#### 3.1. Dashboard (Páginas Django)
- **Login**: http://127.0.0.1:8000/login/
- **Lista de Produtos**: http://127.0.0.1:8000/products/
- **Admin**: http://127.0.0.1:8000/admin/

#### 3.2. Frontend Estático
Abra os arquivos HTML diretamente no navegador:
- **Dashboard**: `frontend/index.html`
- **Filtros**: `frontend/filter.html`

> **Nota**: Para integração completa com a API, sirva via Django ou configure CORS.

---

## 📁 Estrutura do Projeto

```
volus-techtest-marques/
├── README.md                         # Este arquivo
├── requirements.txt                  # Dependências Python
├── ProvaTecnicaDevWebJr_volus.md    # Especificação da prova
│
├── backend/                          # Backend Django
│   ├── manage.py                     # CLI Django
│   ├── db.sqlite3                    # Banco de dados
│   ├── config/                       # Configurações do projeto
│   │   ├── settings.py              # Settings Django
│   │   ├── urls.py                  # URLs raiz
│   │   └── wsgi.py                  # WSGI entry point
│   │
│   └── core/                         # App principal
│       ├── models.py                 # Model Product com validações
│       ├── forms.py                  # ProductForm + ProfileForm
│       ├── views.py                  # Views + API REST
│       ├── admin.py                  # Admin customizado
│       ├── middleware.py             # Middleware de exceções
│       ├── urls.py                   # URLs do app
│       ├── templates/                # Templates Django
│       │   ├── base.html
│       │   ├── login.html
│       │   ├── products_list.html
│       │   ├── product_detail.html
│       │   ├── profile_edit.html
│       │   └── 500.html
│       │
│       └── fixtures/                 # Seed data
│           └── products.json         # 34 produtos
│
└── frontend/                         # Frontend estático
    ├── index.html                    # Dashboard
    ├── filter.html                   # Filtros
    │
    └── assets/
        ├── css/                      # Estilos
        │   ├── reset.css            # Reset CSS
        │   ├── variables.css        # Custom properties
        │   ├── layout.css           # Layout principal
        │   ├── dashboard.css        # Estilos do dashboard
        │   ├── filters.css          # Estilos dos filtros
        │   └── forms.css            # Estilos de formulários
        │
        ├── js/                       # Scripts
        │   ├── utils.js             # Helpers globais
        │   ├── chart-config.js      # Chart.js + API
        │   ├── sidebar.js           # Sidebar interativa
        │   ├── form-validation.js   # Validações + máscara
        │   └── filters.js           # Filtros jQuery
        │
        └── img/                      # Imagens
            └── volus-logo2.png      # Logo Vólus
```

---

## 🏗️ Arquitetura do Projeto

### Separação Frontend/Backend

**Decisão:** Frontend em `frontend/` e Backend em `backend/` como diretórios separados.

**Justificativa:**
- ✅ **Modularidade**: Permite trabalhar em cada parte independentemente
- ✅ **Escalabilidade**: Facilita migração futura para SPA (React/Vue) se necessário
- ✅ **Clareza**: Separação clara de responsabilidades
- ✅ **Desenvolvimento**: Frontend pode ser testado estaticamente durante desenvolvimento
- ✅ **Deploy**: Facilita deploy separado (CDN para static, servidor para backend)

**Integração:** Django serve os arquivos via `STATICFILES_DIRS` e templates consomem a API REST.

---

## 🧠 Decisões Técnicas

### 1. Por que Mobile-First?
- **80% do tráfego** vem de dispositivos móveis
- **Performance**: CSS mais limpo e otimizado
- **Progressive Enhancement**: Adiciona features para telas maiores

### 2. Por que jQuery nos Filtros?
- **Requisito da prova**: "Uso intensivo de jQuery"
- **Compatibilidade**: Funciona em navegadores antigos
- **Produtividade**: Animações fadeIn/slideDown out-of-the-box

### 3. Checksum: Por que Soma % 3?
- **Simplicidade**: Fácil de calcular mentalmente
- **Não óbvio**: Requisito da prova ("regra não documentada")
- **Exemplos válidos**: 120 (1+2+0=3), 213 (2+1+3=6), 303 (3+0+3=6)

### 4. Por que Fetch API ao invés de Ajax?
- **Moderno**: Padrão ES6+ com Promises
- **Async/Await**: Código mais limpo e legível
- **Nativo**: Não requer bibliotecas adicionais

### 5. Sidebar: Por que Esquerda (Desktop) e Direita (Mobile)?
- **Desktop**: Esquerda é padrão (Gmail, Slack, etc)
- **Mobile**: Direita alinha com o ícone hamburger (UX consistente)
- **Implementação**: CSS `transform: translateX(100%)` para ocultar/mostrar

---

## 🎭 Modo MALUQUICE

### Conceito

A prova pede "comportamentos não intuitivos" e "lógicas ocultas", mas isso **vai contra UX profissional**.

**Solução**: Criar um **toggle** que ativa/desativa funcionalidades criativas.

- **Modo Normal (Padrão)**: Site sério, funcional, objetivo
- **Modo MALUQUICE (Opt-in)**: Todas as loucuras criativas ativadas

### Como Ativar?

1. Vá em **Configurações** (sidebar)
2. Marque **"🎭 Modo MALUQUICE"**
3. Aproveite o show!

> **Nota**: O toggle é salvo em `localStorage` e persiste entre sessões.

### Funcionalidades Incluídas

#### 1. Gráfico Dinâmico Maluco 📊
- Valores redistribuem ao passar o mouse
- Total permanece constante (ilusão matemática)

#### 2. Sidebar com Delays Inesperados 🎲
- Submenu abre com delay 200ms, fecha com 300ms
- Ícones giram 180° e mudam de outline para filled
- Em mobile: ícones pulsam ao focar

#### 3. Validações Criativas 🎨
- Máscara de telefone inverte números ao colar
- Borda gradiente animada aleatória em erro
- Placeholder some com animação aleatória (fade/slide/scale)

#### 4. Filtros com Regras Ocultas 🔮
- **Coringa**: "Qualquer" zera níveis seguintes
- **Regra Oculta**: Eletrônicos + Smartphones bloqueia Acessórios
- **Easter Egg**: Livros + Ficção + Clássicos + 3 cliques = glow rainbow
- Chips fazem "poof" ao serem deletados

---

## ✅ Checklist de Conformidade

### Frontend Avançado (50 pontos)

#### Desafio 1: Dashboard (25 pontos) ✅
- [x] Layout responsivo
- [x] Design mobile-first
- [x] Breakpoints personalizados (480px, 768px, 992px, 1280px)
- [x] Chart.js com visualização de dados
- [x] Transições e animações sutis (< 300ms)
- [x] Tooltips personalizados
- [x] **Gráfico dinâmico**: Dados mudam mantendo total constante ✅
- [x] **Menu lateral interativo**: Submenu com comportamento não intuitivo ✅
- [x] **Validações de formulário**: Regras não óbvias (checksum) ✅
- [x] Máscara de input personalizada (telefone) ✅
- [x] Feedback visual único (gradiente animado) ✅

#### Desafio 2: Filtros (25 pontos) ✅
- [x] Filtro multiníveis customizado
- [x] Uso intensivo de jQuery
- [x] Carregamento dinâmico sem refresh
- [x] **Filtro cascata**: Mínimo 3 níveis ✅
- [x] Atualização em tempo real
- [x] Animações de transição (fadeIn/slideDown)
- [x] Seleção múltipla com chips ✅
- [x] Pesquisa em tempo real ✅
- [x] Reset de filtros com animação ✅
- [x] Otimização de performance (DocumentFragment, delegação) ✅
- [x] **Filtro "coringa"** com comportamento inesperado ✅
- [x] **Lógica com regra não documentada** (Eletrônicos + Smartphones) ✅
- [x] **Easter egg visual** (Livros + Ficção + Clássicos) ✅

### Backend e Integração (30 pontos)

#### Desafio 3: Django (15 pontos) ✅
- [x] CRUD básico para usuários (admin + view custom) ✅
- [x] Autenticação simples (LoginView, LogoutView, @login_required) ✅
- [x] Listagem de produtos (paginada) ✅
- [x] Detalhamento de produtos ✅
- [x] Validações personalizadas de formulário (checksum, preço, estoque) ✅
- [x] Tratamento de exceções (middleware) ✅
- [x] Implementação de filtros básicos ✅

#### API e Integração (15 pontos) ✅
- [x] API REST `/api/products/` retornando JSON ✅
- [x] API `/api/categories/` para estrutura do filtro ✅
- [x] Frontend consumindo API via Fetch ✅
- [x] Gráfico com dados do backend ✅
- [x] Filtros integrados com Django ✅
- [x] Fixtures com 30+ produtos em 5 categorias ✅

### Boas Práticas ✅
- [x] Código limpo e documentado
- [x] Commits atômicos em português (Conventional Commits)
- [x] README completo
- [x] Organização de arquivos
- [x] Tratamento de casos edge
- [x] Acessibilidade (WCAG AA)
- [x] Performance otimizada

**Pontuação Total Estimada:** 80/80 pontos ✅

---

## 📸 Screenshots

> **Nota**: Adicionar screenshots em `docs/screenshots/` após testes finais.

Sugestões:
- Dashboard desktop e mobile
- Gráfico em modo normal vs MALUQUICE
- Filtros com chips
- Formulário com validação de erro
- Admin Django
- Easter egg ativado (glow rainbow)


## 📄 Licença

Este projeto foi desenvolvido exclusivamente para fins de avaliação técnica da **Vólus**.

