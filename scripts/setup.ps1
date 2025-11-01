Param(
    [switch]$SkipBackendInstall,
    [switch]$SkipFrontendInstall
)

$ErrorActionPreference = 'Stop'

function Ensure-Python {
    Write-Host "[0/4] Verificando Python..." -ForegroundColor Yellow
    $pythonExists = Get-Command python -ErrorAction SilentlyContinue
    if ($pythonExists) {
        Write-Host "Python encontrado: $($pythonExists.Source)" -ForegroundColor Green
        return
    }

    Write-Host "Python não encontrado no PATH." -ForegroundColor DarkYellow
    $wingetExists = Get-Command winget -ErrorAction SilentlyContinue
    if ($wingetExists) {
        Write-Host "Tentando instalar Python 3.12 via winget (pode exigir permissão de admin)..." -ForegroundColor Gray
        try {
            winget install --id Python.Python.3.12 -e --silent
            Write-Host "Python instalado via winget. Por favor, FECHE este terminal e execute '.\scripts\setup.ps1' novamente." -ForegroundColor Green
            exit
        } catch {
            Write-Host "Falha ao instalar com winget. Verifique suas permissões." -ForegroundColor Red
        }
    }

    Write-Host "------------------------------------------------------------" -ForegroundColor Red
    Write-Host "AÇÃO MANUAL NECESSÁRIA: Instale o Python 3.12" -ForegroundColor Red
    Write-Host "1. Acesse: https://www.python.org/downloads/" -ForegroundColor Red
    Write-Host "2. Baixe e instale o Python 3.12." -ForegroundColor Red
    Write-Host "3. IMPORTANTE: Marque a caixa 'Add Python to PATH' durante a instalação." -ForegroundColor Red
    Write-Host "4. Após instalar, feche e abra um novo terminal e rode o script novamente." -ForegroundColor Red
    Write-Host "------------------------------------------------------------" -ForegroundColor Red
    exit 1
}

Write-Host "==============================" -ForegroundColor Cyan
Write-Host " Configuração automática (setup)" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

Ensure-Python

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Resolve-Path (Join-Path $scriptDir "..")

function Ensure-Backend {
    $backendPath = Join-Path $rootDir "backend"
    Write-Host "[1/4] Backend" -ForegroundColor Yellow
    Push-Location $backendPath

    if (-not (Test-Path '.venv/Scripts/Activate.ps1')) {
        Write-Host "Criando ambiente virtual (.venv)" -ForegroundColor Gray
        python -m venv .venv
    }

    Write-Host "Ativando ambiente virtual" -ForegroundColor Gray
    . .\.venv\Scripts\Activate.ps1

    if (-not $SkipBackendInstall) {
        Write-Host "Instalando dependências Python" -ForegroundColor Gray
        pip install -r ../requirements.txt
    } else {
        Write-Host "Dependências Python puladas (--SkipBackendInstall)." -ForegroundColor DarkYellow
    }

    Write-Host "Executando manage.py setup_demo" -ForegroundColor Gray
    python manage.py setup_demo

    if (Get-Command -Name deactivate -ErrorAction SilentlyContinue) {
        deactivate
    }

    Pop-Location
}

function Ensure-Frontend {
    $frontendPath = Join-Path $rootDir "frontend"
    Write-Host "[2/4] Frontend" -ForegroundColor Yellow
    Push-Location $frontendPath

    if (-not $SkipFrontendInstall) {
        Write-Host "Instalando dependências npm" -ForegroundColor Gray
        npm install
    } else {
        Write-Host "Dependências npm puladas (--SkipFrontendInstall)." -ForegroundColor DarkYellow
    }

    if (-not (Test-Path ".env.local")) {
        Write-Host "Criando .env.local padrão" -ForegroundColor Gray
        "VITE_API_URL=http://localhost:8000" | Out-File -FilePath ".env.local" -Encoding utf8 -NoNewline
    }

    Pop-Location
}

Ensure-Backend
Ensure-Frontend

Write-Host "[3/4] Setup concluído ✅" -ForegroundColor Green
Write-Host "Agora execute scripts/start.ps1 para subir backend e frontend." -ForegroundColor Green


