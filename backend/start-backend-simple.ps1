# Script simples para rodar o backend
# Primeiro instale o Maven seguindo INSTALAR_MAVEN.md

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "SISTEMA ROCHA - BACKEND" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Configurar JAVA_HOME
$javaPath = "C:\Program Files\Eclipse Adoptium\jdk-21.0.8.9-hotspot"
$env:JAVA_HOME = $javaPath
$env:PATH = "$javaPath\bin;$env:PATH"

Write-Host "Verificando instalacao..." -ForegroundColor Yellow
Write-Host ""

# Verificar Java
Write-Host "Java:" -ForegroundColor Cyan
java -version
Write-Host ""

# Verificar Maven
Write-Host "Maven:" -ForegroundColor Cyan
try {
    mvn --version
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "ERRO: Maven nao encontrado!" -ForegroundColor Red
    Write-Host "Instale o Maven seguindo as instrucoes em INSTALAR_MAVEN.md" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opcao rapida com Chocolatey:" -ForegroundColor White
    Write-Host "  choco install maven -y" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "Iniciando o backend..." -ForegroundColor Green
Write-Host "O backend estara disponivel em: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Pressione Ctrl+C para parar" -ForegroundColor Gray
Write-Host ""

cd "$PSScriptRoot"
mvn spring-boot:run
