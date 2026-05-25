Write-Host "====================================" -ForegroundColor Cyan
Write-Host "SISTEMA ROCHA - BACKEND" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

function Resolve-JavaHome {
    if ($env:JAVA_HOME -and (Test-Path (Join-Path $env:JAVA_HOME 'bin\java.exe'))) {
        return $env:JAVA_HOME
    }

    $javaCommand = Get-Command java -ErrorAction SilentlyContinue
    if ($null -ne $javaCommand) {
        return Split-Path -Parent (Split-Path -Parent $javaCommand.Source)
    }

    return $null
}

$resolvedJavaHome = Resolve-JavaHome
if ($null -eq $resolvedJavaHome) {
    Write-Host "ERRO Java nao encontrado" -ForegroundColor Red
    Write-Host "Instale o JDK 17+ ou defina JAVA_HOME antes de rodar este script." -ForegroundColor Yellow
    exit 1
}

$env:JAVA_HOME = $resolvedJavaHome
$env:PATH = "$(Join-Path $env:JAVA_HOME 'bin');$env:PATH"

if (-not (Test-Path (Join-Path $PSScriptRoot 'mvnw.cmd'))) {
    Write-Host "ERRO Maven Wrapper nao encontrado em $PSScriptRoot" -ForegroundColor Red
    exit 1
}

Write-Host "OK JAVA_HOME configurado: $env:JAVA_HOME" -ForegroundColor Green
Write-Host "Iniciando o backend..." -ForegroundColor Green
Write-Host "O backend estara disponivel em: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Pressione Ctrl+C para parar" -ForegroundColor Gray
Write-Host ""

Push-Location $PSScriptRoot
try {
    & .\mvnw.cmd spring-boot:run
    if ($LASTEXITCODE -ne 0) {
        throw "mvnw.cmd retornou o codigo $LASTEXITCODE"
    }
} finally {
    Pop-Location
}
