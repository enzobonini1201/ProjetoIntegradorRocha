$ErrorActionPreference = "Stop"

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

Push-Location $PSScriptRoot
try {
    & .\mvnw.cmd clean package -DskipTests
    if ($LASTEXITCODE -ne 0) {
        throw "mvnw.cmd retornou o codigo $LASTEXITCODE"
    }

    Write-Host "`nBackend compilado com sucesso!" -ForegroundColor Green
    Write-Host "Iniciando servidor..." -ForegroundColor Yellow
    & .\mvnw.cmd spring-boot:run
} finally {
    Pop-Location
}
