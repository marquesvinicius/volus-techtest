Param(
    [switch]$SkipBackendInstall,
    [switch]$SkipFrontendInstall
)

$ErrorActionPreference = 'Stop'

Write-Host "==============================" -ForegroundColor Cyan
Write-Host " Configuração automática (setup)" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Resolve-Path (Join-Path $scriptDir "..")

function Ensure-Backend {
    $backendPath = Join-Path $rootDir "backend"
    Write-Host "[1/3] Backend" -ForegroundColor Yellow
    Push-Location $backendPath

    if (-not (Test-Path '.venv/Scripts/Activate.ps1')) {
        Write-Host "Criando ambiente virtual (.venv)" -ForegroundColor Gray
        python -m venv .venv
    }

    Write-Host "Ativando ambiente virtual" -ForegroundColor Gray
    . .\.venv\Scripts\Activate.ps1

    if (-not $SkipBackendInstall) {
        Write-Host "Instalando dependências Python" -ForegroundColor Gray
        pip install -r requirements.txt
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
    Write-Host "[2/3] Frontend" -ForegroundColor Yellow
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

Write-Host "[3/3] Setup concluído ✅" -ForegroundColor Green
Write-Host "Agora execute scripts/start.ps1 para subir backend e frontend." -ForegroundColor Green


