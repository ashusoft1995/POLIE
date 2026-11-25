# ============================================================
# Build backend JAR (run this once after any Java code change)
# Requires Maven. If mvn not on PATH, downloads it via wrapper.
# ============================================================

$ROOT    = $PSScriptRoot
$BACKEND = "$ROOT\backend"

Write-Host ""
Write-Host "Building backend JAR..." -ForegroundColor Cyan

# Try mvn on PATH first
if (Get-Command mvn -ErrorAction SilentlyContinue) {
    Set-Location $BACKEND
    mvn clean package -DskipTests
}
# Try mvnw.cmd wrapper
elseif (Test-Path "$BACKEND\mvnw.cmd") {
    Set-Location $BACKEND
    .\mvnw.cmd clean package -DskipTests
}
else {
    Write-Host ""
    Write-Host "Maven not found. Installing Maven via winget..." -ForegroundColor Yellow
    winget install Apache.Maven --silent
    if ($LASTEXITCODE -eq 0) {
        # Refresh PATH
        $env:PATH = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        Set-Location $BACKEND
        mvn clean package -DskipTests
    } else {
        Write-Host ""
        Write-Host "Could not install Maven automatically." -ForegroundColor Red
        Write-Host "Please install Maven from https://maven.apache.org/download.cgi" -ForegroundColor Yellow
        Write-Host "Then run:  cd backend && mvn clean package -DskipTests" -ForegroundColor Yellow
        pause; exit 1
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host "   JAR: $BACKEND\target\hossana-police-backend-1.0.0.jar" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Build failed. Check errors above." -ForegroundColor Red
}

pause
