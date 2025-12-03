# Script para rodar o backend sem Maven
$ErrorActionPreference = "Stop"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "SISTEMA ROCHA - INICIANDO BACKEND" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Configurar JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.8.9-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Limpar compilações antigas
Write-Host "`nLimpando compilações antigas..." -ForegroundColor Yellow
Remove-Item -Path "target\classes\com\rochatransportes\*" -Recurse -Force -ErrorAction SilentlyContinue

# Compilar classes Java manualmente
Write-Host "Compilando código-fonte..." -ForegroundColor Yellow

$srcPath = "src\main\java"
$targetPath = "target\classes"
$resourcesPath = "src\main\resources"

# Criar diretório target se não existir
New-Item -ItemType Directory -Force -Path $targetPath | Out-Null

# Copiar resources
Copy-Item -Path "$resourcesPath\*" -Destination $targetPath -Recurse -Force

# Compilar com classpath do Maven
& "$env:JAVA_HOME\bin\java" -jar "$env:USERPROFILE\.m2\wrapper\dists\apache-maven-3.9.11\maven-mvnd-1.0-m7-windows-amd64\bin\mvnd.cmd" clean package -DskipTests

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nBackend compilado com sucesso!" -ForegroundColor Green
    Write-Host "Iniciando servidor..." -ForegroundColor Yellow
    
    # Iniciar aplicação
    & "$env:JAVA_HOME\bin\java" -jar "target\sistema-rocha-backend-1.0.0.jar"
} else {
    Write-Host "`nERRO na compilação!" -ForegroundColor Red
    exit 1
}
