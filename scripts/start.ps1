Param(
    [switch]$SkipSetup
)

$ErrorActionPreference = 'Stop'

Write-Host "==============================" -ForegroundColor Cyan
Write-Host " Inicialização do projeto" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Resolve-Path (Join-Path $scriptDir "..")
$backendPath = Join-Path $rootDir "backend"
$frontendPath = Join-Path $rootDir "frontend"

if (-not $SkipSetup) {
    Write-Host "Executando setup inicial (scripts/setup.ps1)" -ForegroundColor Yellow
    & (Join-Path $scriptDir "setup.ps1")
}

$venvActivate = Join-Path $backendPath ".venv/Scripts/Activate.ps1"
if (-not (Test-Path $venvActivate)) {
    Write-Host "Ambiente virtual não encontrado. Rode scripts/setup.ps1 primeiro." -ForegroundColor Red
    exit 1
}

Write-Host "Abrindo janela para o backend (Django)" -ForegroundColor Yellow
$backendArgs = @(
    "-NoExit",
    "-Command",
    "Set-Location `"$backendPath`"; . .\.venv\Scripts\Activate.ps1; python manage.py runserver"
)
Start-Process "powershell" -ArgumentList $backendArgs

Write-Host "Abrindo janela para o frontend (Vite)" -ForegroundColor Yellow
$frontendArgs = @(
    "-NoExit",
    "-Command",
    "Set-Location `"$frontendPath`"; npm run dev"
)
Start-Process "powershell" -ArgumentList $frontendArgs

Write-Host "Serviços iniciados. Back-end: http://localhost:8000 | Front-end: http://localhost:5173" -ForegroundColor Green
Write-Host "Use o usuário 'Volus' com a senha definida no setup (padrão: volus123)." -ForegroundColor Green


