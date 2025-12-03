# Script para instalar Maven e rodar o backend
# Execute: .\start-backend.ps1

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "SISTEMA ROCHA - INICIANDO BACKEND" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Configurar JAVA_HOME
$javaPath = "C:\Program Files\Eclipse Adoptium\jdk-21.0.8.9-hotspot"
if (Test-Path $javaPath) {
    $env:JAVA_HOME = $javaPath
    Write-Host "OK JAVA_HOME configurado: $javaPath" -ForegroundColor Green
} else {
    Write-Host "ERRO Java nao encontrado em $javaPath" -ForegroundColor Red
    Write-Host "Por favor instale o Java 17+ ou ajuste o caminho" -ForegroundColor Yellow
    exit 1
}

# Verificar se Maven esta instalado
$mavenInstalled = $false
try {
    $null = & mvn --version 2>&1
    $mavenInstalled = $true
    Write-Host "OK Maven encontrado no sistema" -ForegroundColor Green
} catch {
    Write-Host "Maven nao encontrado" -ForegroundColor Yellow
}

# Se Maven nao estiver instalado baixar e usar versao portatil
if (-not $mavenInstalled) {
    $mavenDir = "$PSScriptRoot\maven-portable"
    $mavenBin = "$mavenDir\apache-maven-3.9.6\bin\mvn.cmd"
    
    if (Test-Path $mavenBin) {
        Write-Host "OK Usando Maven portatil" -ForegroundColor Green
        $env:PATH = "$mavenDir\apache-maven-3.9.6\bin;$env:PATH"
    } else {
        Write-Host "Baixando Maven portatil..." -ForegroundColor Yellow
        
        # Criar diretorio
        New-Item -ItemType Directory -Force -Path $mavenDir | Out-Null
        
        # Baixar Maven
        $mavenZip = "$mavenDir\maven.zip"
        $mavenUrl = "https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
        
        Write-Host "Baixando de: $mavenUrl" -ForegroundColor Gray
        try {
            Invoke-WebRequest -Uri $mavenUrl -OutFile $mavenZip -UseBasicParsing
            Write-Host "OK Download concluido" -ForegroundColor Green
            
            # Extrair
            Write-Host "Extraindo..." -ForegroundColor Gray
            Expand-Archive -Path $mavenZip -DestinationPath $mavenDir -Force
            Remove-Item $mavenZip
            
            $env:PATH = "$mavenDir\apache-maven-3.9.6\bin;$env:PATH"
            Write-Host "OK Maven portatil instalado" -ForegroundColor Green
        } catch {
            Write-Host "ERRO ao baixar Maven: $_" -ForegroundColor Red
            Write-Host ""
            Write-Host "SOLUCAO ALTERNATIVA:" -ForegroundColor Yellow
            Write-Host "1. Baixe Maven manualmente: https://maven.apache.org/download.cgi" -ForegroundColor White
            Write-Host "2. Extraia para C:\Program Files\Apache\Maven" -ForegroundColor White
            Write-Host "3. Adicione ao PATH: C:\Program Files\Apache\Maven\bin" -ForegroundColor White
            exit 1
        }
    }
}

Write-Host ""
Write-Host "Iniciando compilacao e execucao do backend..." -ForegroundColor Yellow
Write-Host ""

# Mudar para diretorio do backend
cd "$PSScriptRoot"

# Compilar e executar
try {
    mvn spring-boot:run
} catch {
    Write-Host ""
    Write-Host "ERRO ao executar Maven" -ForegroundColor Red
    Write-Host "Tente executar manualmente: mvn spring-boot:run" -ForegroundColor Yellow
    exit 1
}
