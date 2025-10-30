# Prova Técnica - Desenvolvedor Web Júnior - Vólus

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como parte da prova técnica para a vaga de Desenvolvedor Web Júnior na Vólus. O projeto consiste em um sistema de gerenciamento de produtos com dashboard interativo, filtros dinâmicos e integração com Django.

## 🛠️ Tecnologias Utilizadas

### Backend
- **Django 4.2+**: Framework web Python
- **SQLite**: Banco de dados (desenvolvimento)
- **Pillow**: Processamento de imagens

### Frontend
- **HTML5/CSS3**: Estrutura e estilização
- **JavaScript**: Interatividade e manipulação do DOM
- **Chart.js**: Visualização de dados (dashboard)
- **jQuery**: Manipulação de elementos e filtros dinâmicos

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Python 3.8+** ([Download Python](https://www.python.org/downloads/))
- **pip** (geralmente vem com Python)
- **Git** ([Download Git](https://git-scm.com/downloads))

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd volus-techtest-marques
```

### 2. Crie e ative um ambiente virtual

**Windows (PowerShell):**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
cd backend
python -m venv venv
venv\Scripts\activate.bat
```

**Linux/Mac:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

### 4. Execute as migrações

```bash
python manage.py migrate
```

### 5. Crie um superusuário (opcional)

Para acessar o painel administrativo do Django:

```bash
python manage.py createsuperuser
```

Siga as instruções para criar um usuário administrador.

### 6. Execute o servidor de desenvolvimento

```bash
python manage.py runserver
```

O servidor estará disponível em: `http://127.0.0.1:8000/`

## 📁 Estrutura do Projeto

```
volus-techtest-marques/
├── backend/                 # Aplicação Django
│   ├── config/             # Configurações do projeto
│   │   ├── settings.py     # Configurações principais
│   │   ├── urls.py        # URLs principais
│   │   └── ...
│   ├── core/               # App principal
│   │   ├── models.py      # Modelos de dados
│   │   ├── views.py       # Views e lógica de negócio
│   │   ├── forms.py       # Formulários
│   │   ├── urls.py        # URLs do app
│   │   ├── templates/     # Templates HTML
│   │   └── migrations/    # Migrações do banco
│   ├── manage.py          # Script de gerenciamento Django
│   └── requirements.txt   # Dependências Python
├── frontend/               # Arquivos frontend estáticos
│   ├── assets/
│   │   ├── css/           # Estilos CSS
│   │   ├── js/            # Scripts JavaScript
│   │   └── img/           # Imagens
│   ├── index.html         # Dashboard principal
│   └── filter.html        # Página de filtros
└── docs/                   # Documentação e screenshots
```

## 🎯 Funcionalidades Implementadas

### Dashboard Interativo
- Layout responsivo e mobile-first
- Gráficos dinâmicos com Chart.js
- Menu lateral interativo com submenus
- Validações de formulário avançadas
- Animações e transições suaves

### Filtro Dinâmico
- Filtro multiníveis em cascata
- Seleção múltipla com chips
- Pesquisa em tempo real
- Resetar filtros com animação
- Carregamento dinâmico sem refresh

### Backend Django
- CRUD de produtos
- Sistema de autenticação
- Listagem e detalhamento de produtos
- Validações personalizadas
- Tratamento de exceções

## 🔐 Credenciais de Acesso

Para acessar o sistema, você precisará criar um usuário através do comando `createsuperuser` ou fazer registro através da interface (se implementado).

## 📝 Notas Importantes

- O projeto utiliza **SQLite** como banco de dados para facilitar a execução local
- A `SECRET_KEY` está configurada para desenvolvimento apenas
- O modo `DEBUG` está ativado para facilitar o desenvolvimento
- As migrações já estão incluídas no repositório

## 🐛 Troubleshooting

### Erro ao ativar o ambiente virtual (Windows)
Se encontrar erro de política de execução no PowerShell:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Erro de migrações
Se houver problemas com migrações:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Porta já em uso
Se a porta 8000 estiver ocupada:
```bash
python manage.py runserver 8001
```

## 📄 Licença

Este projeto foi desenvolvido exclusivamente para fins de avaliação técnica.

## 👤 Autor

Desenvolvido como parte da prova técnica para Vólus.

---

**Boa avaliação!** 🚀

